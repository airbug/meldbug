//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('CleanupTaskManager')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('UuidGenerator')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('meldbug.CleanupTask')
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
var CleanupTask         = bugpack.require('meldbug.CleanupTask');
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

var CleanupTaskManager = Class.extend(TaskManager, {


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} callUuid
     * @returns {CleanupTask}
     */
    generateCleanupTask: function(callUuid) {
        var taskUuid = UuidGenerator.generateUuid();
        return new CleanupTask(taskUuid, callUuid);
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
        return this.factoryCleanupTask(taskData.taskUuid, taskData.callUuid)
    },

    /**
     * @protected
     * @param {CleanupTask} task
     * @return {Object}
     */
    unbuildTask: function(task) {
        return {
            taskUuid: task.getTaskUuid(),
            callUuid: task.getCallUuid()
        };
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} taskUuid
     * @param {string} callUuid
     * @returns {CleanupTask}
     */
    factoryCleanupTask: function(taskUuid, callUuid) {
        return new CleanupTask(taskUuid, callUuid);
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @const {string}
 */
CleanupTaskManager.CLEANUP_TASK_QUEUE = "cleanupTaskQueue";


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(CleanupTaskManager).with(
    module("cleanupTaskManager")
        .args([
            arg().ref("redisClient"),
            arg().ref("pubSub"),
            arg().value(CleanupTaskManager.CLEANUP_TASK_QUEUE)
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.CleanupTaskManager', CleanupTaskManager);
