//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldTaskProcessor')

//@Require('Bug')
//@Require('Class')
//@Require('Exception')
//@Require('bugflow.BugFlow')
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
var BugFlow             = bugpack.require('bugflow.BugFlow');
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
var MeldTaskProcessor = Class.extend(TaskProcessor, {

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
     */
    _constructor: function(logger, meldTaskManager, meldBucketManager, meldTransactionPublisher, meldTransactionGenerator) {

        this._super(meldTaskManager);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

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
        var _this                   = this;
        var callUuid                = meldTask.getCallUuid();
        var mirrorMeldBucketKey     = this.meldBucketManager.generateMeldBucketKey("mirrorMeldBucket", callUuid);
        var serverMeldBucketKey     = this.meldBucketManager.generateMeldBucketKey("serverMeldBucket", callUuid);
        var mirrorMeldBucket        = null;
        var serverMeldBucket        = null;
        var locked                  = false;

        this.logger.info("Processing MeldTask - taskUuid:", meldTask.getTaskUuid(), " callUuid:", meldTask.getCallUuid(),
            " mirrorMeldBucketKey:", mirrorMeldBucketKey.toStringKey(), " serverMeldBucketKey:", serverMeldBucketKey.toStringKey());

        $series([
            $task(function(flow) {
                _this.meldBucketManager.lockMeldBucketForKey(mirrorMeldBucketKey, function(throwable) {
                    locked = true;
                    flow.complete(throwable);
                });
            }),
            $parallel([
                $task(function(flow) {
                    _this.meldBucketManager.getMeldBucketForKey(mirrorMeldBucketKey, function(throwable, meldBucket) {
                        if (!throwable) {
                            mirrorMeldBucket = meldBucket;
                        }
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
                })
            ]),
            $task(function(flow) {
                var meldTransaction = _this.generateTransaction(serverMeldBucket, mirrorMeldBucket);
                _this.publishTransaction(callUuid, meldTask, meldTransaction, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {

                //NOTE BRN: We set the mirror to the serverMeldBucket here since we have successfully queued messages
                // that will update the client to the point of the server

                _this.meldBucketManager.setMeldBucket(mirrorMeldBucketKey, serverMeldBucket, function(throwable) {
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
            }),
            $task(function(flow) {
                _this.meldTaskManager.finishTask(meldTask, function(throwable) {
                    _this.logger.info("MeldTask complete - taskUuid:", meldTask.getTaskUuid(), " callUuid:", meldTask.getCallUuid());
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
                    if (taskThrowable) {
                        _this.logger.info("MeldTask throwable - taskUuid:", meldTask.getTaskUuid());
                        _this.logger.error(taskThrowable);
                    }
                    if (Class.doesExtend(taskThrowable, Exception)) {
                         _this.requeueTask(meldTask, callback);
                    } else {
                        callback(taskThrowable)
                    }
                } else {
                     callback();
                }
            });
        });
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {MeldBucket} serverMeldBucket
     * @param {MeldBucket} mirrorMeldBucket
     * @returns {MeldTransaction}
     */
    generateTransaction: function(serverMeldBucket, mirrorMeldBucket) {
        return this.meldTransactionGenerator.generateMeldTransactionBetweenMeldBuckets(serverMeldBucket, mirrorMeldBucket);
    },

    /**
     * @private
     * @param {string} callUuid
     * @param {MeldTask} meldTask
     * @param {MeldTransaction} meldTransaction
     * @param {function(Throwable=)} callback
     */
    publishTransaction: function(callUuid, meldTask, meldTransaction, callback) {
        var _this = this;
        if (!meldTransaction.isEmpty()) {
            $series([
                $task(function(flow) {
                    var callResponseHandler = _this.meldTransactionPublisher.factoryCallResponseHandler(function(throwable, callResponse) {

                        //TODO BRN: Handle callResponses

                        if (!throwable) {
                            _this.getTaskManager().reportTaskComplete(meldTask, function(throwable, numberReceived) {

                                //TEST
                                _this.logger.info("Reporting MeldTask Complete - taskUuid:", meldTask.getTaskUuid());

                                if (!throwable) {
                                    if (numberReceived >= 1) {
                                        //TADA! We're done!
                                    }
                                } else {
                                    _this.logger.error(throwable);
                                }
                            });
                        } else {

                            //TEST
                            _this.logger.info("Reporting MeldTask Throwable - taskUuid:", meldTask.getTaskUuid() + " throwable:", throwable);

                            _this.logger.error(throwable);
                            _this.getTaskManager().reportTaskThrowable(meldTask, throwable, function(throwable) {
                                if (throwable) {
                                    _this.logger.error(throwable);
                                }
                            })
                        }
                    });

                    _this.meldTransactionPublisher.publishTransactionRequest(callUuid, meldTransaction, callResponseHandler, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(callback);
        } else {
            $task(function(flow) {
                _this.getTaskManager().reportTaskComplete(meldTask, function(throwable, numberReceived) {

                    //TEST
                    _this.logger.info("Reporting MeldTask Complete - taskUuid:", meldTask.getTaskUuid());

                    if (!throwable) {
                        if (numberReceived >= 1) {
                            flow.complete();
                        } else {
                            flow.error(new Exception("MessageNotDelivered"));
                        }
                    } else {
                        flow.complete(throwable);
                    }
                });
            }).execute(callback);
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldTaskProcessor', MeldTaskProcessor);
