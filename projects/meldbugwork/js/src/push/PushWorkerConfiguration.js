//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('PushWorkerConfiguration')
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
//@Require('meldbug.PushTaskProcessor')
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
var PushTaskProcessor       = bugpack.require('meldbug.PushTaskProcessor');
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

var PushWorkerConfiguration = Class.extend(Obj, {

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
         * @type {Configbug}
         */
        this._configbug             = null;

        /**
         * @private
         * @type {PushTaskProcessor}
         */
        this._pushTaskProcessor     = null;

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
        console.log("Initializing PushWorkerConfiguration");
        $series([
            $task(function(flow) {
                var hearProcessorStopped = function(event) {
                    _this._pushTaskProcessor.removeEventListener(TaskProcessor.EventTypes.STOPPED, hearProcessorStopped);
                    flow.complete();
                };
                _this._redisClient.addEventListener(TaskProcessor.EventTypes.STOPPED, hearProcessorStopped);
                _this._redisClient.stop();
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
        console.log("Initializing PushWorkerConfiguration");
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
                _this._pushTaskProcessor.start();
                flow.complete();
            })
        ]).execute(callback);
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
     * @return {Configbug}
     */
    configbug: function() {
        this._configbug = new Configbug(BugFs.resolvePaths([__dirname, '../../resources/config']));
        return this._configbug;
    },

    /**
     * @param {PushTaskManager} pushTaskManager
     * @param {MeldBucketManager} meldBucketManager
     * @param {MeldTaskManager} meldTaskManager
     * @param {MeldClientManager} meldClientManager
     * @param {MeldManager} meldManager
     * @param {CleanupTaskManager} cleanupTaskManager
     * @return {PushTaskProcessor}
     */
    pushTaskProcessor: function(pushTaskManager, meldBucketManager, meldTaskManager, meldClientManager, meldManager, cleanupTaskManager) {
        this._pushTaskProcessor = new PushTaskProcessor(pushTaskManager, meldBucketManager, meldTaskManager, meldClientManager, meldManager, cleanupTaskManager);
        return this._pushTaskProcessor;
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

Class.implement(PushWorkerConfiguration, IConfiguration);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(PushWorkerConfiguration).with(
    configuration("pushWorkerConfiguration").modules([
        module("blockingRedisClient")
            .args([
                arg().ref("redis"),
                arg().ref("redisConfig")
            ]),
        module("configbug"),
        module("pushTaskProcessor")
            .args([
                arg().ref("pushTaskManager"),
                arg().ref("meldBucketManager"),
                arg().ref("meldTaskManager"),
                arg().ref("meldClientManager"),
                arg().ref("meldManager"),
                arg().ref("cleanupTaskManager")
            ]),
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

bugpack.export("meldbug.PushWorkerConfiguration", PushWorkerConfiguration);
