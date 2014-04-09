//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbug.ActivePush')

//@Require('Bug')
//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('Exception')
//@Require('Map')
//@Require('Obj')
//@Require('Set')
//@Require('bugflow.BugFlow')
//@Require('bugtask.TaskDefines')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Bug                 = bugpack.require('Bug');
var Class               = bugpack.require('Class');
var Event               = bugpack.require('Event');
var EventDispatcher     = bugpack.require('EventDispatcher');
var Exception           = bugpack.require('Exception');
var Map                 = bugpack.require('Map');
var Obj                 = bugpack.require('Obj');
var Set                 = bugpack.require('Set');
var BugFlow             = bugpack.require('bugflow.BugFlow');
var TaskDefines         = bugpack.require('bugtask.TaskDefines');


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
 * @extends {EventDispatcher}
 */
var ActivePush = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {Logger} logger
     * @param {MeldTaskManager} meldTaskManager
     * @param {string} pushTaskUuid
     * @param {Set.<string>} meldTaskUuidSet
     */
    _constructor: function(logger, meldTaskManager, pushTaskUuid, meldTaskUuidSet) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {boolean}
         */
        this.completed                  = false;

        /**
         * @private
         * @type {Logger}
         */
        this.logger                     = logger;

        /**
         * @private
         * @type {MeldTaskManager}
         */
        this.meldTaskManager            = meldTaskManager;

        /**
         * @private
         * @type {Set.<string>}
         */
        this.meldTaskUuidSet            = meldTaskUuidSet;

        /**
         * @private
         * @type {string}
         */
        this.pushTaskUuid               = pushTaskUuid;

        /**
         * @private
         * @type {boolean}
         */
        this.started                    = false;

        /**
         * @private
         * @type {Set.<string>}
         */
        this.waitingOnTaskUuidSet       = new Set(meldTaskUuidSet);
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    getCompleted: function() {
        return this.completed;
    },

    /**
     * @return {Logger}
     */
    getLogger: function() {
        return this.logger;
    },

    /**
     * @return {MeldTaskManager}
     */
    getMeldTaskManager: function() {
        return this.meldTaskManager;
    },

    /**
     * @return {Set.<string>}
     */
    getMeldTaskUuidSet: function() {
        return this.meldTaskUuidSet;
    },

    /**
     * @return {string}
     */
    getPushTaskUuid: function() {
        return this.pushTaskUuid;
    },

    /**
     * @return {boolean}
     */
    getStarted: function() {
        return this.started;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    start: function(callback) {
        var _this = this;
        if (!this.started) {
            if (this.meldTaskUuidSet.getCount() > 0) {
                $iterableParallel(this.meldTaskUuidSet, function(flow, meldTaskUuid) {
                    $series([
                        $task(function(flow) {
                            _this.meldTaskManager.subscribeToTaskResult(meldTaskUuid, _this.handleTaskResult, _this, function(throwable) {
                                flow.complete(throwable);
                            });
                        })
                    ]).execute(function(throwable) {
                        if (throwable) {
                            if (Class.doesExtend(throwable, Exception)) {

                                //TODO BRN: Retry processing the MeldTask that we had problems with...

                                flow.complete();
                            } else {
                                flow.error(throwable);
                            }
                        } else {
                            flow.complete();
                        }
                    });
                }).execute(callback);
            } else {
                this.complete();
                callback();
            }
        } else {
            callback(new Bug("IllegalState", {}, "ActivePush already started"));
        }
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    complete: function() {
        if (!this.completed) {
            this.completed = true;
            this.dispatchEvent(new Event(ActivePush.EventTypes.PUSH_COMPLETE));
        } else {
            throw new Bug("IllegalState", {}, "ActivePush already complete");
        }
    },

    /**
     * @private
     * @param {string} taskUuid
     */
    markMeldTaskComplete: function(taskUuid) {
        var result = this.waitingOnTaskUuidSet.remove(taskUuid);
        if (result) {
            if (this.waitingOnTaskUuidSet.isEmpty()) {
                this.complete();
            }
        } else {
            throw new Bug("TaskAlreadyComplete", {}, "ActivePush has already completed MeldTask with taskUuid '" + taskUuid + "'");
        }
    },

    /**
     * @private
     * @param {string} channel
     */
    parseTaskUuidFromChannel: function(channel) {
        return channel.replace("taskResult:", "");
    },


    //-------------------------------------------------------------------------------
    // Message Handlers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Message} message
     * @param {string} channel
     */
    handleTaskResult: function(message, channel) {
        var taskUuid    = this.parseTaskUuidFromChannel(channel);
        if (message.getMessageType() === TaskDefines.MessageTypes.TASK_COMPLETE) {
            this.markMeldTaskComplete(taskUuid);
        } else if (message.getMessageType() === TaskDefines.MessageTypes.TASK_THROWABLE) {
            this.logger.error(message.getMessageData().throwable);
            this.markMeldTaskComplete(taskUuid);
        } else {
            throw new Bug("UnhandledMessage", {}, "Unhandled message type - message.getMessageType():", message.getMessageType());
        }
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @enum {string}
 */
ActivePush.EventTypes = {
    PUSH_COMPLETE: "ActivePush:PushComplete"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.ActivePush', ActivePush);
