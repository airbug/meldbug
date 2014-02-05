//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldSessionManager')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('meldbug.MeldSessionKey')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var Set                     = bugpack.require('Set');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation        = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var MeldSessionKey          = bugpack.require('meldbug.MeldSessionKey');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                     = ArgAnnotation.arg;
var bugmeta                 = BugMeta.context();
var module                  = ModuleAnnotation.module;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldSessionManager = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {RedisClient} redisClient
     */
    _constructor: function(redisClient) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {RedisClient}
         */
        this.redisClient        = redisClient;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {RedisClient}
     */
    getRedisClient: function() {
        return this.redisClient;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} callUuid
     * @param {MeldSessionKey} meldSessionKey
     * @param {function(Throwable=)} callback
     */
    addCallUuidToMeldSession: function(callUuid, meldSessionKey, callback) {
        var multi = this.redisClient.multi();
        multi
            .sadd(this.generateMeldSessionCallUuidSetKey(meldSessionKey), callUuid)
            .exec(function(errors, replies) {
                if (!errors) {
                    callback();
                } else {
                    callback(errors);
                }
            });
    },

    /**
     * @param {string} sessionId
     * @return {MeldSessionKey}
     */
    generateMeldSessionKey: function(sessionId) {
        return new MeldSessionKey(sessionId);
    },

    /**
     * @param {MeldSessionKey} meldSessionKey
     * @param {function(Throwable, Set.<string>=)} callback
     */
    getCallUuidSetForMeldSessionKey: function(meldSessionKey, callback) {
        var callUuidSetKey = this.generateMeldSessionCallUuidSetKey(meldSessionKey);
        this.redisClient.sMembers(callUuidSetKey, function(error, replies) {
            if (!error) {
                /** @type {Set.<string>} */
                var callUuidSet = new Set(replies);
                callback(null, callUuidSet);
            } else {
                callback(error)
            }
        });
    },

    /**
     * @param {string} callUuid
     * @param {MeldSessionKey} meldSessionKey
     * @param {function(Throwable=)} callback
     */
    removeCallUuidFromMeldSession: function(callUuid, meldSessionKey, callback) {
        this.redisClient.sRem(this.generateMeldSessionCallUuidSetKey(meldSessionKey), callUuid, function(error, reply) {
            if (!error) {
                callback();
            } else {
                callback(error);
            }
        });
    },

    /**
     * @param {MeldSessionKey} meldSessionKey
     * @param {function(Throwable)} callback
     */
    removeMeldSession: function(meldSessionKey, callback) {
        this.redisClient.del(this.generateMeldSessionCallUuidSetKey(meldSessionKey), function(error, reply) {
            callback(error);
        });
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {MeldSessionKey} meldSessionKey
     * @return {string}
     */
    generateMeldSessionCallUuidSetKey: function(meldSessionKey) {
        return "meldSessionCallUuidSet:" + meldSessionKey.toStringKey();
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(MeldSessionManager).with(
    module("meldSessionManager")
        .args([
            arg().ref("redisClient")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldSessionManager', MeldSessionManager);
