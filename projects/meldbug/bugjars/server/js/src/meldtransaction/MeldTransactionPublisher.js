/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbug.MeldTransactionPublisher')
//@Autoload

//@Require('Class')
//@Require('bugcall.CallRequestPublisher')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
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
var ArgTag               = bugpack.require('bugioc.ArgTag');
var ModuleTag            = bugpack.require('bugioc.ModuleTag');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                         = ArgTag.arg;
var bugmeta                     = BugMeta.context();
var module                      = ModuleTag.module;


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

bugmeta.tag(MeldTransactionPublisher).with(
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
