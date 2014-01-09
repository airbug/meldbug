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
     * @param {function(Throwable=)} callback
     */
    commitMeldTransaction: function(meldTransaction, callback) {
        var _this = this;
        var meldTransactionData = this.meldBuilder.unbuildMeldTransaction(meldTransaction);
        _this.bugCallServer.request(this.callManager, MeldbugClientConsumer.RequstTypes.COMMIT_MELD_TRANSACTION,
            {meldTransaction: meldTransactionData}, function(throwable, callResponse) {
                if (!throwable) {

                    //TEST
                    console.log("COMMIT_MELD_TRANSACTION");
                    console.log("callResponse Type:", callResponse.getType());
                    if (callResponse.getType() === MeldDefines.ResponseTypes.SUCCESS) {
                        callback();
                    } else if (callResponse.getType() === MeldDefines.ResponseTypes.EXCEPTION) {
                        console.error("unhandled error response:", callResponse);
                        var error = callResponse.getData().error;
                        console.log("error:", error);

                        //TODO BRN: Handle exceptions...
                        callback(error);

                    } else if (callResponse.getType() === MeldDefines.ResponseTypes.ERROR) {
                        console.error("unhandled error response:", callResponse);
                        var error = callResponse.getData().error;
                        console.log("error:", error);

                        //TODO BRN: Handle errors...
                        callback(error);
                    }
                } else {
                    if (Class.doesExtend(throwable, Exception)) {
                        var exception = throwable;

                        //TEST
                        console.error(exception);

                        if (Class.doesExtend(exception, RequestFailedException)) {

                            //TODO BRN: If a request fails, we need to figure out what the reason is..

                            console.warn("Could not complete request to callManager:", _this.callManager);
                            callback(exception);
                        } else {
                            //TODO BRN: Unhandled exception types
                            console.error("Unhandled Exception:", exception);
                            callback(exception);
                        }
                    } else {
                        callback(throwable);
                    }
                }
            });
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
