//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbugserver.MeldClientService')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('bugcall.CallEvent')
//@Require('bugcall.IProcessCall')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.IInitializeModule')
//@Require('bugioc.ModuleAnnotation')
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
var IProcessCall                = bugpack.require('bugcall.IProcessCall');
var BugFlow                     = bugpack.require('bugflow.BugFlow');
var ArgAnnotation               = bugpack.require('bugioc.ArgAnnotation');
var IInitializeModule           = bugpack.require('bugioc.IInitializeModule');
var ModuleAnnotation            = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                         = ArgAnnotation.arg;
var bugmeta                     = BugMeta.context();
var module                      = ModuleAnnotation.module;
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
        // Private Properties
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
         * @type {MeldClientManager}
         */
        this.meldClientManager              = meldClientManager;
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

    /**
     * @return {boolean}
     */
    isInitialized: function() {
        return this.initialized;
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
            this.bugCallServer.deregisterCallProcessor(this);
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
            this.bugCallServer.registerCallProcessor(this);
        }
        callback();
    },


    //-------------------------------------------------------------------------------
    // IProcessCall Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {Call} call
     * @param {function(Throwable=)} callback
     */
    processCall: function(call, callback) {
        var _this           = this;
        var meldClient      = null;
        var meldClientKey   = this.meldClientManager.generateMeldClientKey(call.getCallUuid());
        
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
        var call     = data.call;
        var meldClient      = null;
        var meldClientKey   = this.meldClientManager.generateMeldClientKey(call.getCallUuid());
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

Class.implement(MeldClientService, IInitializeModule);
Class.implement(MeldClientService, IProcessCall);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(MeldClientService).with(
    module("meldClientService")
        .args([
            arg().ref("bugCallServer"),
            arg().ref("meldClientManager")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbugserver.MeldClientService', MeldClientService);
