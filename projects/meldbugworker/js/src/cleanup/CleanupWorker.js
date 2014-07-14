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

//@Export('meldbug.CleanupWorker')
//@Autoload

//@Require('Class')
//@Require('bugioc.BugIoc')
//@Require('bugmeta.BugMeta')
//@Require('bugwork.Worker')
//@Require('bugwork.WorkerTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var BugIoc      = bugpack.require('bugioc.BugIoc');
    var BugMeta     = bugpack.require('bugmeta.BugMeta');
    var Worker      = bugpack.require('bugwork.Worker');
    var WorkerTag   = bugpack.require('bugwork.WorkerTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var worker      = WorkerTag.worker;
    var bugmeta     = BugMeta.context();


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Worker}
     */
    var CleanupWorker = Class.extend(Worker, {

        _name: "meldbug.CleanupWorker",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {IocContext}
             */
            this.iocContext             = BugIoc.context();

            /**
             * @private
             * @type {ModuleTagScan}
             */
            this.moduleTagScan          = BugIoc.moduleScan(bugmeta);
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {IocContext}
         */
        getIocContext: function() {
            return this.iocContext;
        },

        /**
         * @return {ModuleTagScan}
         */
        getModuleTagScan: function() {
            return this.moduleTagScan;
        },


        //-------------------------------------------------------------------------------
        // Worker Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {function(Throwable=)} callback
         */
        configure: function(callback) {
            var throwable = null;
            try {
                this.moduleTagScan.scanBugpacks([
                    "bugmarsh.Marshaller",
                    "bugmarsh.MarshRegistry",
                    "bugsub.PubSub",
                    "loggerbug.Logger",
                    "meldbug.CleanupTaskManager",
                    "meldbug.CleanupWorkerConfiguration",
                    "meldbug.MeldBuilder",
                    "meldbug.MeldBucketManager",
                    "meldbug.MeldClientManager",
                    "meldbug.MeldManager"
                ]);
                this.iocContext.generate();
            } catch(t) {
                throwable = t;
            }
            callback(throwable);
        },

        /**
         * @protected
         * @param {function(Throwable=)} callback
         */
        deinitialize: function(callback) {
            this.iocContext.stop(callback);
        },

        /**
         * @protected
         * @param {function(Throwable=)} callback
         */
        initialize: function(callback) {
            console.log("Initializing CleanupWorker...");
            this.iocContext.start(callback);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(CleanupWorker).with(
        worker("cleanupWorker")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('meldbug.CleanupWorker', CleanupWorker);
});
