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

//@Export('meldbug.MeldManager')
//@Autoload

//@Require('Class')
//@Require('Flows')
//@Require('Obj')
//@Require('Set')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('meldbug.MeldDocumentKey')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Flows               = bugpack.require('Flows');
    var Obj                 = bugpack.require('Obj');
    var Set                 = bugpack.require('Set');
    var ArgTag              = bugpack.require('bugioc.ArgTag');
    var ModuleTag           = bugpack.require('bugioc.ModuleTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var MeldDocumentKey     = bugpack.require('meldbug.MeldDocumentKey');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                 = ArgTag.arg;
    var bugmeta             = BugMeta.context();
    var module              = ModuleTag.module;
    var $series             = Flows.$series;
    var $task               = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var MeldManager = Class.extend(Obj, {

        _name: "meldbug.MeldManager",


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

    bugmeta.tag(MeldManager).with(
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
});
