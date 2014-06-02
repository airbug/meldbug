//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbug.CleanupTaskManager')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('UuidGenerator')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('bugtask.TaskManager')
//@Require('meldbug.CleanupTask')


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
var ArgTag       = bugpack.require('bugioc.ArgTag');
var ModuleTag    = bugpack.require('bugioc.ModuleTag');
var BugMeta             = bugpack.require('bugmeta.BugMeta');
var TaskManager         = bugpack.require('bugtask.TaskManager');
var CleanupTask         = bugpack.require('meldbug.CleanupTask');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                 = ArgTag.arg;
var bugmeta             = BugMeta.context();
var module              = ModuleTag.module;


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
        return this.factoryCleanupTask(taskUuid, callUuid);
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

bugmeta.tag(CleanupTaskManager).with(
    module("cleanupTaskManager")
        .args([
            arg().ref("logger"),
            arg().ref("blockingRedisClient"),
            arg().ref("redisClient"),
            arg().ref("pubSub"),
            arg().ref("marshaller"),
            arg().value(CleanupTaskManager.CLEANUP_TASK_QUEUE)
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.CleanupTaskManager', CleanupTaskManager);
