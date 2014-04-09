//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbug.PushTaskProcessor')

//@Require('Bug')
//@Require('Class')
//@Require('Exception')
//@Require('Set')
//@Require('bugflow.BugFlow')
//@Require('bugtask.TaskDefines')
//@Require('bugtask.TaskProcessor')
//@Require('meldbug.ActivePush')


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
var TaskDefines         = bugpack.require('bugtask.TaskDefines');
var TaskProcessor       = bugpack.require('bugtask.TaskProcessor');
var ActivePush          = bugpack.require('meldbug.ActivePush');


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
     * @param {MeldTaskManager} meldTaskManager
     * @param {MeldManager} meldManager
     */
    _constructor: function(logger, pushTaskManager, meldTaskManager, meldManager) {

        this._super(pushTaskManager);


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
     * @return {Logger}
     */
    getLogger: function() {
        return this.logger;
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
                _this.startPush(pushTask, waitForCallUuidSet, meldCallUuidSet, meldTransaction, function(throwable) {
                    flow.complete(throwable);
                })
            })
        ]).execute(function(throwable) {
            if (throwable) {
                _this.logger.info("PushTask throwable - taskUuid:", pushTask.getTaskUuid());
                _this.logger.error(throwable);
                _this.requeueTask(pushTask, callback);
                if (Class.doesExtend(throwable, Exception)) {
                    _this.requeueTask(pushTask, callback);
                } else {
                    _this.requeueTask(pushTask, function() {
                        callback(throwable)
                    });
                }
            } else {
                _this.pushTaskManager.finishTask(pushTask, function(throwable) {
                    console.log("PushTask FINISHED - taskUuid:", pushTask.getTaskUuid());
                    callback(throwable);
                });
            }
        });
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {PushTask} pushTask
     * @param {Set.<MeldTask>} meldTaskSet
     * @return {ActivePush}
     */
    generateActivePush: function(pushTask, meldTaskSet) {
        var meldTaskUuidSet = new Set();
        meldTaskSet.forEach(function(meldTask) {
            meldTaskUuidSet.add(meldTask.getTaskUuid());
        });
        return new ActivePush(this.logger, this.meldTaskManager, pushTask.getTaskUuid(), meldTaskUuidSet);
    },

    /**
     * @private
     * @param {Set.<string>} callUuidSet
     * @param {MeldTransaction} meldTransaction
     * @return {Set.<MeldTask>}
     */
    generateMeldTaskSet: function(callUuidSet, meldTransaction) {
        var _this       = this;
        var taskSet     = new Set();
        callUuidSet.forEach(function(callUuid) {
            var meldTask    = _this.meldTaskManager.generateMeldTask(callUuid, meldTransaction);
            taskSet.add(meldTask);
        });
        return taskSet;
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
     * @param {Set.<MeldTask>} meldTasks
     * @param {function(Throwable=)} callback
     */
    queueMeldTasks: function(meldTasks, callback) {
        var _this   = this;
        $iterableParallel(meldTasks, function(flow, meldTask) {
            _this.meldTaskManager.queueTask(meldTask, function(throwable) {
                flow.complete(throwable);
            });
        }).execute(callback);
    },

    /**
     * @private
     * @param {PushTask} pushTask
     * @param {Set.<string>} waitForCallUuidSet
     * @param {Set.<string>} meldCallUuidSet
     * @param {MeldTransaction} meldTransaction
     * @param {function(Throwable=)} callback
     */
    startPush: function(pushTask, waitForCallUuidSet, meldCallUuidSet, meldTransaction, callback) {
        var _this                       = this;
        var dontWaitForCallUuidSet      = new Set();
        waitForCallUuidSet.retainAll(meldCallUuidSet);
        dontWaitForCallUuidSet.addAll(meldCallUuidSet);
        dontWaitForCallUuidSet.removeAll(waitForCallUuidSet);

        var waitForMeldTaskSet      = this.generateMeldTaskSet(waitForCallUuidSet, meldTransaction);
        var dontWaitForMeldTaskSet  = this.generateMeldTaskSet(dontWaitForCallUuidSet, meldTransaction);
        var waitForActivePush       = this.generateActivePush(pushTask, waitForMeldTaskSet);
        var dontWaitForActivePush   = this.generateActivePush(pushTask, dontWaitForMeldTaskSet);

        waitForActivePush.on(ActivePush.EventTypes.PUSH_COMPLETE, this.hearWaitForPushComplete, this, true);
        dontWaitForActivePush.on(ActivePush.EventTypes.PUSH_COMPLETE, this.hearDontWaitForPushComplete, this, true);

        $series([
            $parallel([
                $task(function(flow) {
                    waitForActivePush.start(function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    dontWaitForActivePush.start(function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]),
            $parallel([
                $task(function(flow) {
                    _this.queueMeldTasks(waitForMeldTaskSet, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.queueMeldTasks(dontWaitForMeldTaskSet, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ])
        ]).execute(callback);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearDontWaitForPushComplete: function(event) {
        var _this           = this;
        var activePush      = event.getTarget();
        var pushTaskUuid    = activePush.getPushTaskUuid();
        //TODO BRN: Any error handling we need to do here?
    },

    /**
     * @private
     * @param {Event} event
     */
    hearWaitForPushComplete: function(event) {
        var _this           = this;
        var activePush      = event.getTarget();
        var pushTaskUuid    = activePush.getPushTaskUuid();

        //TODO BRN: Any error handling we need to do here?

        $task(function(flow) {
            _this.pushTaskManager.reportTaskComplete(pushTaskUuid, function(throwable) {
                _this.logger.info("Report PushTask Complete - taskUuid:", pushTaskUuid);
                flow.complete(throwable);
            });
        }).execute(function(throwable) {
            if (throwable) {
                _this.logger.error(throwable);
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.PushTaskProcessor', PushTaskProcessor);
