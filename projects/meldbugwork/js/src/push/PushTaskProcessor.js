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
     * @param {PushTaskManager} pushTaskManager
     * @param {MeldBucketManager} meldBucketManager
     * @param {MeldTaskManager} meldTaskManager
     * @param {MeldClientManager} meldClientManager
     * @param {MeldManager} meldManager
     * @param {CleanupTaskManager} cleanupTaskManager
     */
    _constructor: function(pushTaskManager, meldBucketManager, meldTaskManager, meldClientManager, meldManager, cleanupTaskManager) {

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

                //TEST
                console.log("PushTaskProcessor:doTask - push.getToCallUuidSet().isEmpty():", push.getToCallUuidSet().isEmpty(), " push.getAll():", push.getAll());

                if (push.getToCallUuidSet().isEmpty() && push.getAll()) {

                    _this.getCallUuidSetForTransaction(meldTransaction, function(throwable, callUuidSet) {
                        if (!throwable) {
                            meldCallUuidSet.addAll(callUuidSet);
                        }
                        flow.complete(throwable);
                    })
                } else {
                    //TEST
                    console.log("push.getToCallUuidSet().toArray():" + push.getToCallUuidSet().toArray());

                    meldCallUuidSet.addAll(push.getToCallUuidSet());

                    //TEST
                    console.log("MADE IT");

                    flow.complete();
                }
            }),
            $task(function(flow) {

                //TEST
                console.log("Doing push");

                _this.doPush(pushTask, waitForCallUuidSet, meldCallUuidSet, meldTransaction, function(throwable) {
                    flow.complete(throwable);
                })
            }),
            $task(function(flow) {
                _this.pushTaskManager.reportTaskComplete(pushTask, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(callback);
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
                _this.meldTaskManager.subscribeToTaskComplete(task, function(message) {
                    callback();
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
    doPush: function(pushTask, waitForCallUuidSet, meldCallUuidSet, meldTransaction, callback) {
        var _this                       = this;
        var waitForComplete             = false;
        var dontWaitForComplete         = false;
        var dontWaitForCallUuidSet      = new Set();
        dontWaitForCallUuidSet.addAll(meldCallUuidSet);
        dontWaitForCallUuidSet.removeAll(waitForCallUuidSet);

        $task(function(flow) {
            waitForCallUuidSet.clone().forEach(function(waitForCallUuid) {
                if (!meldCallUuidSet.contains(waitForCallUuid)) {
                    waitForCallUuidSet.remove(waitForCallUuid);
                }
            });
            _this.pushToCallUuidSet(waitForCallUuidSet, meldTransaction, function(throwable) {
                flow.complete(throwable);
            });
        }).execute(function(throwable) {
            waitForComplete = true;
            callback(throwable);

            if (dontWaitForComplete) {
                _this.pushTaskManager.finishTask(pushTask, function(throwable) {
                    console.log("PushTask complete - taskUuid:", pushTask.getTaskUuid());
                    if (throwable) {
                        if (Class.doesExtend(throwable, Exception)) {
                            console.error(throwable.message, throwable.stack);
                        } else {
                            throw throwable;
                        }
                    }
                });
            }
        });

        //NOTE BRN: This code is not part of the above flow because we do not want the completion of this call to have to
        //process every callUuid, only the ones in the waitForCallUuidSet

        $task(function(flow) {
            _this.pushToCallUuidSet(dontWaitForCallUuidSet, meldTransaction, function(throwable) {
                flow.complete(throwable);
            });
        }).execute(function(throwable) {
            dontWaitForComplete = true;
            if (throwable) {
                if (Class.doesExtend(throwable, Exception)) {
                    console.error(throwable.message, throwable.stack);
                } else {
                    throw throwable;
                }
            }
            if (waitForComplete) {
                _this.pushTaskManager.finishTask(pushTask, function(throwable) {
                    console.log("PushTask complete - taskUuid:", pushTask.getTaskUuid());
                    if (throwable) {
                        if (Class.doesExtend(throwable, Exception)) {
                            console.error(throwable.message, throwable.stack);
                        } else {
                            throw throwable;
                        }
                    }
                });
            }
        })
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
     * @param {MeldTransaction} meldTransaction
     * @param {function(Throwable=)} callback
     */
    pushToCallUuidSet: function(callUuidSet, meldTransaction, callback) {
        var _this = this;
        $iterableParallel(callUuidSet, function(flow, callUuid) {
            var meldClientKey = _this.meldClientManager.generateMeldClientKey(callUuid);
            _this.meldClientManager.getMeldClientForKey(meldClientKey, function(throwable, meldClient) {
                if (meldClient) {
                    var now = (new Date()).getTime();
                    if (meldClient.isActive()) {
                        _this.pushToActiveClient(callUuid, meldTransaction, function(throwable) {
                            flow.complete(throwable);
                        })
                    } else if ((now - meldClient.getLastActive().getTime())  > (1000 * 60 * 60)) {
                        _this.queueCleanup(callUuid, function(throwable) {
                            flow.complete(throwable);
                        })
                    } else {
                        _this.storeForDeactivatedClient(callUuid, meldTransaction, function(throwable) {
                            flow.complete(throwable)
                        })
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
     * @param {MeldTransaction} meldTransaction
     * @param {function(Throwable=)} callback
     */
    pushToActiveClient: function(callUuid, meldTransaction, callback) {
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
                    $series([
                        $task(function(flow) {
                            _this.applyTransactionToMeldBucket(meldTransaction, serverMeldBucket);
                            _this.meldBucketManager.setMeldBucket(serverMeldBucketKey, serverMeldBucket, function(throwable) {
                                flow.complete(throwable);
                            });
                        }),
                        $task(function(flow) {
                            _this.meldBucketManager.unlockMeldBucketForKey(serverMeldBucketKey, function(throwable) {
                                locked = false;
                                flow.complete(throwable);
                            });
                        }),
                        $task(function(flow) {
                            _this.queueMeldTaskAndWaitForResponse(callUuid, function(throwable) {
                                flow.complete(throwable);
                            });
                        })
                    ]).execute(function(throwable) {
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
                    locked = false;
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
     * @param {string} callUuid
     * @param {MeldTransaction} meldTransaction
     * @param {function(Throwable=)} callback
     */
    storeForDeactivatedClient: function(callUuid, meldTransaction, callback) {
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
