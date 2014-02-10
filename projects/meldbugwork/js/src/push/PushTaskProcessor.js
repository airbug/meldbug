//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('PushTaskProcessor')

//@Require('Bug')
//@Require('Class')
//@Require('Exception')
//@Require('Set')
//@Require('bugflow.BugFlow')
//@Require('meldbug.MeldStore')
//@Require('meldbug.TaskDefines')
//@Require('meldbug.TaskProcessor')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Bug                 = bugpack.require('Bug');
var Class               = bugpack.require('Class');
var Exception           = bugpack.require('Exception');
var Set                 = bugpack.require('Set');
var BugFlow             = bugpack.require('bugflow.BugFlow');
var MeldStore           = bugpack.require('meldbug.MeldStore');
var TaskDefines         = bugpack.require('meldbug.TaskDefines');
var TaskProcessor       = bugpack.require('meldbug.TaskProcessor');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $iterableParallel   = BugFlow.$iterableParallel;
var $parallel           = BugFlow.$parallel;
var $series             = BugFlow.$series;
var $task               = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {TaskProcessor}
 */
var PushTaskProcessor = Class.extend(TaskProcessor, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {Logger} logger
     * @param {PushTaskManager} pushTaskManager
     * @param {MeldBucketManager} meldBucketManager
     * @param {MeldTaskManager} meldTaskManager
     * @param {MeldClientManager} meldClientManager
     * @param {MeldManager} meldManager
     * @param {CleanupTaskManager} cleanupTaskManager
     */
    _constructor: function(logger, pushTaskManager, meldBucketManager, meldTaskManager, meldClientManager, meldManager, cleanupTaskManager) {

        this._super(pushTaskManager);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CleanupTaskManager}
         */
        this.cleanupTaskManager         = cleanupTaskManager;

        /**
         * @private
         * @type {Logger}
         */
        this.logger                     = logger;

        /**
         * @private
         * @type {MeldBucketManager}
         */
        this.meldBucketManager          = meldBucketManager;

        /**
         * @private
         * @type {MeldClientManager}
         */
        this.meldClientManager          = meldClientManager;

        /**
         * @private
         * @type {MeldManager}
         */
        this.meldManager                = meldManager;

        /**
         * @private
         * @type {MeldTaskManager}
         */
        this.meldTaskManager            = meldTaskManager;

        /**
         * @private
         * @type {PushTaskManager}
         */
        this.pushTaskManager            = pushTaskManager;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {CleanupTaskManager}
     */
    getCleanupTaskManager: function() {
        return this.cleanupTaskManager;
    },

    /**
     * @return {Logger}
     */
    getLogger: function() {
        return this.logger;
    },

    /**
     * @return {MeldBucketManager}
     */
    getMeldBucketManager: function() {
        return this.meldBucketManager;
    },

    /**
     * @return {MeldClientManager}
     */
    getMeldClientManager: function() {
        return this.meldClientManager;
    },

    /**
     * @return {MeldManager}
     */
    getMeldManager: function() {
        return this.meldManager;
    },

    /**
     * @return {MeldTaskManager}
     */
    getMeldTaskManager: function() {
        return this.meldTaskManager;
    },

    /**
     * @return {PushTaskManager}
     */
    getPushTaskManager: function() {
        return this.pushTaskManager;
    },


    //-------------------------------------------------------------------------------
    // TaskProcessor Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {PushTask} pushTask
     * @param {function(Throwable=)} callback
     */
    doTask: function(pushTask, callback) {

        console.log("Processing PushTask - taskUuid:", pushTask.getTaskUuid());

        var _this                   = this;
        var push                    = pushTask.getPush();
        var meldTransaction         = push.getMeldTransaction();
        var waitForCallUuidSet      = push.getWaitForCallUuidSet();
        var meldCallUuidSet         = new Set();
        $series([
            $task(function(flow) {
                if (push.getToCallUuidSet().isEmpty() && push.getAll()) {
                    _this.getCallUuidSetForTransaction(meldTransaction, function(throwable, callUuidSet) {
                        if (!throwable) {
                            meldCallUuidSet.addAll(callUuidSet);
                        }
                        flow.complete(throwable);
                    })
                } else {
                    meldCallUuidSet.addAll(push.getToCallUuidSet());
                    flow.complete();
                }
            }),
            $task(function(flow) {
                _this.doUpdateAndPush(pushTask, waitForCallUuidSet, meldCallUuidSet, meldTransaction, function(throwable) {
                    flow.complete(throwable);
                })
            }),
            $task(function(flow) {
                _this.pushTaskManager.reportTaskComplete(pushTask, function(throwable) {
                    _this.logger.info("Report PushTask Complete - taskUuid:", pushTask.getTaskUuid());
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (throwable) {
                _this.logger.info("PushTask throwable - taskUuid:", pushTask.getTaskUuid());
                _this.logger.error(throwable);
            }
            if (Class.doesExtend(throwable, Exception)) {
                _this.requeueTask(pushTask, callback);
            } else {
                callback(throwable);
            }
        });
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {MeldTransaction} meldTransaction
     * @param {MeldBucket} meldBucket
     */
    applyTransactionToMeldBucket: function(meldTransaction, meldBucket) {
        var meldStore = new MeldStore(meldBucket);
        meldStore.applyMeldTransaction(meldTransaction);
    },

    /**
     * @param {string} callUuid
     * @param {function(Throwable=)} callback
     */
    queueMeldTaskAndWaitForResponse: function(callUuid, callback) {
        var _this   = this;
        var task    = this.meldTaskManager.generateMeldTask(callUuid);
        $series([
            $task(function(flow) {
                _this.meldTaskManager.subscribeToTaskResult(task, function(message) {
                    if (message.getMessageType() === TaskDefines.MessageTypes.TASK_COMPLETE) {
                        callback();
                    } else if (message.getMessageType() === TaskDefines.MessageTypes.TASK_THROWABLE) {
                        callback(message.getMessageData().throwable);
                    } else {
                        callback(new Exception("Unhandled message type - message.getMessageType():", message.getMessageType()));
                    }
                }, null, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.meldTaskManager.queueTask(task, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (throwable) {
                callback(throwable);
            }
        });
    },

    /**
     * @private
     * @param {PushTask} pushTask
     * @param {Set.<string>} waitForCallUuidSet
     * @param {Set.<string>} meldCallUuidSet
     * @param {MeldTransaction} meldTransaction
     * @param {function(Throwable=)} callback
     */
    doUpdateAndPush: function(pushTask, waitForCallUuidSet, meldCallUuidSet, meldTransaction, callback) {
        var _this                       = this;
        $series([
            $task(function(flow) {
                _this.updateServerMeldDocumentsForCallUuidSet(meldCallUuidSet, meldTransaction, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.pushTaskManager.finishTask(pushTask, function(throwable) {
                    console.log("PushTask FINISHED - taskUuid:", pushTask.getTaskUuid());
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.doPush(waitForCallUuidSet, meldCallUuidSet, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(callback);
    },

    /**
     * @private
     * @param {Set.<string>} waitForCallUuidSet
     * @param {Set.<string>} meldCallUuidSet
     * @param {function(Throwable=)} callback
     */
    doPush: function(waitForCallUuidSet, meldCallUuidSet, callback) {
        var _this                       = this;
        var dontWaitForCallUuidSet      = new Set();
        dontWaitForCallUuidSet.addAll(meldCallUuidSet);
        dontWaitForCallUuidSet.removeAll(waitForCallUuidSet);

        $task(function(flow) {
            waitForCallUuidSet.clone().forEach(function(waitForCallUuid) {
                if (!meldCallUuidSet.contains(waitForCallUuid)) {
                    waitForCallUuidSet.remove(waitForCallUuid);
                }
            });
            _this.pushToCallUuidSet(waitForCallUuidSet, function(throwable) {
                flow.complete(throwable);
            });
        }).execute(callback);

        //NOTE BRN: This code is not part of the above flow because we do not want the completion of this call to have to
        //process every callUuid, only the ones in the waitForCallUuidSet

        $task(function(flow) {
            _this.pushToCallUuidSet(dontWaitForCallUuidSet, function(throwable) {
                flow.complete(throwable);
            });
        }).execute(function(throwable) {
            if (throwable) {
                if (Class.doesExtend(throwable, Exception)) {
                    console.error(throwable.message, throwable.stack);
                } else {
                    throw throwable;
                }
            }
        });
    },

    /**
     * @private
     * @param {MeldTransaction} meldTransaction
     * @param {function(Throwable, Set.<string>=)} callback
     */
    getCallUuidSetForTransaction: function(meldTransaction, callback) {
        var _this = this;
        var meldDocumentKeySet  = new Set();
        var finalCallUuidSet    = new Set();
        meldTransaction.getMeldOperationList().forEach(function(meldOperation) {
            meldDocumentKeySet.add(meldOperation.getMeldDocumentKey());
        });
        $iterableParallel(meldDocumentKeySet, function(flow, meldDocumentKey) {
            _this.meldManager.getCallUuidSetForMeldDocumentKey(meldDocumentKey, function(throwable, callUuidSet) {
                if (!throwable) {
                    finalCallUuidSet.addAll(callUuidSet);
                }
                flow.complete(throwable);
            });
        }).execute(function(throwable) {
            if (!throwable) {
                callback(null, finalCallUuidSet);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @private
     * @param {Set.<string>} callUuidSet
     * @param {function(Throwable=)} callback
     */
    pushToCallUuidSet: function(callUuidSet, callback) {
        var _this = this;
        $iterableParallel(callUuidSet, function(flow, callUuid) {
            var meldClientKey = _this.meldClientManager.generateMeldClientKey(callUuid);
            _this.meldClientManager.getMeldClientForKey(meldClientKey, function(throwable, meldClient) {
                if (meldClient) {
                    var now = (new Date()).getTime();
                    if (meldClient.isActive()) {
                        _this.pushToActiveClient(callUuid, function(throwable) {
                            flow.complete(throwable);
                        })
                    } else if ((now - meldClient.getLastActive().getTime())  > (1000 * 60 * 60)) {
                        _this.queueCleanup(callUuid, function(throwable) {
                            flow.complete(throwable);
                        })
                    } else {
                        // nothing to do
                        flow.complete();
                    }
                } else {
                    _this.queueCleanup(callUuid, function(throwable) {
                        flow.complete(throwable);
                    })
                }
            });
        }).execute(callback);
    },

    /**
     * @private
     * @param {string} callUuid
     * @param {function(Throwable=)} callback
     */
    pushToActiveClient: function(callUuid, callback) {
        var _this                   = this;
        $task(function(flow) {
            _this.queueMeldTaskAndWaitForResponse(callUuid, function(throwable) {
                flow.complete(throwable);
            });
        }).execute(callback);
    },

    /**
     * @private
     * @param {string} callUuid
     * @param {function(Throwable=)} callback
     */
    queueCleanup: function(callUuid, callback) {
        var cleanupTask = this.cleanupTaskManager.generateCleanupTask(callUuid);
        this.cleanupTaskManager.queueTask(cleanupTask, callback);
    },

    /**
     * @private
     * @param {string} callUuid
     * @param {MeldTransaction} meldTransaction
     * @param {function(Throwable=)} callback
     */
    removeCallFromFutureMelds: function(callUuid, meldTransaction, callback) {
        var meldDocumentKeys = [];
        meldTransaction.getMeldOperationList().forEach(function(meldOperation) {
            meldDocumentKeys.push(meldOperation.getMeldDocumentKey());
        });
        this.meldManager.unmeldCallUuidWithMeldDocumentKeys(callUuid, meldDocumentKeys, callback);
    },

    /**
     * @private
     * @param {Set.<string>} callUuidSet
     * @param {MeldTransaction} meldTransaction
     * @param {function(Throwable=)} callback
     */
    updateServerMeldDocumentsForCallUuidSet: function(callUuidSet, meldTransaction, callback) {
        var _this = this;
        $iterableParallel(callUuidSet, function(flow, callUuid) {
            var meldClientKey = _this.meldClientManager.generateMeldClientKey(callUuid);
            _this.meldClientManager.getMeldClientForKey(meldClientKey, function(throwable, meldClient) {
                if (meldClient) {
                    var now = (new Date()).getTime();
                    if (!meldClient.isActive() && (now - meldClient.getLastActive().getTime()) > (1000 * 60 * 60)) {
                        //do nothing
                        flow.complete();
                    } else {
                        _this.updateServerMeldDocument(callUuid, meldTransaction, function(throwable) {
                            flow.complete(throwable)
                        })
                    }
                } else {
                    //do nothing
                    flow.complete();
                }
            });
        }).execute(callback);
    },

    /**
     * @private
     * @param {string} callUuid
     * @param {MeldTransaction} meldTransaction
     * @param {function(Throwable=)} callback
     */
    updateServerMeldDocument: function(callUuid, meldTransaction, callback) {
        var _this                   = this;
        var serverMeldBucketKey     = this.meldBucketManager.generateMeldBucketKey("serverMeldBucket", callUuid);
        var serverMeldBucket        = null;
        var locked                  = false;
        $series([
            $task(function(flow) {
                _this.meldBucketManager.lockMeldBucketForKey(serverMeldBucketKey, function(throwable) {
                    locked = true;
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.meldBucketManager.getMeldBucketForKey(serverMeldBucketKey, function(throwable, meldBucket) {
                    if (!throwable) {
                        serverMeldBucket = meldBucket;
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                if (serverMeldBucket) {
                    _this.applyTransactionToMeldBucket(meldTransaction, serverMeldBucket);
                    _this.meldBucketManager.setMeldBucket(serverMeldBucketKey, serverMeldBucket, function(throwable) {
                        flow.complete(throwable);
                    });
                } else {
                    _this.removeCallFromFutureMelds(callUuid, meldTransaction, function(throwable) {
                        flow.complete(throwable);
                    });
                }
            })
        ]).execute(function(taskThrowable) {
            $task(function(flow) {
                if (locked) {
                    _this.meldBucketManager.unlockMeldBucketForKey(serverMeldBucketKey, function(throwable) {
                        flow.complete(throwable);
                    });
                } else {
                    flow.complete();
                }
            }).execute(function(throwable) {
                if (throwable) {
                    var error = new Bug("StuckError", {}, "Error occurred while trying to unlock after task");
                    error.addCause(throwable);
                    if (taskThrowable) {
                        error.addCause(taskThrowable);
                    }
                    callback(error);
                } else if (taskThrowable) {
                    callback(taskThrowable)
                } else {
                    callback();
                }
            });
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.PushTaskProcessor', PushTaskProcessor);
