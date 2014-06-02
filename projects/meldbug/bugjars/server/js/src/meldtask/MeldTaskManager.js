//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbug.MeldTaskManager')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('UuidGenerator')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('bugtask.TaskManager')
//@Require('meldbug.MeldTask')


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
var MeldTask            = bugpack.require('meldbug.MeldTask');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                 = ArgTag.arg;
var bugmeta             = BugMeta.context();
var module              = ModuleTag.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {TaskManager}
 */
var MeldTaskManager = Class.extend(TaskManager, {

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} callUuid
     * @param {MeldTransaction} meldTransaction
     * @returns {MeldTask}
     */
    generateMeldTask: function(callUuid, meldTransaction) {
        var taskUuid = UuidGenerator.generateUuid();
        return this.factoryMeldTask(taskUuid, callUuid, meldTransaction);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} taskUuid
     * @param {string} callUuid
     * @param {MeldTransaction} meldTransaction
     * @return {MeldTask}
     */
    factoryMeldTask: function(taskUuid, callUuid, meldTransaction) {
        return new MeldTask(taskUuid, callUuid, meldTransaction);
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

bugmeta.tag(MeldTaskManager).with(
    module("meldTaskManager")
        .args([
            arg().ref("logger"),
            arg().ref("blockingRedisClient"),
            arg().ref("redisClient"),
            arg().ref("pubSub"),
            arg().ref("marshaller"),
            arg().value(MeldTaskManager.MELD_TASK_QUEUE)
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldTaskManager', MeldTaskManager);
