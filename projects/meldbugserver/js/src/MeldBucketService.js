//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbugserver.MeldBucketService')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('bugcall.CallEvent')
//@Require('bugcall.IPreProcessCall')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgTag')
//@Require('bugioc.IInitializeModule')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Exception                   = bugpack.require('Exception');
var Obj                         = bugpack.require('Obj');
var CallEvent                   = bugpack.require('bugcall.CallEvent');
var IPreProcessCall             = bugpack.require('bugcall.IPreProcessCall');
var BugFlow                     = bugpack.require('bugflow.BugFlow');
var ArgTag               = bugpack.require('bugioc.ArgTag');
var IInitializeModule           = bugpack.require('bugioc.IInitializeModule');
var ModuleTag            = bugpack.require('bugioc.ModuleTag');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                         = ArgTag.arg;
var bugmeta                     = BugMeta.context();
var module                      = ModuleTag.module;
var $if                         = BugFlow.$if;
var $parallel                   = BugFlow.$parallel;
var $series                     = BugFlow.$series;
var $task                       = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 * @implements {IInitializeModule}
 * @implements {IPreProcessCall}
 */
var MeldBucketService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {BugCallServer} bugCallServer
     * @param {MeldBucketManager} meldBucketManager
     * @param {MeldBuilder} meldBuilder
     */
    _constructor: function(bugCallServer, meldBucketManager, meldBuilder) {

        this._super();


        //-------------------------------------------------------------------------------
        // Instance Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BugCallServer}
         */
        this.bugCallServer                  = bugCallServer;

        /**
         * @private
         * @type {boolean}
         */
        this.initialized                    = false;

        /**
         * @private
         * @type {MeldBucketManager}
         */
        this.meldBucketManager              = meldBucketManager;

        /**
         * @private
         * @type {MeldBuilder}
         */
        this.meldBuilder                    = meldBuilder;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {BugCallServer}
     */
    getBugCallServer: function() {
        return this.bugCallServer;
    },

    /**
     * @return {MeldBuilder}
     */
    getMeldBuilder: function() {
        return this.meldBuilder;
    },

    /**
     * @return {MeldBucketManager}
     */
    getMeldBucketManager: function() {
        return this.meldBucketManager;
    },

    /**
     * @return {boolean}
     */
    isInitialized: function() {
        return this.initialized;
    },


    //-------------------------------------------------------------------------------
    // ICallProcessor Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {Call} call
     * @param {function(Throwable=)} callback
     */
    preProcessCall: function(call, callback) {
        var _this               = this;
        var mirrorMeldBucketKey = this.meldBuilder.generateMeldBucketKey("mirrorMeldBucket", call.getCallUuid());
        $if (function(flow) {
                _this.meldBucketManager.hasMeldBucketForKey(mirrorMeldBucketKey, function(throwable, exists) {
                    if (!throwable) {
                        flow.assert(!exists);
                    } else {
                        flow.error(throwable);
                    }
                });
            },
            $task(function(flow) {
                if (!call.isReconnect()) {
                    $task(function(flow) {
                        _this.createMeldBucket(mirrorMeldBucketKey, function(throwable, meldBucket) {
                            flow.complete(throwable);
                        });
                    }).execute(function(throwable) {
                        flow.complete(throwable);
                    });
                } else {

                    //TODO BRN: Force the browser to refresh since something has gone wrong and there is no longer a meldBucket for this connection.
                    //Send an exception back through the flow. The BugCallServer should pick this up and disconnect the user with the Exception as
                    //the reason. The client side should look at the reason it was disconnected and refresh the browser based upon that reason.

                    flow.error(new Exception("BadBucket", {}, "Could not find MeldBucket for reconnect"));
                }
            })
        ).execute(callback);
    },


    //-------------------------------------------------------------------------------
    // IInitializeModule Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    deinitializeModule: function(callback) {
        if (this.isInitialized()) {
            this.initialized = false;
            this.bugCallServer.off(CallEvent.CLOSED, this.hearBugCallServerCallClosed, this);
            this.bugCallServer.deregisterCallPreProcessor(this);
        }
        callback();
    },

    /**
     * @param {function(Throwable=)} callback
     */
    initializeModule: function(callback) {
        if (!this.isInitialized()) {
            this.initialized = true;
            this.bugCallServer.on(CallEvent.CLOSED, this.hearBugCallServerCallClosed, this);
            this.bugCallServer.registerCallPreProcessor(this);
        }
        callback();
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {MeldBucketKey} meldBucketKey
     * @param {function(Throwable, MeldBucket=)} callback
     */
    createMeldBucket: function(meldBucketKey, callback) {
        var meldBucket = this.meldBucketManager.generateMeldBucket();
        this.meldBucketManager.setMeldBucket(meldBucketKey, meldBucket, callback);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {CallEvent} event
     */
    hearBugCallServerCallClosed: function(event) {
        var data            = event.getData();
        var call     = data.call;
        //TODO
    }
});


//-------------------------------------------------------------------------------
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(MeldBucketService, IInitializeModule);
Class.implement(MeldBucketService, IPreProcessCall);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(MeldBucketService).with(
    module("meldBucketService")
        .args([
            arg().ref("bugCallServer"),
            arg().ref("meldBucketManager"),
            arg().ref("meldBuilder")
        ])
);



//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbugserver.MeldBucketService', MeldBucketService);
