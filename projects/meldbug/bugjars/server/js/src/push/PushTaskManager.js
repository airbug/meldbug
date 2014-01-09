//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('PushTaskManager')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('UuidGenerator')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('meldbug.PushTask')
//@Require('meldbug.TaskManager')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var UuidGenerator       = bugpack.require('UuidGenerator');
var ArgAnnotation       = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation    = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta             = bugpack.require('bugmeta.BugMeta');
var PushTask            = bugpack.require('meldbug.PushTask');
var TaskManager         = bugpack.require('meldbug.TaskManager');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                 = ArgAnnotation.arg;
var bugmeta             = BugMeta.context();
var module              = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var PushTaskManager = Class.extend(TaskManager, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {RedisClient} redisClient
     * @param {PubSub} pubSub
     * @param {string} taskQueueName
     * @param {PushBuilder} pushBuilder
     */
    _constructor: function(redisClient, pubSub, taskQueueName, pushBuilder) {

        this._super(redisClient, pubSub, taskQueueName);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {PushBuilder}
         */
        this.pushBuilder    = pushBuilder;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {PushBuilder}
     */
    getPushBuilder: function() {
        return this.pushBuilder;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Push} push
     * @returns {PushTask}
     */
    generatePushTask: function(push) {
        var taskUuid = UuidGenerator.generateUuid();
        return new PushTask(taskUuid, push);
    },


    //-------------------------------------------------------------------------------
    // TaskManager Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {Object} taskData
     * @return {Task}
     */
    buildTask: function(taskData) {
        var push = this.pushBuilder.buildPush(taskData.push);
        return this.factoryPushTask(taskData.taskUuid, push);
    },

    /**
     * @protected
     * @param {PushTask} task
     * @return {Object}
     */
    unbuildTask: function(task) {
        return {
            taskUuid: task.getTaskUuid(),
            push: this.pushBuilder.unbuildPush(task.getPush())
        };
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} taskUuid
     * @param {Push} push
     * @returns {PushTask}
     */
    factoryPushTask: function(taskUuid, push) {
        return new PushTask(taskUuid, push);
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @const {string}
 */
PushTaskManager.PUSH_TASK_QUEUE = "pushTaskQueue";


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(PushTaskManager).with(
    module("pushTaskManager")
        .args([
            arg().ref("redisClient"),
            arg().ref("pubSub"),
            arg().value(PushTaskManager.PUSH_TASK_QUEUE),
            arg().ref("pushBuilder")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.PushTaskManager', PushTaskManager);
