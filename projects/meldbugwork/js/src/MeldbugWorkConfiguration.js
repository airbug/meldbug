//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugwork')

//@Export('MeldbugWorkConfiguration')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugflow.BugFlow')
//@Require('bugfs.BugFs')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ConfigurationAnnotation')
//@Require('bugioc.IConfiguration')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('configbug.Configbug')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();
var redis                           = require('redis');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Obj                             = bugpack.require('Obj');
var BugFlow                         = bugpack.require('bugflow.BugFlow');
var BugFs                           = bugpack.require('bugfs.BugFs');
var ArgAnnotation                   = bugpack.require('bugioc.ArgAnnotation');
var ConfigurationAnnotation         = bugpack.require('bugioc.ConfigurationAnnotation');
var IConfiguration                  = bugpack.require('bugioc.IConfiguration');
var ModuleAnnotation                = bugpack.require('bugioc.ModuleAnnotation');
var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var Configbug                       = bugpack.require('configbug.Configbug');



//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                             = ArgAnnotation.arg;
var bugmeta                         = BugMeta.context();
var configuration                   = ConfigurationAnnotation.configuration;
var module                          = ModuleAnnotation.module;
var property                        = PropertyAnnotation.property;
var $parallel                       = BugFlow.$parallel;
var $series                         = BugFlow.$series;
var $task                           = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldbugWorkConfiguration = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(workerManager) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Configbug}
         */
        this._configbug             = null;

        /**
         * @private
         * @type {WorkerManager}
         */
        this.workerManager          = workerManager;
    },


    //-------------------------------------------------------------------------------
    // IConfiguration Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    deinitializeConfiguration: function(callback) {
        callback();
    },

    /**
     * @param {function(Throwable=)} callback
     */
    initializeConfiguration: function(callback) {
        var _this = this;
        console.log("Initializing MeldbugWorkConfiguration");

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
        ])
        .execute(callback);
    },


    //-------------------------------------------------------------------------------
    // Config Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Configbug}
     */
    configbug: function() {
        this._configbug = new Configbug(BugFs.resolvePaths([__dirname, '../resources/config']));
        return this._configbug;
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
        this._configbug.getConfig(configName, callback);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(MeldbugWorkConfiguration, IConfiguration);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(MeldbugWorkConfiguration).with(
    configuration("meldbugWorkConfiguration")
        .args([
            arg().ref("workerManager")
        ])
        .modules([
            module("configbug")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("meldbugwork.MeldbugWorkConfiguration", MeldbugWorkConfiguration);
