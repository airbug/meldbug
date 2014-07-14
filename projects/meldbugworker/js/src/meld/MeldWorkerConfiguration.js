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

//@Export('meldbug.MeldWorkerConfiguration')
//@Autoload

//@Require('Class')
//@Require('Flows')
//@Require('Obj')
//@Require('bugfs.BugFs')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ConfigurationTag')
//@Require('bugioc.IInitializingModule')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('bugtask.TaskProcessor')
//@Require('configbug.Configbug')
//@Require('meldbug.MeldTaskProcessor')
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

    var redis                   = require('redis');


    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var Flows                   = bugpack.require('Flows');
    var Obj                     = bugpack.require('Obj');
    var BugFs                   = bugpack.require('bugfs.BugFs');
    var ArgTag                  = bugpack.require('bugioc.ArgTag');
    var ConfigurationTag        = bugpack.require('bugioc.ConfigurationTag');
    var IInitializingModule     = bugpack.require('bugioc.IInitializingModule');
    var ModuleTag               = bugpack.require('bugioc.ModuleTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var TaskProcessor           = bugpack.require('bugtask.TaskProcessor');
    var Configbug               = bugpack.require('configbug.Configbug');
    var MeldTaskProcessor       = bugpack.require('meldbug.MeldTaskProcessor');
    var RedisClient             = bugpack.require('redis.RedisClient');
    var RedisConfig             = bugpack.require('redis.RedisConfig');
    var RedisEvent              = bugpack.require('redis.RedisEvent');
    var RedisPubSub             = bugpack.require('redis.RedisPubSub');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                     = ArgTag.arg;
    var bugmeta                 = BugMeta.context();
    var configuration           = ConfigurationTag.configuration;
    var module                  = ModuleTag.module;
    var $series                 = Flows.$series;
    var $task                   = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IInitializingModule}
     */
    var MeldWorkerConfiguration = Class.extend(Obj, {

        _name: "meldbug.MeldWorkerConfiguration",


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
        // IInitializingModule Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        deinitializeModule: function(callback) {
            var _this = this;
            console.log("Deinitializing MeldWorkerConfiguration");
            $series([
                $task(function(flow) {
                    if (!_this._meldTaskProcessor.isStopped()) {
                        var hearProcessorStopped = function(event) {

                            //TEST
                            console.log("SHUTDOWN - meld task processor STOPPED");

                            _this._meldTaskProcessor.removeEventListener(TaskProcessor.EventTypes.STOPPED, hearProcessorStopped);
                            flow.complete();
                        };
                        _this._meldTaskProcessor.addEventListener(TaskProcessor.EventTypes.STOPPED, hearProcessorStopped);
                        if (_this._meldTaskProcessor.isStarted()) {
                            _this._meldTaskProcessor.stop();
                        }
                    } else {

                        //TEST
                        console.log("SHUTDOWN - meld task processor already stopped");

                        flow.complete();
                    }
                }),
                $task(function(flow) {

                    //TEST
                    console.log("SHUTDOWN - deinitialize pubsub");

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
            ]).execute(function(throwable) {
                if (!throwable) {
                    console.log("MeldWorkerConfiguration successfully initialized!");
                } else {
                    console.log("MeldWorkerConfiguration encountered an error while initializing - throwable:", throwable);
                }
                callback(throwable);
            });
        },

        /**
         * @param {function(Throwable=)} callback
         */
        initializeModule: function(callback) {
            var _this = this;
            console.log("Initializing MeldWorkerConfiguration");
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
                    _this._meldTaskProcessor.start();
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
         * @return {console|Console}
         */
        console: function() {
            return console;
        },

        /**
         * @param {Logger} logger
         * @param {MeldTaskManager} meldTaskManager
         * @param {MeldBucketManager} meldBucketManager
         * @param {MeldTransactionPublisher} meldTransactionPublisher
         * @param {MeldTransactionGenerator} meldTransactionGenerator
         * @param {MeldClientManager} meldClientManager
         * @param {CleanupTaskManager} cleanupTaskManager
         * @return {MeldTaskProcessor}
         */
        meldTaskProcessor: function(logger, meldTaskManager, meldBucketManager, meldTransactionPublisher, meldTransactionGenerator, meldClientManager, cleanupTaskManager) {
            this._meldTaskProcessor = new MeldTaskProcessor(logger, meldTaskManager, meldBucketManager, meldTransactionPublisher, meldTransactionGenerator, meldClientManager, cleanupTaskManager);
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

    Class.implement(MeldWorkerConfiguration, IInitializingModule);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(MeldWorkerConfiguration).with(
        configuration("meldWorkerConfiguration").modules([
            module("blockingRedisClient")
                .args([
                    arg().ref("redis"),
                    arg().ref("redisConfig")
                ]),
            module("configbug"),
            module("console"),
            module("meldTaskProcessor")
                .args([
                    arg().ref("logger"),
                    arg().ref("meldTaskManager"),
                    arg().ref("meldBucketManager"),
                    arg().ref("meldTransactionPublisher"),
                    arg().ref("meldTransactionGenerator"),
                    arg().ref("meldClientManager"),
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

    bugpack.export("meldbug.MeldWorkerConfiguration", MeldWorkerConfiguration);
});
