//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('CleanupWorkerConfiguration')
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
//@Require('meldbug.CleanupTaskProcessor')
//@Require('meldbug.TaskProcessor')
//@Require('redis.RedisClient')
//@Require('redis.RedisConfig')
//@Require('redis.RedisEvent')
//@Require('redis.RedisPubSub')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();
var redis                   = require('redis');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var BugFs                   = bugpack.require('bugfs.BugFs');
var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
var ConfigurationAnnotation = bugpack.require('bugioc.ConfigurationAnnotation');
var IConfiguration          = bugpack.require('bugioc.IConfiguration');
var ModuleAnnotation        = bugpack.require('bugioc.ModuleAnnotation');
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var Configbug               = bugpack.require('configbug.Configbug');
var CleanupTaskProcessor    = bugpack.require('meldbug.CleanupTaskProcessor');
var TaskProcessor           = bugpack.require('meldbug.TaskProcessor');
var RedisClient             = bugpack.require('redis.RedisClient');
var RedisConfig             = bugpack.require('redis.RedisConfig');
var RedisEvent              = bugpack.require('redis.RedisEvent');
var RedisPubSub             = bugpack.require('redis.RedisPubSub');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                     = ArgAnnotation.arg;
var bugmeta                 = BugMeta.context();
var configuration           = ConfigurationAnnotation.configuration;
var module                  = ModuleAnnotation.module;
var property                = PropertyAnnotation.property;
var $parallel               = BugFlow.$parallel;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CleanupWorkerConfiguration = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {RedisClient}
         */
        this._blockingRedisClient   = null;

        /**
         * @private
         * @type {CleanupTaskProcessor}
         */
        this._cleanupTaskProcessor  = null;

        /**
         * @private
         * @type {Configbug}
         */
        this._configbug             = null;

        /**
         * @private
         * @type {RedisClient}
         */
        this._redisClient           = null;

        /**
         * @private
         * @type {RedisConfig}
         */
        this._redisConfig           = null;

        /**
         * @private
         * @type {RedisPubSub}
         */
        this._redisPubSub           = null;

        /**
         * @private
         * @type {RedisClient}
         */
        this._subscriberRedisClient = null;
    },


    //-------------------------------------------------------------------------------
    // IConfiguration Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    deinitializeConfiguration: function(callback) {
        var _this = this;
        console.log("Deinitializing CleanupWorkerConfiguration");
        $series([
            $task(function(flow) {
                if (!_this._cleanupTaskProcessor.isStopped()) {
                    var hearProcessorStopped = function(event) {
                        _this._cleanupTaskProcessor.removeEventListener(TaskProcessor.EventTypes.STOPPED, hearProcessorStopped);
                        flow.complete();
                    };
                    _this._cleanupTaskProcessor.addEventListener(TaskProcessor.EventTypes.STOPPED, hearProcessorStopped);
                }
                if (_this._cleanupTaskProcessor.isStarted()) {
                    _this._cleanupTaskProcessor.stop();
                }
            }),
            $task(function(flow) {
                _this._redisPubSub.deinitialize(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                var hearRedisEnd = function(event) {
                    _this._blockingRedisClient.removeEventListener(RedisEvent.EventTypes.END, hearRedisEnd);
                    flow.complete();
                };
                _this._blockingRedisClient.addEventListener(RedisEvent.EventTypes.END, hearRedisEnd);
                _this._blockingRedisClient.quit();
            }),
            $task(function(flow) {
                var hearRedisEnd = function(event) {
                    _this._redisClient.removeEventListener(RedisEvent.EventTypes.END, hearRedisEnd);
                    flow.complete();
                };
                _this._redisClient.addEventListener(RedisEvent.EventTypes.END, hearRedisEnd);
                _this._redisClient.quit();
            }),
            $task(function(flow) {
                var hearRedisEnd = function(event) {
                    _this._subscriberRedisClient.removeEventListener(RedisEvent.EventTypes.END, hearRedisEnd);
                    flow.complete();
                };
                _this._subscriberRedisClient.addEventListener(RedisEvent.EventTypes.END, hearRedisEnd);
                _this._subscriberRedisClient.quit();
            })
        ]).execute(callback);
    },

    /**
     * @param {function(Throwable=)} callback
     */
    initializeConfiguration: function(callback) {
        var _this = this;
        console.log("Initializing CleanupWorkerConfiguration");

        $series([
            $task(function(flow) {
                /** @type {string} */
                var configName  = _this.generateConfigName();
                _this.loadConfig(configName, function(throwable, config) {
                    if (!throwable) {
                        _this.buildConfigs(config);
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this._blockingRedisClient.connect(function(throwable) {
                    flow.complete(throwable);
                })
            }),
            $task(function(flow) {
                _this._redisClient.connect(function(throwable) {
                    flow.complete(throwable);
                })
            }),
            $task(function(flow) {
                _this._subscriberRedisClient.connect(function(throwable) {
                    flow.complete(throwable);
                })
            }),
            $task(function(flow) {
                _this._redisPubSub.initialize(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this._cleanupTaskProcessor.start();
                flow.complete();
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                console.log("CleanupWorkerConfiguration successfully initialized!");
            } else {
                console.log("CleanupWorkerConfiguration encountered an error while initializing - throwable:", throwable);
            }
            callback(throwable);
        });
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {exports} redis
     * @param {RedisConfig} redisConfig
     * @return {RedisClient}
     */
    blockingRedisClient: function(redis, redisConfig) {
        this._blockingRedisClient = new RedisClient(redis, redisConfig);
        return this._blockingRedisClient;
    },

    /**
     * @param {Logger} logger
     * @param {CleanupTaskManager} cleanupTaskManager
     * @param {MeldBucketManager} meldBucketManager
     * @param {MeldManager} meldManager
     * @param {MeldClientManager} meldClientManager
     * @return {CleanupTaskProcessor}
     */
    cleanupTaskProcessor: function(logger, cleanupTaskManager, meldBucketManager, meldManager, meldClientManager) {
        this._cleanupTaskProcessor = new CleanupTaskProcessor(logger, cleanupTaskManager, meldBucketManager, meldManager, meldClientManager);
        return this._cleanupTaskProcessor;
    },

    /**
     * @return {Configbug}
     */
    configbug: function() {
        this._configbug = new Configbug(BugFs.resolvePaths([__dirname, '../../resources/config']));
        return this._configbug;
    },

    /**
     * @return {console|Console}
     */
    console: function() {
        return console;
    },

    /**
     * @return {redis}
     */
    redis: function() {
        return redis;
    },

    /**
     * @param {exports} redis
     * @param {RedisConfig} redisConfig
     * @return {RedisClient}
     */
    redisClient: function(redis, redisConfig) {
        this._redisClient = new RedisClient(redis, redisConfig);
        return this._redisClient;
    },

    /**
     * @return {RedisConfig}
     */
    redisConfig: function() {
        this._redisConfig = new RedisConfig();
        return this._redisConfig;
    },

    /**
     * @param {RedisClient} redisClient
     * @param {RedisClient} subscriberRedisClient
     * @returns {RedisPubSub}
     */
    redisPubSub: function(redisClient, subscriberRedisClient) {
        this._redisPubSub = new RedisPubSub(redisClient, subscriberRedisClient);
        return this._redisPubSub;
    },

    /**
     * @param {exports} redis
     * @param {RedisConfig} redisConfig
     * @return {RedisClient}
     */
    subscriberRedisClient: function(redis, redisConfig) {
        this._subscriberRedisClient = new RedisClient(redis, redisConfig);
        return this._subscriberRedisClient;
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Config} config
     */
    buildConfigs: function(config) {
        this._redisConfig.setHost(config.getProperty("redis.host"));
        this._redisConfig.setPort(config.getProperty("redis.port"));
    },

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

Class.implement(CleanupWorkerConfiguration, IConfiguration);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(CleanupWorkerConfiguration).with(
    configuration("cleanupWorkerConfiguration").modules([
        module("blockingRedisClient")
            .args([
                arg().ref("redis"),
                arg().ref("redisConfig")
            ]),
        module("cleanupTaskProcessor")
            .args([
                arg().ref("logger"),
                arg().ref("cleanupTaskManager"),
                arg().ref("meldBucketManager"),
                arg().ref("meldManager"),
                arg().ref("meldClientManager")
            ]),
        module("configbug"),
        module("console"),
        module("redis"),
        module("redisClient")
            .args([
                arg().ref("redis"),
                arg().ref("redisConfig")
            ]),
        module("redisConfig"),
        module("redisPubSub")
            .args([
                arg().ref("redisClient"),
                arg().ref("subscriberRedisClient")
            ]),
        module("subscriberRedisClient")
            .args([
                arg().ref("redis"),
                arg().ref("redisConfig")
            ])
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("meldbug.CleanupWorkerConfiguration", CleanupWorkerConfiguration);
