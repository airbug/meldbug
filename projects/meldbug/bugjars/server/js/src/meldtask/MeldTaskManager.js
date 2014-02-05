//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldTaskManager')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('UuidGenerator')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('meldbug.MeldTask')
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
var MeldTask            = bugpack.require('meldbug.MeldTask');
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

var MeldTaskManager = Class.extend(TaskManager, {

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} callUuid
     * @returns {MeldTask}
     */
    generateMeldTask: function(callUuid) {
        var taskUuid = UuidGenerator.generateUuid();
        return new MeldTask(taskUuid, callUuid);
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
        return this.factoryMeldTask(taskData.taskUuid, taskData.callUuid)
    },

    /**
     * @protected
     * @param {MeldTask} task
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
     * @returns {MeldTask}
     */
    factoryMeldTask: function(taskUuid, callUuid) {
        return new MeldTask(taskUuid, callUuid);
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @const {string}
 */
MeldTaskManager.MELD_TASK_QUEUE = "meldTaskQueue";


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(MeldTaskManager).with(
    module("meldTaskManager")
        .args([
            arg().ref("logger"),
            arg().ref("blockingRedisClient"),
            arg().ref("redisClient"),
            arg().ref("pubSub"),
            arg().value(MeldTaskManager.MELD_TASK_QUEUE)
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldTaskManager', MeldTaskManager);
