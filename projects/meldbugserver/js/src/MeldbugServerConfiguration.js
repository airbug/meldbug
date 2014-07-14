//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbugserver.MeldbugServerConfiguration')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('Flows')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ConfigurationTag')
//@Require('bugioc.IInitializingModule')
//@Require('bugioc.ModuleTag')
//@Require('bugioc.PropertyTag')
//@Require('bugmeta.BugMeta')
//@Require('redis.RedisClient')
//@Require('redis.RedisConfig')
//@Require('redis.RedisEvent')
//@Require('redis.RedisPubSub')


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
    var ArgTag                   = bugpack.require('bugioc.ArgTag');
    var ConfigurationTag         = bugpack.require('bugioc.ConfigurationTag');
    var IInitializingModule                  = bugpack.require('bugioc.IInitializingModule');
    var ModuleTag                = bugpack.require('bugioc.ModuleTag');
    var PropertyTag              = bugpack.require('bugioc.PropertyTag');
    var BugMeta                         = bugpack.require('bugmeta.BugMeta');
    var RedisClient                     = bugpack.require('redis.RedisClient');
    var RedisConfig                     = bugpack.require('redis.RedisConfig');
    var RedisEvent                      = bugpack.require('redis.RedisEvent');
    var RedisPubSub                     = bugpack.require('redis.RedisPubSub');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                             = ArgTag.arg;
    var bugmeta                         = BugMeta.context();
    var configuration                   = ConfigurationTag.configuration;
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
     * @implements {IInitializingModule}
     */
    var MeldbugServerConfiguration = Class.extend(Obj, {

        _name: "meldbugserver.MeldbugServerConfiguration",


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
        // IInitializingModule Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        deinitializeModule: function(callback) {
            var _this = this;
            console.log("Shutting down MeldbugServerConfiguration....");
            $series([
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
        initializeModule: function(callback) {
            var _this = this;
            console.log("Initializing MeldbugServerConfiguration");
            $parallel([
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
                    });
                }),
                $task(function(flow) {
                    _this._redisPubSub.initialize(function(throwable) {
                        flow.complete(throwable);
                    });
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
         * @return {exports}
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
         * @return {RedisPubSub}
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

    Class.implement(MeldbugServerConfiguration, IInitializingModule);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(MeldbugServerConfiguration).with(
        configuration("meldbugServerConfiguration").modules([
            module("blockingRedisClient")
                .args([
                    arg().ref("redis"),
                    arg().ref("redisConfig")
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

    bugpack.export("meldbugserver.MeldbugServerConfiguration", MeldbugServerConfiguration);
});
