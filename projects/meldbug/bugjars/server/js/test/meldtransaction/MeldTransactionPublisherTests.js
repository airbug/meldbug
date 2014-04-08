//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugdouble.BugDouble')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')
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
var TestAnnotation              = bugpack.require('bugunit.TestAnnotation');
var BugYarn                     = bugpack.require('bugyarn.BugYarn');
var MeldTransactionPublisher    = bugpack.require('meldbug.MeldTransactionPublisher');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var bugyarn                     = BugYarn.context();
var stubObject                  = BugDouble.stubObject;
var test                        = TestAnnotation.test;


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
bugmeta.annotate(meldTransactionPublisherInstantiationTest).with(
    test().name("MeldTransactionPublisher - instantiation test")
);
