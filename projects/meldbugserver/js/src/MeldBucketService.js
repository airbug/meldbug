//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugserver')

//@Export('MeldBucketService')

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('bugcall.CallEvent')
//@Require('bugcall.IPreProcessCall')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Exception               = bugpack.require('Exception');
var Obj                     = bugpack.require('Obj');
var CallEvent               = bugpack.require('bugcall.CallEvent');
var IPreProcessCall         = bugpack.require('bugcall.IPreProcessCall');
var BugFlow                 = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $if                     = BugFlow.$if;
var $parallel               = BugFlow.$parallel;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
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
         * @type {MeldBucketManager}
         */
        this.meldBucketManager              = meldBucketManager;

        /**
         * @private
         * @type {MeldBuilder}
         */
        this.meldBuilder                    = meldBuilder;

        this.initialize();
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


    //-------------------------------------------------------------------------------
    // ICallProcessor Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {CallManager} callManager
     * @param {function(Throwable=)} callback
     */
    preProcessCall: function(callManager, callback) {
        var _this           = this;
        var mirrorMeldBucketKey = this.meldBuilder.generateMeldBucketKey("mirrorMeldBucket", callManager.getCallUuid());
        var serverMeldBucketKey = this.meldBuilder.generateMeldBucketKey("serverMeldBucket", callManager.getCallUuid());
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
                if (!callManager.isReconnect()) {
                    $parallel([
                        $task(function(flow) {
                            _this.createMeldBucket(mirrorMeldBucketKey, function(throwable, meldBucket) {
                                flow.complete(throwable);
                            });
                        }),
                        $task(function(flow) {
                            _this.createMeldBucket(serverMeldBucketKey, function(throwable, meldBucket) {
                                flow.complete(throwable);
                            });
                        })
                    ]).execute(function(throwable) {
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

    /**
     * @private
     */
    initialize: function() {
        this.bugCallServer.on(CallEvent.CLOSED, this.hearBugCallServerCallClosed, this);
        this.bugCallServer.registerCallPreProcessor(this);
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
        var callManager     = data.callManager;
        //TODO
    }
});


//-------------------------------------------------------------------------------
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(MeldBucketService, IPreProcessCall);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbugserver.MeldBucketService', MeldBucketService);
