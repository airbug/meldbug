/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbug.PushTaskManager')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('UuidGenerator')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('bugtask.TaskManager')
//@Require('meldbug.PushTask')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Obj             = bugpack.require('Obj');
    var UuidGenerator   = bugpack.require('UuidGenerator');
    var ArgTag          = bugpack.require('bugioc.ArgTag');
    var ModuleTag       = bugpack.require('bugioc.ModuleTag');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var TaskManager     = bugpack.require('bugtask.TaskManager');
    var PushTask        = bugpack.require('meldbug.PushTask');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg             = ArgTag.arg;
    var bugmeta         = BugMeta.context();
    var module          = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {TaskManager}
     */
    var PushTaskManager = Class.extend(TaskManager, {

        _name: "meldbug.PushTaskManager",


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

    bugmeta.tag(PushTaskManager).with(
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
});
