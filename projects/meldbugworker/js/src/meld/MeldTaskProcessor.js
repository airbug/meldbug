/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbug.MeldTaskProcessor')

//@Require('Bug')
//@Require('Class')
//@Require('Exception')
//@Require('Flows')
//@Require('bugtask.TaskProcessor')
//@Require('meldbug.MeldStore')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Bug             = bugpack.require('Bug');
    var Class           = bugpack.require('Class');
    var Exception       = bugpack.require('Exception');
    var Flows           = bugpack.require('Flows');
    var TaskProcessor   = bugpack.require('bugtask.TaskProcessor');
    var MeldStore       = bugpack.require('meldbug.MeldStore');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $series         = Flows.$series;
    var $task           = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {TaskProcessor}
     */
    var MeldTaskProcessor = Class.extend(TaskProcessor, {

        _name: "meldbug.MeldTaskProcessor",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Logger} logger
         * @param {MeldTaskManager} meldTaskManager
         * @param {MeldBucketManager} meldBucketManager
         * @param {MeldTransactionPublisher} meldTransactionPublisher
         * @param {MeldTransactionGenerator} meldTransactionGenerator
         * @param {MeldClientManager} meldClientManager
         * @param {CleanupTaskManager} cleanupTaskManager
         */
        _constructor: function(logger, meldTaskManager, meldBucketManager, meldTransactionPublisher, meldTransactionGenerator, meldClientManager, cleanupTaskManager) {

            this._super(meldTaskManager);


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
             * @type {MeldTaskManager}
             */
            this.meldTaskManager            = meldTaskManager;

            /**
             * @private
             * @type {MeldTransactionGenerator}
             */
            this.meldTransactionGenerator   = meldTransactionGenerator;

            /**
             * @private
             * @type {MeldTransactionPublisher}
             */
            this.meldTransactionPublisher   = meldTransactionPublisher;
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
         * @return {MeldTaskManager}
         */
        getMeldTaskManager: function() {
            return this.meldTaskManager;
        },

        /**
         * @return {MeldTransactionGenerator}
         */
        getMeldTransactionGenerator: function() {
            return this.meldTransactionGenerator;
        },

        /**
         * @return {MeldTransactionPublisher}
         */
        getMeldTransactionPublisher: function() {
            return this.meldTransactionPublisher;
        },


        //-------------------------------------------------------------------------------
        // TaskProcessor Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {MeldTask} meldTask
         * @param {function(Throwable=)} callback
         */
        doTask: function(meldTask, callback) {
            this.logger.info("Processing MeldTask - taskUuid:", meldTask.getTaskUuid(), " callUuid:", meldTask.getCallUuid());

            var _this                   = this;
            $series([
                $task(function(flow) {
                    _this.startMeld(meldTask, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                if (throwable) {
                    _this.logger.info("MeldTask throwable - taskUuid:", meldTask.getTaskUuid());
                    _this.logger.error(throwable);
                    if (Class.doesExtend(throwable, Exception)) {
                        _this.requeueTask(meldTask, callback);
                    } else {
                        _this.requeueTask(meldTask, function() {
                            callback(throwable)
                        });
                    }
                } else {
                    callback();
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
         * @private
         * @param {MeldTask} meldTask
         * @param {function(Throwable=)} callback
         */
        doMeld: function(meldTask, callback) {
            var _this                   = this;
            var callUuid                = meldTask.getCallUuid();
            var mirrorMeldBucketKey     = this.meldBucketManager.generateMeldBucketKey("mirrorMeldBucket", callUuid);
            var mirrorMeldBucket        = null;
            var locked                  = false;

            $series([
                $task(function(flow) {
                    _this.meldBucketManager.lockMeldBucketForKey(mirrorMeldBucketKey, function(throwable) {
                        locked = true;
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.meldBucketManager.getMeldBucketForKey(mirrorMeldBucketKey, function(throwable, meldBucket) {
                        if (!throwable) {
                            mirrorMeldBucket = meldBucket;
                        }
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    var originalMeldBucket = mirrorMeldBucket.clone(true);
                    _this.applyTransactionToMeldBucket(meldTask.getMeldTransaction(), mirrorMeldBucket);
                    var meldTransaction = _this.generateTransaction(originalMeldBucket, mirrorMeldBucket);
                    _this.publishTransaction(callUuid, meldTask.getTaskUuid(), meldTransaction, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {

                    //NOTE BRN: We set mirrorMeldBucket here since we have successfully queued messages
                    // that will update the client to the point of the server

                    _this.meldBucketManager.setMeldBucket(mirrorMeldBucketKey, mirrorMeldBucket, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.meldBucketManager.unlockMeldBucketForKey(mirrorMeldBucketKey, function(throwable) {
                        if (!throwable) {
                            locked = false;
                        }
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(taskThrowable) {
                    $task(function(flow) {
                        if (locked) {
                            _this.meldBucketManager.unlockMeldBucketForKey(mirrorMeldBucketKey, function(throwable) {
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
                            callback(taskThrowable);
                        } else {
                            callback();
                        }
                    });
                });
        },

        /**
         * @private
         * @param {MeldBucket} originalMeldBucket
         * @param {MeldBucket} updatedMeldBucket
         * @return {MeldTransaction}
         */
        generateTransaction: function(originalMeldBucket, updatedMeldBucket) {
            return this.meldTransactionGenerator.generateMeldTransactionBetweenMeldBuckets(updatedMeldBucket, originalMeldBucket);
        },

        /**
         * @private
         * @param {string} callUuid
         * @param {string} meldTaskUuid
         * @param {MeldTransaction} meldTransaction
         * @param {function(Throwable=)} callback
         */
        publishTransaction: function(callUuid, meldTaskUuid, meldTransaction, callback) {
            var _this = this;
            if (!meldTransaction.isEmpty()) {
                $series([
                    $task(function(flow) {
                        var callResponseHandler = _this.meldTransactionPublisher.factoryCallResponseHandler(function(throwable, callResponse) {

                            //TODO BRN: Handle callResponses

                            if (!throwable) {
                                if (callResponse.getType() === "Error") {
                                    _this.logger.error("Error occurred on CLIENT");
                                    _this.logger.error(callResponse.getData().error);
                                    $series([
                                        $task(function(flow) {
                                            _this.meldTaskManager.finishTask(meldTaskUuid, function(throwable) {
                                                _this.logger.info("MeldTask FINISHED - taskUuid:", meldTaskUuid);
                                                flow.complete(throwable);
                                            });
                                        }),
                                        $task(function(flow) {
                                            _this.getTaskManager().reportTaskComplete(meldTaskUuid, function(throwable, numberReceived) {

                                                //TEST
                                                _this.logger.info("Reporting MeldTask Complete - taskUuid:", meldTaskUuid);

                                                flow.complete(throwable);
                                            });
                                        })
                                    ]).execute(function(throwable) {
                                        if (throwable) {
                                            _this.logger.error(throwable);
                                        }
                                    });
                                } else if (callResponse.getType() === "Exception") {
                                    $series([
                                        $task(function(flow) {
                                            _this.requeueTask(meldTaskUuid, function(throwable) {
                                                flow.complete(throwable);
                                            });
                                        }),
                                        $task(function(flow) {
                                            _this.getTaskManager().reportTaskThrowable(meldTaskUuid, throwable, function(throwable) {
                                                //TEST
                                                _this.logger.info("Reporting MeldTask Throwable - taskUuid:", meldTaskUuid);
                                                flow.complete(throwable);
                                            })
                                        })
                                    ]).execute(function(throwable) {
                                        if (throwable) {
                                            _this.logger.error(throwable);
                                        }
                                    });
                                } else {
                                    $series([
                                        $task(function(flow) {
                                            _this.meldTaskManager.finishTask(meldTaskUuid, function(throwable) {
                                                _this.logger.info("MeldTask FINISHED - taskUuid:", meldTaskUuid);
                                                flow.complete(throwable);
                                            });
                                        }),
                                        $task(function(flow) {
                                            _this.getTaskManager().reportTaskComplete(meldTaskUuid, function(throwable, numberReceived) {

                                                //TEST
                                                _this.logger.info("Reporting MeldTask Complete - taskUuid:", meldTaskUuid);

                                                flow.complete(throwable);
                                            });
                                        })
                                    ]).execute(function(throwable) {
                                        if (throwable) {
                                            _this.logger.error(throwable);
                                        }
                                    });
                                }
                            } else {
                                $series([
                                    $task(function(flow) {
                                        _this.requeueTask(meldTaskUuid, function(throwable) {
                                            flow.complete(throwable);
                                        });
                                    }),
                                    $task(function(flow) {
                                        _this.getTaskManager().reportTaskThrowable(meldTaskUuid, throwable, function(throwable) {
                                            //TEST
                                            _this.logger.info("Reporting MeldTask Throwable - taskUuid:", meldTaskUuid);
                                            flow.complete(throwable);
                                        })
                                    })
                                ]).execute(function(throwable) {
                                    if (throwable) {
                                        _this.logger.error(throwable);
                                    }
                                });
                            }
                        });

                        _this.meldTransactionPublisher.publishTransactionRequest(callUuid, meldTransaction, callResponseHandler, function(throwable) {
                            if (throwable) {
                                if (Class.doesExtend(throwable, Exception)) {
                                    if (throwable.getType() === "MessageNotDelivered") {
                                        //TODO BRN: Store transaction in to queue for this callUuid
                                        flow.complete();
                                    } else {
                                        flow.error(throwable);
                                    }
                                } else {
                                    flow.error(throwable);
                                }
                            } else {
                                flow.complete();
                            }
                        });
                    })
                ]).execute(callback);
            } else {
                $series([
                    $task(function(flow) {
                        _this.meldTaskManager.finishTask(meldTaskUuid, function(throwable) {
                            _this.logger.info("MeldTask FINISHED - taskUuid:", meldTaskUuid);
                            flow.complete(throwable);
                        });
                    }),
                    $task(function(flow) {
                        _this.getTaskManager().reportTaskComplete(meldTaskUuid, function(throwable, numberReceived) {

                            //TEST
                            _this.logger.info("Reporting MeldTask Complete - taskUuid:", meldTaskUuid);

                            if (!throwable) {
                                if (numberReceived >= 1) {
                                    flow.complete();
                                } else {
                                    flow.error(new Exception("MessageNotDelivered", {}, "No one received the report of task complete"));
                                }
                            } else {
                                flow.complete(throwable);
                            }
                        });
                    })
                ]).execute(callback);
            }
        },

        /**
         * @private
         * @param {MeldTask} meldTask
         * @param {function(Throwable=)} callback
         */
        meldActiveClient: function(meldTask, callback) {
            var _this                   = this;
            $task(function(flow) {
                _this.doMeld(meldTask, function(throwable) {
                    flow.complete(throwable);
                })
            }).execute(callback);
        },

        /**
         * @private
         * @param {MeldTask} meldTask
         * @param {function(Throwable=)} callback
         */
        meldDeactiveClient: function(meldTask, callback) {
            var _this = this;
            $series([
                $task(function(flow) {
                    //TODO BRN: Update the meld bucket, generate messages to queue up for the client in case the client becomes active again
                    flow.complete();
                }),
                $task(function(flow) {
                    _this.meldTaskManager.finishTask(meldTask.getTaskUuid(), function(throwable) {
                        _this.logger.info("MeldTask FINISHED - taskUuid:", meldTask.getTaskUuid());
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.meldTaskManager.reportTaskComplete(meldTask.getTaskUuid(), function(throwable, numberReceived) {

                        //TEST
                        _this.logger.info("Reporting MeldTask Complete - taskUuid:", meldTask.getTaskUuid());

                        if (!throwable) {
                            if (numberReceived >= 1) {
                                flow.complete();
                            } else {
                                flow.error(new Exception("MessageNotDelivered", {}, "No one received the report of task complete"));
                            }
                        } else {
                            flow.complete(throwable);
                        }
                    });
                })
            ]).execute(callback);
        },

        /**
         * @private
         * @param {MeldTask} meldTask
         * @param {function(Throwable=)} callback
         */
        queueCleanup: function(meldTask, callback) {
            var _this = this;
            $series([
                $task(function(flow) {
                    var cleanupTask = _this.cleanupTaskManager.generateCleanupTask(meldTask.getCallUuid());
                    _this.cleanupTaskManager.queueTask(cleanupTask, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.meldTaskManager.finishTask(meldTask.getTaskUuid(), function(throwable) {
                        _this.logger.info("MeldTask FINISHED - taskUuid:", meldTask.getTaskUuid());
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.meldTaskManager.reportTaskComplete(meldTask.getTaskUuid(), function(throwable, numberReceived) {

                        //TEST
                        _this.logger.info("Reporting MeldTask Complete - taskUuid:", meldTask.getTaskUuid());

                        if (!throwable) {
                            if (numberReceived >= 1) {
                                flow.complete();
                            } else {
                                flow.error(new Exception("MessageNotDelivered", {}, "No one received the report of task complete"));
                            }
                        } else {
                            flow.complete(throwable);
                        }
                    });
                })
            ]).execute(callback);
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
         * @param {MeldTask} meldTask
         * @param {function(Throwable=)} callback
         */
        startMeld: function(meldTask, callback) {
            var _this           = this;
            var meldClientKey   = this.meldClientManager.generateMeldClientKey(meldTask.getCallUuid());
            $task(function(flow) {
                _this.meldClientManager.getMeldClientForKey(meldClientKey, function(throwable, meldClient) {
                    if (meldClient) {
                        var now = (new Date()).getTime();
                        if (meldClient.isActive()) {
                            _this.meldActiveClient(meldTask, function(throwable) {
                                flow.complete(throwable);
                            })
                        } else if ((now - meldClient.getLastActive().getTime())  > (1000 * 60 * 60)) {
                            _this.queueCleanup(meldTask, function(throwable) {
                                flow.complete(throwable);
                            })
                        } else {
                            _this.meldDeactiveClient(meldTask, function(throwable) {
                                flow.complete(throwable);
                            })
                        }
                    } else {
                        _this.queueCleanup(meldTask, function(throwable) {
                            flow.complete(throwable);
                        })
                    }
                });
            }).execute(callback);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('meldbug.MeldTaskProcessor', MeldTaskProcessor);
});
