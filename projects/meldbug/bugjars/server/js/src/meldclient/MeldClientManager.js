//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldClientManager')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('meldbug.MeldClient')
//@Require('meldbug.MeldClientKey')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation        = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var MeldClient              = bugpack.require('meldbug.MeldClient');
var MeldClientKey           = bugpack.require('meldbug.MeldClientKey');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                     = ArgAnnotation.arg;
var bugmeta                 = BugMeta.context();
var module                  = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldClientManager = Class.extend(Obj, {

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
        this.redisClient    = redisClient;
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
     * @param {MeldClientKey} meldClientKey
     * @return {MeldClient}
     */
    generateMeldClient: function(meldClientKey) {
        return new MeldClient(meldClientKey);
    },

    /**
     * @param {string} callUuid
     * @return {MeldClientKey}
     */
    generateMeldClientKey: function(callUuid) {
        return new MeldClientKey(callUuid);
    },

    /**
     * @param {MeldClientKey} meldClientKey
     * @param {function(Throwable, MeldClient=)} callback
     */
    getMeldClientForKey: function(meldClientKey, callback) {
        var _this = this;
        this.redisClient.get(meldClientKey.toStringKey(), function(error, meldClientData) {
            if (!error) {
                if (meldClientData) {
                    var meldClient  = null;
                    var throwable   = null;
                    try {
                        meldClient = _this.buildMeldClient(JSON.parse(meldClientData));
                    } catch(e) {
                        throwable = e;
                    }
                    if (!throwable) {
                        callback(null, meldClient);
                    } else {
                        callback(throwable);
                    }

                } else {
                    callback(null, null);
                }
            } else {
                callback(error);
            }
        });
    },

    /**
     * @param {MeldClientKey} meldClientKey
     * @param {function(Throwable, boolean=)} callback
     */
    hasMeldClientForKey: function(meldClientKey, callback) {
        this.redisClient.exists(meldClientKey.toStringKey(), function(error, reply) {
            if (!error) {
                callback(null, !!reply);
            } else {
                callback(error);
            }
        });
    },

    /**
     * @param {MeldClientKey} meldClientKey
     * @param {function(Error=)} callback
     */
    lockMeldClientForKey: function(meldClientKey, callback) {
        var _this = this;
        var lockKey = "lock:" + meldClientKey.toStringKey();
        this.redisClient.setNX(lockKey, 1, function(error, reply) {
            if (!error) {
                if (!!reply) {
                    callback();
                } else {
                    setTimeout(function() {
                        _this.lockMeldClientForKey(meldClientKey, callback);
                    }, 100);
                }
            } else {
                callback(error);
            }
        });
    },

    /**
     * @param {MeldClientKey} meldClientKey
     * @param {function(Throwable, boolean=)} callback
     */
    removeMeldClientForKey: function(meldClientKey, callback) {
        var meldClientKeyString = meldClientKey.toStringKey();
        this.redisClient.del(meldClientKeyString, function(error, reply) {
            if (!error) {
                callback(null, !!reply);
            } else {
                callback(error);
            }
        });
    },

    /**
     * @param {MeldClient} meldClient
     * @param {function(Throwable, MeldClient=)} callback
     */
    setMeldClient: function(meldClient, callback) {
        var meldClientData = this.unbuildMeldClient(meldClient);
        var meldClientKeyString = meldClient.getMeldClientKey().toStringKey();
        this.redisClient.set(meldClientKeyString, JSON.stringify(meldClientData), function(error, reply) {
            if (!error) {
                callback(null, meldClient);
            } else {
                callback(error);
            }
        });
    },

    /**
     * @param {MeldClientKey} meldClientKey
     * @param {function(Error=)} callback
     */
    unlockMeldClientForKey: function(meldClientKey, callback) {
        var lockKey = "lock:" + meldClientKey.toStringKey();
        this.redisClient.del(lockKey, function(error, reply) {
            if (!error) {
                callback();
            } else {
                callback(error);
            }
        });
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {{meldClientKey: Object, active: boolean, lastActive: string}} meldClientData
     * @returns {MeldClient}
     */
    buildMeldClient: function(meldClientData) {
        var meldClientKey = this.buildMeldClientKey(meldClientData.meldClientKey);
        return new MeldClient(meldClientKey, !!meldClientData.active, new Date(meldClientData.lastActive));
    },

    /**
     * @private
     * @param {MeldClient} meldClient
     * @returns {{meldClientKey: Object, active: boolean, lastActive: string}}
     */
    unbuildMeldClient: function(meldClient) {
        return {
            meldClientKey: this.unbuildMeldClientKey(meldClient.getMeldClientKey()),
            active: meldClient.getActive(),
            lastActive: meldClient.getLastActive().toString()
        };
    },

    /**
     * @private
     * @param {{callUuid: string}} meldClientKeyData
     * @return {MeldClientKey}
     */
    buildMeldClientKey: function(meldClientKeyData) {
        return new MeldClientKey(meldClientKeyData.callUuid);
    },

    /**
     * @private
     * @param {MeldClientKey} meldClientKey
     * @returns {{callUuid: string}}
     */
    unbuildMeldClientKey: function(meldClientKey) {
        return {
            callUuid: meldClientKey.getCallUuid()
        };
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(MeldClientManager).with(
    module("meldClientManager")
        .args([
            arg().ref("redisClient")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldClientManager', MeldClientManager);
