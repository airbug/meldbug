//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugserver')

//@Export('MeldClientService')

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('bugcall.CallEvent')
//@Require('bugcall.IProcessCall')
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
var IProcessCall            = bugpack.require('bugcall.IProcessCall');
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
 * @implements {IProcessCall}
 */
var MeldClientService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {BugCallServer} bugCallServer
     * @param {MeldClientManager} meldClientManager
     */
    _constructor: function(bugCallServer, meldClientManager) {

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
         * @type {MeldClientManager}
         */
        this.meldClientManager              = meldClientManager;

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
     * @return {MeldClientManager}
     */
    getMeldClientManager: function() {
        return this.meldClientManager;
    },


    //-------------------------------------------------------------------------------
    // ICallProcessor Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {CallManager} callManager
     * @param {function(Throwable=)} callback
     */
    processCall: function(callManager, callback) {
        var _this           = this;
        var meldClient      = null;
        var meldClientKey   = this.meldClientManager.generateMeldClientKey(callManager.getCallUuid());
        
        $if(function(flow) {
                _this.meldClientManager.getMeldClientForKey(meldClientKey, function(throwable, retrieveMeldClient) {
                    if (!throwable) {
                        meldClient = retrieveMeldClient;
                        flow.assert(!meldClient);
                    } else {
                        flow.error(throwable);
                    }
                });
            },
            $task(function(flow) {
                _this.createMeldClient(meldClientKey, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ).$else(
            $task(function(flow) {
                if (!meldClient.isActive()) {
                    meldClient.setActive(true);
                    meldClient.setLastActive(new Date());
                    _this.meldClientManager.setMeldClient(meldClient, function(throwable) {
                        flow.complete(throwable);
                    });
                } else {
                    flow.error(new Exception("AlreadyActive", {}, "A connection by this callUuid is already active"));
                }
            })
        ).execute(callback);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {MeldClientKey} meldClientKey
     * @param {function(Throwable, MeldClient=)} callback
     */
    createMeldClient: function(meldClientKey, callback) {
        var meldClient = this.meldClientManager.generateMeldClient(meldClientKey);
        this.meldClientManager.setMeldClient(meldClient, callback);
    },

    /**
     * @private
     */
    initialize: function() {
        this.bugCallServer.on(CallEvent.CLOSED, this.hearBugCallServerCallClosed, this);
        this.bugCallServer.registerCallProcessor(this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {CallEvent} event
     */
    hearBugCallServerCallClosed: function(event) {
        var _this           = this;
        var data            = event.getData();
        var callManager     = data.callManager;
        var meldClient      = null;
        var meldClientKey   = this.meldClientManager.generateMeldClientKey(callManager.getCallUuid());
        $series([
            $task(function(flow) {
                _this.meldClientManager.getMeldClientForKey(meldClientKey, function(throwable, retrievedMeldClient) {
                    if (!throwable) {
                        meldClient = retrievedMeldClient;
                        flow.complete();
                    } else {
                        flow.error(throwable);
                    }
                });
            }),
            $task(function(flow) {
                meldClient.setActive(false);
                meldClient.setLastActive(new Date());
                _this.meldClientManager.setMeldClient(meldClient, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            //TODO BRN: What do we do if this fails?
        });
    }
});


//-------------------------------------------------------------------------------
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(MeldClientService, IProcessCall);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbugserver.MeldClientService', MeldClientService);
