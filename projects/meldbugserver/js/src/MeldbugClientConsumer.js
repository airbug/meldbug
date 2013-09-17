//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugserver')

//@Export('MeldbugClientConsumer')

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('bugcall.RequestFailedException')


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
     */
    _constructor: function(bugCallServer, callManager) {

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
        var meldTransactionData = meldTransaction.toObject();
        _this.bugCallServer.request(this.callManager, MeldbugClientConsumer.RequstTypes.COMMIT_MELD_TRANSACTION,
            {meldTransaction: meldTransactionData}, function(error, callResponse) {
                if (!error) {

                    //TEST
                    console.log("COMMIT_MELD_TRANSACTION callResponse:", callResponse);

                    if (callResponse.getType() === "commitMeldTransactionResponse") {
                        callback();
                    } else if (callResponse.getType() === "commitMeldTransactionException") {
                        console.error("unhandled commitMeldTransactionException response:", callResponse);
                        //TODO BRN: Handle exceptions...
                    } else if (callResponse.getType() == "commitMeldTransactionError") {
                        console.error("undhandled commitMeldTransactionError response:", callResponse);
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
