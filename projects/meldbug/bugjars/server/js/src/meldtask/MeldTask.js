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

//@Export('meldbug.MeldTask')

//@Require('Class')
//@Require('bugmarsh.MarshTag');
//@Require('bugmarsh.MarshPropertyTag');
//@Require('bugmeta.BugMeta')
//@Require('bugtask.Task')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var MarshPropertyTag    = bugpack.require('bugmarsh.MarshPropertyTag');
    var MarshTag            = bugpack.require('bugmarsh.MarshTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var Task                = bugpack.require('bugtask.Task');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var marsh               = MarshTag.marsh;
    var property            = MarshPropertyTag.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Task}
     */
    var MeldTask = Class.extend(Task, {

        _name: "meldbug.MeldTask",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} taskUuid
         * @param {string} callUuid
         * @param {MeldTransaction} meldTransaction
         */
        _constructor: function(taskUuid, callUuid, meldTransaction) {

            this._super(taskUuid);


            //-------------------------------------------------------------------------------
            // Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {string}
             */
            this.callUuid               = callUuid;

            /**
             * @private
             * @type {MeldTransaction}
             */
            this.meldTransaction        = meldTransaction;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        getCallUuid: function() {
            return this.callUuid;
        },

        /**
         * @return {MeldTransaction}
         */
        getMeldTransaction: function() {
            return this.meldTransaction;
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(MeldTask).with(
        marsh("MeldTask")
            .properties([
                property("callUuid"),
                property("meldTransaction"),
                property("taskUuid")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('meldbug.MeldTask', MeldTask);
});
