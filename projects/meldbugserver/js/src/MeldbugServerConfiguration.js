//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugserver')

//@Export('MeldbugServerConfiguration')
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
//@Require('meldbug.MeldBucket')
//@Require('meldbug.MeldBuilder')
//@Require('meldbug.MeldStore')
//@Require('meldbugserver.MeldbugClientConsumerManager')
//@Require('meldbugserver.MeldManagerFactory')
//@Require('meldbugserver.MeldMirrorService')
//@Require('meldbugserver.MeldMirrorStore')
//@Require('redis.RedisClient')
//@Require('redis.RedisConfig')


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
var ArgAnnotation                   = bugpack.require('bugioc.ArgAnnotation');
var ConfigurationAnnotation         = bugpack.require('bugioc.ConfigurationAnnotation');
var IConfiguration                  = bugpack.require('bugioc.IConfiguration');
var ModuleAnnotation                = bugpack.require('bugioc.ModuleAnnotation');
var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var MeldBucket                      = bugpack.require('meldbug.MeldBucket');
var MeldBuilder                     = bugpack.require('meldbug.MeldBuilder');
var MeldStore                       = bugpack.require('meldbug.MeldStore');
var MeldbugClientConsumerManager    = bugpack.require('meldbugserver.MeldbugClientConsumerManager');
var MeldManagerFactory              = bugpack.require('meldbugserver.MeldManagerFactory');
var MeldMirrorService               = bugpack.require('meldbugserver.MeldMirrorService');
var MeldMirrorStore                 = bugpack.require('meldbugserver.MeldMirrorStore');
var RedisClient                     = bugpack.require('redis.RedisClient');
var RedisConfig                     = bugpack.require('redis.RedisConfig');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                             = ArgAnnotation.arg;
var bugmeta                         = BugMeta.context();
var configuration                   = ConfigurationAnnotation.configuration;
var module                          = ModuleAnnotation.module;
var property                        = PropertyAnnotation.property;
var $series                         = BugFlow.$series;
var $task                           = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldbugServerConfiguration = Class.extend(Obj, {

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
        this._redisClient   = null;

        /**
         * @private
         * @type {RedisConfig}
         */
        this._redisConfig   = null;
    },


    //-------------------------------------------------------------------------------
    // Configuration Lifecycle
    //-------------------------------------------------------------------------------

    /**
     * @param {function(error)} callback
     */
    initializeConfiguration: function(callback) {
        var _this = this;
        console.log("Initializing MeldbugServerConfiguration");
        $series([
            $task(function(flow) {
                _this._redisClient.connect(function(throwable) {
                    flow.complete(throwable);
                })
            })
        ]).execute(callback);
    },

    /**
     * @param {MeldBuilder} meldBuilder
     * @return {MeldbugClientConsumerManager}
     */
    meldbugClientConsumerManager: function(meldBuilder) {
        return new MeldbugClientConsumerManager(meldBuilder);
    },

    /**
     * @return {MeldBuilder}
     */
    meldBuilder: function() {
        return new MeldBuilder();
    },

    /**
     * @return {MeldBucket}
     */
    meldBucket: function() {
        return new MeldBucket();
    },

    /**
     * @return {MeldManagerFactory}
     */
    meldManagerFactory: function(meldStore, meldMirrorStore) {
        return new MeldManagerFactory(meldStore, meldMirrorStore);
    },

    /**
     * @param {BugCallServer} bugCallServer
     * @param {MeldMirrorStore} meldMirrorStore
     * @param {MeldbugClientConsumerManager} meldbugClientConsumerManager
     * @return {MeldMirrorService}
     */
    meldMirrorService: function(bugCallServer, meldMirrorStore, meldbugClientConsumerManager) {
        return new MeldMirrorService(bugCallServer, meldMirrorStore, meldbugClientConsumerManager);
    },

    /**
     * @return {MeldMirrorStore}
     */
    meldMirrorStore: function() {
        return new MeldMirrorStore();
    },

    /**
     * @param {MeldBucket} meldBucket
     * @return {MeldStore}
     */
    meldStore: function(meldBucket) {
        return new MeldStore(meldBucket);
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
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(MeldbugServerConfiguration, IConfiguration);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(MeldbugServerConfiguration).with(
    configuration().modules([
        module("meldbugClientConsumerManager")
            .args([
                arg().ref("meldBuilder")
            ]),
        module("meldBuilder"),
        module("meldBucket"),
        module("meldManagerFactory")
            .args([
                arg().ref("meldStore"),
                arg().ref("meldMirrorStore")
            ]),
        module("meldMirrorService")
            .args([
                arg().ref("bugCallServer"),
                arg().ref("meldMirrorStore"),
                arg().ref("meldbugClientConsumerManager")
            ]),
        module("meldMirrorStore"),
        module("meldStore")
            .args([
                arg().ref("meldBucket")
            ]),
        module("redis"),
        module("redisClient")
            .args([
                arg().ref("redis"),
                arg().ref("redisConfig")
            ]),
        module("redisConfig")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("meldbugserver.MeldbugServerConfiguration", MeldbugServerConfiguration);
