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

//@Export('meldbug.MeldClientManager')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('meldbug.MeldClient')
//@Require('meldbug.MeldClientKey')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Obj             = bugpack.require('Obj');
    var ArgTag          = bugpack.require('bugioc.ArgTag');
    var ModuleTag       = bugpack.require('bugioc.ModuleTag');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var MeldClient      = bugpack.require('meldbug.MeldClient');
    var MeldClientKey   = bugpack.require('meldbug.MeldClientKey');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg             = ArgTag.arg;
    var bugmeta         = BugMeta.context();
    var module          = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var MeldClientManager = Class.extend(Obj, {

        _name: "meldbug.MeldClientManager",


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
         * @return {MeldClient}
         */
        buildMeldClient: function(meldClientData) {
            var meldClientKey = this.buildMeldClientKey(meldClientData.meldClientKey);
            return new MeldClient(meldClientKey, !!meldClientData.active, new Date(meldClientData.lastActive));
        },

        /**
         * @private
         * @param {MeldClient} meldClient
         * @return {{meldClientKey: Object, active: boolean, lastActive: string}}
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
         * @return {{callUuid: string}}
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

    bugmeta.tag(MeldClientManager).with(
        module("meldClientManager")
            .args([
                arg().ref("redisClient")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('meldbug.MeldClientManager', MeldClientManager);
});
