//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugserver')

//@Export('MeldbugClientConsumer')

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('bugcall.RequestFailedException')
//@Require('meldbug.MeldDefines')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Exception               = bugpack.require('Exception');
var Obj                     = bugpack.require('Obj');
var RequestFailedException  = bugpack.require('bugcall.RequestFailedException');
var MeldDefines             = bugpack.require('meldbug.MeldDefines');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldbugClientConsumer = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {BugCallServer} bugCallServer
     * @param {CallManager} callManager
     * @param {MeldBuilder} meldBuilder
     */
    _constructor: function(bugCallServer, callManager, meldBuilder) {

        this._super();


        //-------------------------------------------------------------------------------
        // Instance Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BugCallServer}
         */
        this.bugCallServer  = bugCallServer;

        /**
         * @private
         * @type {CallManager}
         */
        this.callManager    = callManager;

        /**
         * @private
         * @type {MeldBuilder}
         */
        this.meldBuilder    = meldBuilder;

        this.initialize();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {CallManager}
     */
    getCallManager: function() {
        return this.callManager;
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {MeldTransaction} meldTransaction
     * @param {function(Error)} callback
     */
    commitMeldTransaction: function(meldTransaction, callback) {

        //TODO BRN: Add Lock support to this call so that we do not send more than one transaction at a time

        var _this = this;
        var meldTransactionData = this.meldBuilder.unbuildMeldTransaction(meldTransaction);
        _this.bugCallServer.request(this.callManager, MeldbugClientConsumer.RequstTypes.COMMIT_MELD_TRANSACTION,
            {meldTransaction: meldTransactionData}, function(throwable, callResponse) {
                if (!throwable) {

                    //TEST
                    console.log("COMMIT_MELD_TRANSACTION callResponse:", callResponse);

                    if (callResponse.getType() === MeldDefines.ResponseTypes.SUCCESS) {
                        callback();
                    } else if (callResponse.getType() === MeldDefines.ResponseTypes.EXCEPTION) {
                        console.error("unhandled exception response:", callResponse);
                        //TODO BRN: Handle exceptions...
                    } else if (callResponse.getType() === MeldDefines.ResponseTypes.ERROR) {
                        console.error("undhandled error response:", callResponse);
                        //TODO BRN: Handle errors...
                    }
                } else {
                    if (Class.doesExtend(error, Exception)) {
                        var exception = error;

                        //TEST
                        console.error(exception);

                        if (Class.doesExtend(exception, RequestFailedException)) {

                            //TODO BRN: If a request fails, we need to figure out what the reason is..

                            console.warn("Could not complete request to callManager:", _this.callManager);
                            callback();
                        } else {
                            //TODO BRN: Unhandled exception types
                            console.error("Unhandled Exception:", exception);
                            callback(exception);
                        }
                    } else {
                        callback(error);
                    }
                }
            });
    },


    //-------------------------------------------------------------------------------
    // Private Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    initialize: function() {
        this.callManager.addEventPropagator(this);
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @enum {string}
 */
MeldbugClientConsumer.RequstTypes = {
    COMMIT_MELD_TRANSACTION: "commitMeldTransaction"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbugserver.MeldbugClientConsumer', MeldbugClientConsumer);
