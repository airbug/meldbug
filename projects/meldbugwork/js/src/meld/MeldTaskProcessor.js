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
     * @param {MeldTaskManager} meldTaskManager
     * @param {MeldBucketManager} meldBucketManager
     * @param {MeldTransactionManager} meldTransactionManager
     * @param {MeldTransactionGenerator} meldTransactionGenerator
     */
    _constructor: function(meldTaskManager, meldBucketManager, meldTransactionManager, meldTransactionGenerator) {

        this._super(meldTaskManager);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

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
         * @type {MeldTransactionManager}
         */
        this.meldTransactionManager     = meldTransactionManager;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

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
     * @return {MeldTransactionManager}
     */
    getMeldTransactionManager: function() {
        return this.meldTransactionManager;
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

        console.log("Processing MeldTask - taskUuid:", meldTask.getTaskUuid(), " callUuid:", meldTask.getCallUuid(),
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
                _this.generateAndPublishTransaction(callUuid, serverMeldBucket, mirrorMeldBucket, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {

                //NOTE BRN: We set the mirror to the serverMeldBucket here since we have successfully updated the mirror to the point of the server

                _this.meldBucketManager.setMeldBucket(mirrorMeldBucketKey, serverMeldBucket, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.meldTaskManager.completeTask(meldTask, function(throwable) {
                    console.log("MeldTask complete - taskUuid:", meldTask.getTaskUuid(), " callUuid:", meldTask.getCallUuid());
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
                     if (Class.doesExtend(taskThrowable, Exception)) {
                         if (taskThrowable.getType() === "MessageNotDelivered") {
                             console.warn("MeldTask could not be completed - callUuid:", meldTask.getCallUuid());
                             //TODO BRN: We should retry this message a few times. If it still fails, then what do we do?....
                             callback();
                         }
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
     * @param {string} callUuid
     * @param {MeldBucket} serverMeldBucket
     * @param {MeldBucket} mirrorMeldBucket
     * @param {function(Throwable=)} callback
     */
    generateAndPublishTransaction: function(callUuid, serverMeldBucket, mirrorMeldBucket, callback) {
        var complete        = false;
        var timeoutId       = null;
        var _this           = this;
        var meldTransaction = this.meldTransactionGenerator.generateMeldTransactionBetweenMeldBuckets(serverMeldBucket, mirrorMeldBucket);

        if (!meldTransaction.isEmpty()) {
            $series([
                $task(function(flow) {
                    _this.meldTransactionManager.publishTransactionForCallAndSubscribeToResponse(callUuid, meldTransaction, function(message) {
                        if (!complete) {
                            complete = true;
                            clearTimeout(timeoutId);
                            var messageData = message.getMessageData();
                            var success     = messageData.success;

                            //TEST
                            console.log("MeldTransaction response received for callUuid:", callUuid, " message:", message);

                            if (success) {
                                flow.complete();
                            } else {
                                flow.error(new Exception("MessageFailed"));
                            }
                        }
                    }, null, function(throwable, numberReceived) {

                        //TEST
                        console.log("MeldTransaction published for callUuid:", callUuid, " numberReceived:", numberReceived);

                        if (throwable) {
                            flow.error(throwable);
                        } else {
                            if (numberReceived === 0) {
                                flow.error(new Exception("MessageNotDelivered", {}, "Message was not received by anyone"));
                            } else {
                                if (numberReceived > 1) {
                                    console.warn("more than one server received transaction message. This should not happen");
                                }
                                // do nothing more since we don't want to proceed to the next task until we receive a response
                                // NOTE BRN: There is a chance that the server that received the transaction message could go down
                                // and this would be left hanging.

                                timeoutId = setTimeout(function() {
                                    if (!complete) {
                                        complete = true;
                                        flow.error(new Exception("Timeout"));
                                    }
                                }, 30 * 1000);
                            }
                        }
                    });
                })
            ]).execute(callback);
        } else {
            callback();
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldTaskProcessor', MeldTaskProcessor);
