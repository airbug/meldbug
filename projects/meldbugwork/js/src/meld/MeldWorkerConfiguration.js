//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldWorkerConfiguration')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ConfigurationAnnotation')
//@Require('bugioc.IConfiguration')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('meldbug.MeldTaskProcessor')
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
var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
var ConfigurationAnnotation = bugpack.require('bugioc.ConfigurationAnnotation');
var IConfiguration          = bugpack.require('bugioc.IConfiguration');
var ModuleAnnotation        = bugpack.require('bugioc.ModuleAnnotation');
var PropertyAnnotation      = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var MeldTaskProcessor       = bugpack.require('meldbug.MeldTaskProcessor');
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

var MeldWorkerConfiguration = Class.extend(Obj, {

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
         * @type {MeldTaskProcessor}
         */
        this._meldTaskProcessor     = null;

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
        console.log("Initializing MeldWorkerConfiguration");
        $series([
            $task(function(flow) {
                var hearProcessorStopped = function(event) {
                    _this._meldTaskProcessor.removeEventListener(TaskProcessor.EventTypes.STOPPED, hearProcessorStopped);
                    flow.complete();
                };
                _this._meldTaskProcessor.addEventListener(TaskProcessor.EventTypes.STOPPED, hearProcessorStopped);
                _this._meldTaskProcessor.stop();
            }),
            $task(function(flow) {
                _this._redisPubSub.deinitialize(function(throwable) {
                    flow.complete(throwable);
                });
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
        console.log("Initializing MeldWorkerConfiguration");
        $series([
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
                _this._meldTaskProcessor.start();
                flow.complete();
            })
        ]).execute(callback);
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {MeldTaskManager} meldTaskManager
     * @param {MeldBucketManager} meldBucketManager
     * @param {MeldTransactionManager} meldTransactionManager
     * @param {MeldTransactionGenerator} meldTransactionGenerator
     * @return {MeldTaskProcessor}
     */
    meldTaskProcessor: function(meldTaskManager, meldBucketManager, meldTransactionManager, meldTransactionGenerator) {
        this._meldTaskProcessor = new MeldTaskProcessor(meldTaskManager, meldBucketManager, meldTransactionManager, meldTransactionGenerator);
        return this._meldTaskProcessor;
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
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(MeldWorkerConfiguration, IConfiguration);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(MeldWorkerConfiguration).with(
    configuration("meldWorkerConfiguration").modules([
        module("meldTaskProcessor")
            .args([
                arg().ref("meldTaskManager"),
                arg().ref("meldBucketManager"),
                arg().ref("meldTransactionManager"),
                arg().ref("meldTransactionGenerator")
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

bugpack.export("meldbug.MeldWorkerConfiguration", MeldWorkerConfiguration);