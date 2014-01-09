//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugserver')

//@Export('MeldSessionService')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('bugcall.CallEvent')
//@Require('bugcall.IProcessCall')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


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
var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation        = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');



//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                     = ArgAnnotation.arg;
var bugmeta                 = BugMeta.context();
var module                  = ModuleAnnotation.module;
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
         * @type {MeldSessionManager}
         */
        this.meldSessionManager              = meldSessionManager;

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
     * @return {MeldSessionManager}
     */
    getMeldSessionManager: function() {
        return this.meldSessionManager;
    },


    //-------------------------------------------------------------------------------
    // ICallProcessor Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {CallManager} callManager
     * @param {function(Throwable=)} callback
     */
    processCall: function(callManager, callback) {
        var _this               = this;
        var callConnection      = callManager.getConnection();
        var sessionId           = callConnection.getHandshake().sessionId;
        var meldSessionKey      = this.meldSessionManager.generateMeldSessionKey(sessionId);

        $series([
            $task(function(flow) {
                _this.meldSessionManager.addCallUuidToMeldSession(callManager.getCallUuid(), meldSessionKey, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(callback);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

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

        //NOTE BRN: We currently don't remove callUuids from a user's MeldSession because of this edge case
        // 1) User's callUuid is melded with a MeldDocumentKey
        // 2) User's call is dropped for a moment (MeldSessionManager remove's that callUuid from that MeldSession)
        // 3) During that time, user us unmelded from the MeldDocumentKey.
        // Edge Case: Because the callUuid is no longer in the session, the callUuid is not included in the calls that are unmelded from the MeldDocumentKey
        // 4) Call resumes with same callUuid and it still melded to the MeldDocumentKey that it should not be melded to.

        /*var _this               = this;
        var data                = event.getData();
        var callManager         = data.callManager;
        var callConnection      = callManager.getConnection();
        var sessionId           = callConnection.getHandshake().sessionId;
        var meldSessionKey      = this.meldSessionManager.generateMeldSessionKey(sessionId);

        $series([
            $task(function(flow) {
                _this.meldSessionManager.removeCallUuidFromMeldSession(meldSessionKey, callManager.getCallUuid(), function(throwable) {
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
