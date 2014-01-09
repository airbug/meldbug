//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldManager')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('meldbug.MeldDocumentKey')


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
var MeldDocumentKey         = bugpack.require('meldbug.MeldDocumentKey');


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

var MeldManager = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {RedisClient} redisClient
     * @param {MeldBuilder} meldBuilder
     */
    _constructor: function(redisClient, meldBuilder) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MeldBuilder}
         */
        this.meldBuilder        = meldBuilder;

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
     * @return {MeldBuilder}
     */
    getMeldBuilder: function() {
        return this.meldBuilder;
    },

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
     * @param {MeldDocumentKey} meldDocumentKey
     * @param {function(Throwable, Set.<string>=)} callback
     */
    getCallUuidSetForMeldDocumentKey: function(meldDocumentKey, callback) {
        var callUuidSetKey = this.generateCallUuidSetForMeldDocumentKeyKey(meldDocumentKey);
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
     * @param {function(Throwable, Set.<string>=)} callback
     */
    getMeldDocumentKeySetForCallUuid: function(callUuid, callback) {
        var _this = this;
        var meldDocumentKeySetKey = this.generateMeldDocumentKeySetForCallUuidKey(callUuid);
        this.redisClient.sMembers(meldDocumentKeySetKey, function(error, replies) {
            if (!error) {
                /** @type {Set.<MeldDocumentKey>} */
                var meldDocumentKeySet = new Set();
                if (replies) {
                    replies.forEach(function(reply) {
                        var meldDocumentKey = MeldDocumentKey.fromStringKey(reply);
                        meldDocumentKeySet.add(meldDocumentKey);
                    });
                }
                callback(null, meldDocumentKeySet);
            } else {
                callback(error)
            }
        });
    },

    /**
     * @param {string} callUuid
     * @param {MeldDocumentKey} meldDocumentKey
     * @param {function(Throwable=)} callback
     */
    meldCallUuidWithMeldDocumentKey: function(callUuid, meldDocumentKey, callback) {
        var multi = this.redisClient.multi();
        multi
            .sadd(this.generateMeldDocumentKeySetForCallUuidKey(callUuid), meldDocumentKey.toStringKey())
            .sadd(this.generateCallUuidSetForMeldDocumentKeyKey(meldDocumentKey), callUuid)
            .exec(function(errors, replies) {
                if (!errors) {
                    callback();
                } else {
                    callback(errors);
                }
            });
    },

    /**
     * @param {string} callUuid
     * @param {Array.<MeldDocumentKey>} meldDocumentKeys
     * @param {function(Throwable=)} callback
     */
    meldCallUuidWithMeldDocumentKeys: function(callUuid, meldDocumentKeys, callback) {
        var _this = this;
        var multi = this.redisClient.multi();
        meldDocumentKeys.forEach(function(meldDocumentKey) {
            multi
                .sadd(_this.generateMeldDocumentKeySetForCallUuidKey(callUuid), meldDocumentKey.toStringKey())
                .sadd(_this.generateCallUuidSetForMeldDocumentKeyKey(meldDocumentKey), callUuid);
        });
        multi
            .exec(function(errors, replies) {
                if (!errors) {
                    callback();
                } else {
                    callback(errors);
                }
            });
    },

    /**
     * @param {(Array.<string> | ICollection.<string>)} callUuids
     * @param {(Array.<MeldDocumentKey> | ICollection.<string>)} meldDocumentKeys
     * @param {function(Throwable=)} callback
     */
    meldCallUuidsWithMeldDocumentKeys: function(callUuids, meldDocumentKeys, callback) {
        var _this = this;
        var multi = this.redisClient.multi();
        callUuids.forEach(function(callUuid) {
            meldDocumentKeys.forEach(function(meldDocumentKey) {
                multi
                    .sadd(_this.generateMeldDocumentKeySetForCallUuidKey(callUuid), meldDocumentKey.toStringKey())
                    .sadd(_this.generateCallUuidSetForMeldDocumentKeyKey(meldDocumentKey), callUuid);
            });
        });
        multi
            .exec(function(errors, replies) {
                if (!errors) {
                    callback();
                } else {
                    callback(errors);
                }
            });
    },

    /**
     * @param {string} callUuid
     * @param {function(Throwable=)} callback
     */
    removeCallUuid: function(callUuid, callback) {
        var _this = this;
        $series([
            $task(function(flow) {
                _this.removeCallUuidFromAllMeldDocumentKeySets(callUuid, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(callback);
    },

    /**
     * @param {string} callUuid
     * @param {function(Throwable=)} callback
     */
    removeCallUuidFromAllMeldDocumentKeySets: function(callUuid, callback) {
        var _this = this;
        var meldDocumentKeySet = null;
        $series([
            $task(function(flow) {
                _this.getMeldDocumentKeySetForCallUuid(callUuid, function(throwable, retrievedMeldDocumentKeySet) {
                    if (!throwable) {
                        meldDocumentKeySet = retrievedMeldDocumentKeySet;
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.unmeldCallUuidWithMeldDocumentKeys(callUuid, meldDocumentKeySet.toArray(), function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(callback);
    },

    /**
     * @param {string} callUuid
     * @param {Array.<MeldDocumentKey>} meldDocumentKeys
     * @param {function(Throwable=)} callback
     */
    unmeldCallUuidWithMeldDocumentKeys: function(callUuid, meldDocumentKeys, callback) {
        var _this = this;
        var multi = this.redisClient.multi();
        meldDocumentKeys.forEach(function(meldDocumentKey) {
            multi
                .srem(_this.generateMeldDocumentKeySetForCallUuidKey(callUuid), meldDocumentKey.toStringKey())
                .srem(_this.generateCallUuidSetForMeldDocumentKeyKey(meldDocumentKey), callUuid);
        });
        multi
            .exec(function(errors, replies) {
                if (!errors) {
                    callback();
                } else {
                    callback(errors);
                }
            });
    },

    /**
     * @param {(Array.<string> | ICollection.<string>)} callUuids
     * @param {(Array.<MeldDocumentKey> | ICollection.<MeldDocumentKey)} meldDocumentKeys
     * @param {function(Throwable=)} callback
     */
    unmeldCallUuidsWithMeldDocumentKeys: function(callUuids, meldDocumentKeys, callback) {
        var _this = this;
        var multi = this.redisClient.multi();
        callUuids.forEach(function(callUuid) {
            meldDocumentKeys.forEach(function(meldDocumentKey) {
                multi
                    .srem(_this.generateMeldDocumentKeySetForCallUuidKey(callUuid), meldDocumentKey.toStringKey())
                    .srem(_this.generateCallUuidSetForMeldDocumentKeyKey(meldDocumentKey), callUuid);
            });
        });
        multi
            .exec(function(errors, replies) {
                if (!errors) {
                    callback();
                } else {
                    callback(errors);
                }
            });
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {string} callUuid
     * @return {string}
     */
    generateMeldDocumentKeySetForCallUuidKey : function(callUuid) {
        return "meld:" + callUuid;
    },

    /**
     * @private
     * @param {MeldDocumentKey} meldDocumentKey
     * @return {string}
     */
    generateCallUuidSetForMeldDocumentKeyKey: function(meldDocumentKey) {
        return "meld:" + meldDocumentKey.toStringKey();
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(MeldManager).with(
    module("meldManager")
        .args([
            arg().ref("redisClient"),
            arg().ref("meldBuilder")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldManager', MeldManager);
