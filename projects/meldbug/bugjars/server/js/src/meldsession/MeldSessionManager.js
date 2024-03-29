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

//@Export('meldbug.MeldSessionManager')
//@Autoload

//@Require('Class')
//@Require('Flows')
//@Require('Obj')
//@Require('Set')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('meldbug.MeldSessionKey')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Flows           = bugpack.require('Flows');
    var Obj             = bugpack.require('Obj');
    var Set             = bugpack.require('Set');
    var ArgTag          = bugpack.require('bugioc.ArgTag');
    var ModuleTag       = bugpack.require('bugioc.ModuleTag');
    var BugMeta         = bugpack.require('bugmeta.BugMeta');
    var MeldSessionKey  = bugpack.require('meldbug.MeldSessionKey');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg             = ArgTag.arg;
    var bugmeta         = BugMeta.context();
    var module          = ModuleTag.module;
    var $series         = Flows.$series;
    var $task           = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var MeldSessionManager = Class.extend(Obj, {

        _name: "meldbug.MeldSessionManager",


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

    bugmeta.tag(MeldSessionManager).with(
        module("meldSessionManager")
            .args([
                arg().ref("redisClient")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('meldbug.MeldSessionManager', MeldSessionManager);
});
