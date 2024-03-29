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

//@Export('meldbug.MeldBucketManager')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('Tracer')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('meldbug.MeldBucket')
//@Require('meldbug.MeldBucketKey')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    var zlib                = require('zlib');


    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var Tracer              = bugpack.require('Tracer');
    var ArgTag              = bugpack.require('bugioc.ArgTag');
    var ModuleTag           = bugpack.require('bugioc.ModuleTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var MeldBucket          = bugpack.require('meldbug.MeldBucket');
    var MeldBucketKey       = bugpack.require('meldbug.MeldBucketKey');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                 = ArgTag.arg;
    var bugmeta             = BugMeta.context();
    var module              = ModuleTag.module;
    var $traceWithError     = Tracer.$traceWithError;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var MeldBucketManager = Class.extend(Obj, {

        _name: "meldbug.MeldBucketManager",


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
            this.meldBuilder    = meldBuilder;

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
         * @param {MeldBucketKey} meldBucketKey
         * @param {function(Throwable, boolean=)} callback
         */
        deleteMeldBucketByKey: function(meldBucketKey, callback) {
            this.redisClient.del(meldBucketKey.toStringKey(), $traceWithError(function(error, reply) {
                if (!error) {
                    callback(null, !!reply);
                } else {
                    callback(error);
                }
            }));
        },

        /**
         * @return {MeldBucket}
         */
        generateMeldBucket: function() {
            return this.meldBuilder.generateMeldBucket();
        },

        /**
         * @param {string} type
         * @param {String} callUuid
         * @return {MeldBucketKey}
         */
        generateMeldBucketKey: function(type, callUuid) {
            return this.meldBuilder.generateMeldBucketKey(type, callUuid);
        },

        /**
         * @param {MeldBucketKey} meldBucketKey
         * @param {function(Throwable, MeldBucket=)} callback
         */
        getMeldBucketForKey: function(meldBucketKey, callback) {
            var _this = this;

            //TEST
            console.log("MeldBucketManager:getMeldBucketForKey");

            this.redisClient.get(meldBucketKey.toStringKey(), $traceWithError(function(error, meldBucketData) {
                if (!error) {
                    if (meldBucketData) {
                        _this.decompressMeldBucket(meldBucketData, callback);
                    } else {
                        callback(null, null);
                    }
                } else {
                    callback(error);
                }
            }));
        },

        /**
         * @param {MeldBucketKey} meldBucketKey
         * @param {function(Throwable, boolean=)} callback
         */
        hasMeldBucketForKey: function(meldBucketKey, callback) {
            this.redisClient.exists(meldBucketKey.toStringKey(), $traceWithError(function(error, reply) {
                if (!error) {
                    callback(null, !!reply);
                } else {
                    callback(error);
                }
            }));
        },

        /**
         * @param {MeldBucketKey} meldBucketKey
         * @param {function(Throwable=)} callback
         */
        lockMeldBucketForKey: function(meldBucketKey, callback) {
            console.log("Attempting to lock MeldBucket '", meldBucketKey.toStringKey(), "'");
            var _this = this;
            var lockKey = "lock:" + meldBucketKey.toStringKey();
            this.redisClient.setNX(lockKey, 1, $traceWithError(function(error, reply) {
                if (!error) {
                    if (!!reply) {
                        console.log("Locked MeldBucket '", meldBucketKey.toStringKey(), "'");
                        callback();
                    } else {
                        console.log("Could not lock MeldBucket '", meldBucketKey.toStringKey(), "'", " retry in 100ms");

                        //TODO BRN: Add a back off and fail mechanism here if we can't lock the bucket.
                        //In the code that calls this mechanism, we should check to see if the user has dropped since the call was made

                        setTimeout(function() {
                            _this.lockMeldBucketForKey(meldBucketKey, callback);
                        }, 100);
                    }
                } else {
                    callback(error);
                }
            }));
        },

        /**
         * @param {MeldBucketKey} meldBucketKey
         * @param {MeldBucket} meldBucket
         * @param {function(Throwable, MeldBucket=)} callback
         */
        setMeldBucket: function(meldBucketKey, meldBucket, callback) {
            var _this = this;
            this.compressMeldBucket(meldBucket, function(error, meldBucketData) {
                if (!error) {
                    var meldBucketKeyString = meldBucketKey.toStringKey();
                    _this.redisClient.set(meldBucketKeyString, meldBucketData, $traceWithError(function(error, reply) {
                        if (!error) {
                            callback(null, meldBucket);
                        } else {
                            callback(error);
                        }
                    }));
                } else {
                    callback(error);
                }
            });
        },

        /**
         * @param {MeldBucketKey} meldBucketKey
         * @param {function(Throwable=)} callback
         */
        unlockMeldBucketForKey: function(meldBucketKey, callback) {
            var retryCount = 0;
            var lockKey = "lock:" + meldBucketKey.toStringKey();
            this.redisClient.del(lockKey, $traceWithError(function(error, reply) {
                if (!error) {
                    console.log("UNLOCKED MeldBucket '", meldBucketKey.toStringKey(), "'");
                    callback();
                } else {
                    callback(error);
                }
            }));
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {MeldBucket} meldBucket
         * @param {function(Throwable, string=)} callback
         */
        compressMeldBucket: function(meldBucket, callback) {
            var meldBucketString = this.meldBuilder.marshalData(meldBucket);
            zlib.gzip(meldBucketString, $traceWithError(function(error, buffer) {
                if (!error) {
                    callback(null, buffer.toString('base64'));
                } else {
                    callback(error);
                }
            }));
        },

        /**
         * @private
         * @param {string} meldBucketData
         * @param {function(Throwable, MeldBucket=)} callback
         */
        decompressMeldBucket: function(meldBucketData, callback) {
            var _this = this;
            var buffer = new Buffer(meldBucketData, 'base64');
            zlib.gunzip(buffer, $traceWithError(function(error, resultBuffer) {
                if (!error) {
                    var meldBucket  = null;
                    var throwable   = null;
                    try {
                        meldBucket = _this.meldBuilder.unmarshalData(resultBuffer.toString())
                    } catch(e) {
                        throwable = e;
                    }
                    if (!throwable) {
                        callback(null, meldBucket);
                    } else {
                        callback(throwable);
                    }
                } else {
                    callback(error);
                }
            }));
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(MeldBucketManager).with(
        module("meldBucketManager")
            .args([
                arg().ref("redisClient"),
                arg().ref("meldBuilder")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('meldbug.MeldBucketManager', MeldBucketManager);
});
