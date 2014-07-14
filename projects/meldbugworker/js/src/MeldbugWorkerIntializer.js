//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbugworker.MeldbugWorkerInitializer')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('Flows')
//@Require('bugfs.BugFs')
//@Require('bugioc.IInitializingModule')
//@Require('bugioc.ModuleTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    var redis                           = require('redis');


    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                           = bugpack.require('Class');
    var Obj                             = bugpack.require('Obj');
    var Flows                         = bugpack.require('Flows');
    var BugFs                           = bugpack.require('bugfs.BugFs');
    var IInitializingModule               = bugpack.require('bugioc.IInitializingModule');
    var ModuleTag                = bugpack.require('bugioc.ModuleTag');
    var PropertyTag              = bugpack.require('bugioc.PropertyTag');
    var BugMeta                         = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                         = BugMeta.context();
    var module                          = ModuleTag.module;
    var property                        = PropertyTag.property;
    var $parallel                       = Flows.$parallel;
    var $series                         = Flows.$series;
    var $task                           = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var MeldbugWorkerInitializer = Class.extend(Obj, {

        _name: "meldbugworker.MeldbugWorkerInitializer",


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
             * @type {Configbug}
             */
            this.configbug              = null;

            /**
             * @private
             * @type {WorkerManager}
             */
            this.workerManager          = null;
        },



        //-------------------------------------------------------------------------------
        // IInitializingModule Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        deinitializeModule: function(callback) {
            callback();
        },

        /**
         * @param {function(Throwable=)} callback
         */
        initializeModule: function(callback) {
            var _this = this;
            console.log("Initializing MeldbugWorkerConfiguration");

            /** @type {Config} */
            var config = null;
            $series([
                $task(function(flow) {
                    /** @type {string} */
                    var configName  = _this.generateConfigName();
                    _this.loadConfig(configName, function(throwable, loadedConfig) {
                        if (!throwable) {
                            config = loadedConfig;
                        }
                        flow.complete(throwable);
                    });
                }),
                $parallel([
                    $task(function(flow) {
                        _this.workerManager.createWorker("cleanupWorker", {maxConcurrency: config.getProperty("cleanupWorker.maxConcurrency")}, function(throwable) {
                            flow.complete(throwable);
                        });
                    }),
                    $task(function(flow) {
                        _this.workerManager.createWorker("meldWorker", {maxConcurrency: config.getProperty("meldWorker.maxConcurrency")}, function(throwable) {
                            flow.complete(throwable);
                        });
                    }),
                    $task(function(flow) {
                        _this.workerManager.createWorker("pushWorker", {maxConcurrency: config.getProperty("pushWorker.maxConcurrency")}, function(throwable) {
                            flow.complete(throwable);
                        });
                    })
                ])
            ]).execute(callback);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @return {string}
         */
        generateConfigName: function() {
            var configName = "dev";
            var index = process.argv.indexOf("--config");
            if (index > -1) {
                configName = process.argv[index + 1];
            } else if (process.env.CONFIGBUG) {
                configName = process.env.CONFIGBUG;
            }
            return configName;
        },

        /**
         * @private
         * @param {string} configName
         * @param {function(Throwable, Config=)} callback
         */
        loadConfig: function(configName, callback) {
            this.configbug.getConfig(configName, callback);
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(MeldbugWorkerInitializer, IInitializingModule);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(MeldbugWorkerInitializer).with(
        module("meldbugWorkerInitializer")
            .properties([
                property("configbug").ref("configbug"),
                property("workerManager").ref("workerManager")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export("meldbugworker.MeldbugWorkerInitializer", MeldbugWorkerInitializer);
});
