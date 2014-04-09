//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbug.MeldTransactionPublisher')
//@Autoload

//@Require('Class')
//@Require('bugcall.CallRequestPublisher')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var CallRequestPublisher        = bugpack.require('bugcall.CallRequestPublisher');
var ArgAnnotation               = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation            = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                         = ArgAnnotation.arg;
var bugmeta                     = BugMeta.context();
var module                      = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldTransactionPublisher = Class.extend(CallRequestPublisher, {

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} callUuid
     * @param {MeldTransaction} meldTransaction
     * @param {CallResponseHandler} callResponseHandler
     * @param {function(Throwable=)} callback
     */
    publishTransactionRequest: function(callUuid, meldTransaction, callResponseHandler, callback) {
        var callRequest = this.factoryCallRequest(MeldTransactionPublisher.RequestTypes.COMMIT_MELD_TRANSACTION, {
            meldTransaction: meldTransaction
        });
        this.publishCallRequest(callUuid, callRequest, callResponseHandler, callback);
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @enum {string}
 */
MeldTransactionPublisher.RequestTypes = {
    COMMIT_MELD_TRANSACTION: "commitMeldTransaction"
};

/**
 * @static
 * @enum {string}
 */
MeldTransactionPublisher.ResponseTypes = {
    ERROR: "Error",
    EXCEPTION: "Exception",
    SUCCESS: "Success"
};


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(MeldTransactionPublisher).with(
    module("meldTransactionPublisher")
        .args([
            arg().ref("logger"),
            arg().ref("callManager"),
            arg().ref("callRequestManager"),
            arg().ref("callRequestFactory"),
            arg().ref("callResponseHandlerFactory"),
            arg().ref("pubSub")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldTransactionPublisher', MeldTransactionPublisher);
