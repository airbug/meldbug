//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbugserver.MeldSessionService')
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
var MeldSessionService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {BugCallServer} bugCallServer
     * @param {MeldSessionManager} meldSessionManager
     */
    _constructor: function(bugCallServer, meldSessionManager) {

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
         * @type {MeldSessionManager}
         */
        this.meldSessionManager              = meldSessionManager;
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
     * @return {MeldSessionManager}
     */
    getMeldSessionManager: function() {
        return this.meldSessionManager;
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
    processCall: function(call, callback) {
        var _this               = this;
        var sessionId           = call.getHandshake().sessionId;
        var meldSessionKey      = this.meldSessionManager.generateMeldSessionKey(sessionId);

        $series([
            $task(function(flow) {
                _this.meldSessionManager.addCallUuidToMeldSession(call.getCallUuid(), meldSessionKey, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(callback);
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
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {CallEvent} event
     */
    hearBugCallServerCallClosed: function(event) {

        //NOTE BRN: We currently don't remove callUuids from a user's MeldSession because of this edge case
        // 1) User's callUuid is melded with a MeldDocumentKey
        // 2) User's call is dropped for a moment (MeldSessionManager remove's that callUuid from that MeldSession)
        // 3) During that time, user us unmelded from the MeldDocumentKey.
        // Edge Case: Because the callUuid is no longer in the session, the callUuid is not included in the calls that are unmelded from the MeldDocumentKey
        // 4) Call resumes with same callUuid and it still melded to the MeldDocumentKey that it should not be melded to.

        /*var _this               = this;
        var data                = event.getData();
        var call                = data.call;
        var sessionId           = call.getHandshake().sessionId;
        var meldSessionKey      = this.meldSessionManager.generateMeldSessionKey(sessionId);

        $series([
            $task(function(flow) {
                _this.meldSessionManager.removeCallUuidFromMeldSession(meldSessionKey, call.getCallUuid(), function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (throwable) {
                console.error(throwable.message, throwable.stack);
            }
            //TODO BRN: What do we do if this fails?
        });*/
    }
});


//-------------------------------------------------------------------------------
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(MeldSessionService, IInitializeModule);
Class.implement(MeldSessionService, IProcessCall);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(MeldSessionService).with(
    module("meldSessionService")
        .args([
            arg().ref("bugCallServer"),
            arg().ref("meldSessionManager")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbugserver.MeldSessionService', MeldSessionService);
