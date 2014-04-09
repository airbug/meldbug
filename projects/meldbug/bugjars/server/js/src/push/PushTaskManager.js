//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbug.PushTaskManager')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('UuidGenerator')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('bugtask.TaskManager')
//@Require('meldbug.PushTask')


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
var TaskManager         = bugpack.require('bugtask.TaskManager');
var PushTask            = bugpack.require('meldbug.PushTask');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                 = ArgAnnotation.arg;
var bugmeta             = BugMeta.context();
var module              = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {TaskManager}
 */
var PushTaskManager = Class.extend(TaskManager, {

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Push} push
     * @returns {PushTask}
     */
    generatePushTask: function(push) {
        var taskUuid = UuidGenerator.generateUuid();
        return this.factoryPushTask(taskUuid, push);
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
            arg().ref("logger"),
            arg().ref("blockingRedisClient"),
            arg().ref("redisClient"),
            arg().ref("pubSub"),
            arg().ref("marshaller"),
            arg().value(PushTaskManager.PUSH_TASK_QUEUE)
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.PushTaskManager', PushTaskManager);
