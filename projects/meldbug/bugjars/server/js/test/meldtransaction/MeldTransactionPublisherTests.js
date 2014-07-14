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

//@TestFile

//@Require('Class')
//@Require('bugdouble.BugDouble')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')
//@Require('meldbug.MeldTransactionPublisher')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var BugDouble                   = bugpack.require('bugdouble.BugDouble');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var TestTag              = bugpack.require('bugunit.TestTag');
var BugYarn                     = bugpack.require('bugyarn.BugYarn');
var MeldTransactionPublisher    = bugpack.require('meldbug.MeldTransactionPublisher');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var bugyarn                     = BugYarn.context();
var stubObject                  = BugDouble.stubObject;
var test                        = TestTag.test;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWinder("setupTestMeldTransactionPublisher", function(yarn) {
    yarn.spin([
        "setupTestLogger",
        "setupTestCallManager",
        "setupTestCallRequestManager",
        "setupTestCallRequestFactory",
        "setupTestCallResponseHandlerFactory",
        "setupTestPubSub"
    ]);
    yarn.wind({
        meldTransactionPublisher: new MeldTransactionPublisher(this.logger, this.callManager, this.callRequestManager, this.callRequestFactory, this.callResponseHandlerFactory, this.pubSub)
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldTransactionPublisherInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn = bugyarn.yarn(this);
        yarn.spin([
            "setupTestLogger",
            "setupTestCallManager",
            "setupTestCallRequestManager",
            "setupTestCallRequestFactory",
            "setupTestCallResponseHandlerFactory",
            "setupTestPubSub"
        ]);
        this.testMeldTransactionPublisher   = new MeldTransactionPublisher(this.logger, this.callManager, this.callRequestManager, this.callRequestFactory, this.callResponseHandlerFactory, this.pubSub);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testMeldTransactionPublisher, MeldTransactionPublisher),
            "Assert instance of MeldTransactionPublisher");
        test.assertEqual(this.testMeldTransactionPublisher.getLogger(), this.logger,
            "Assert .logger was set correctly");
        test.assertEqual(this.testMeldTransactionPublisher.getCallManager(), this.callManager,
            "Assert .callManager was set correctly");
        test.assertEqual(this.testMeldTransactionPublisher.getCallRequestManager(), this.callRequestManager,
            "Assert .callRequestManager was set correctly");
        test.assertEqual(this.testMeldTransactionPublisher.getCallRequestFactory(), this.callRequestFactory,
            "Assert .callRequestFactory was set correctly");
        test.assertEqual(this.testMeldTransactionPublisher.getCallResponseHandlerFactory(), this.callResponseHandlerFactory,
            "Assert .callResponseHandlerFactory was set correctly");
        test.assertEqual(this.testMeldTransactionPublisher.getPubSub(), this.pubSub,
            "Assert .pubSub was set correctly");
    }
};
bugmeta.tag(meldTransactionPublisherInstantiationTest).with(
    test().name("MeldTransactionPublisher - instantiation test")
);
