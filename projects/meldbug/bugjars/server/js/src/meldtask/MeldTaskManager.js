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
    var MeldTask        = bugpack.require('meldbug.MeldTask');


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
    var MeldTaskManager = Class.extend(TaskManager, {

        _name: "meldbug.MeldTaskManager",


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} callUuid
         * @param {MeldTransaction} meldTransaction
         * @return {MeldTask}
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
});
