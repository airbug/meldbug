//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('TypeUtil')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('bugyarn.BugYarn')
//@Require('meldbug.MeldTaskProcessor')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var TypeUtil                    = bugpack.require('TypeUtil');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var TestAnnotation              = bugpack.require('bugunit-annotate.TestAnnotation');
var BugYarn                     = bugpack.require('bugyarn.BugYarn');
var MeldTaskProcessor           = bugpack.require('meldbug.MeldTaskProcessor');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var bugyarn                     = BugYarn.context();
var test                        = TestAnnotation.test;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWinder("setupTestMeldTaskProcessor", function(yarn) {
    yarn.spin([
        "setupTestLogger",
        "setupTestMeldTaskManager",
        "setupTestMeldBucketManager",
        "setupTestMeldTransactionPublisher",
        "setupTestMeldTransactionGenerator",
        "setupTestMeldClientManager",
        "setupTestCleanupTaskManager"
    ]);
    yarn.wind({
        meldTaskProcessor: new MeldTaskProcessor(this.logger, this.meldTaskManager, this.meldBucketManager, this.meldTransactionPublisher, this.meldTransactionGenerator, this.meldClientManager, this.cleanupTaskManager)
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldTaskProcessorInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn = bugyarn.yarn(this);
        yarn.spin([
            "setupTestLogger",
            "setupTestMeldTaskManager",
            "setupTestMeldBucketManager",
            "setupTestMeldTransactionPublisher",
            "setupTestMeldTransactionGenerator",
            "setupTestMeldClientManager",
            "setupTestCleanupTaskManager"
        ]);
        this.testMeldTaskProcessor  = new MeldTaskProcessor(this.logger, this.meldTaskManager, this.meldBucketManager, this.meldTransactionPublisher, this.meldTransactionGenerator, this.meldClientManager, this.cleanupTaskManager);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testMeldTaskProcessor, MeldTaskProcessor),
            "Assert instance of MeldTaskProcessor");
        test.assertEqual(this.testMeldTaskProcessor.getLogger(), this.logger,
            "Assert .logger was set correctly");
        test.assertEqual(this.testMeldTaskProcessor.getMeldTaskManager(), this.meldTaskManager,
            "Assert .meldTaskManager was set correctly");
        test.assertEqual(this.testMeldTaskProcessor.getMeldBucketManager(), this.meldBucketManager,
            "Assert .meldBucketManager was set correctly");
        test.assertEqual(this.testMeldTaskProcessor.getMeldTransactionPublisher(), this.meldTransactionPublisher,
            "Assert .meldTransactionPublisher was set correctly");
        test.assertEqual(this.testMeldTaskProcessor.getMeldTransactionGenerator(), this.meldTransactionGenerator,
            "Assert .meldTransactionGenerator was set correctly");
        test.assertEqual(this.testMeldTaskProcessor.getMeldClientManager(), this.meldClientManager,
            "Assert .meldClientManager was set correctly");
        test.assertEqual(this.testMeldTaskProcessor.getCleanupTaskManager(), this.cleanupTaskManager,
            "Assert .cleanupTaskManager was set correctly");
    }
};


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(meldTaskProcessorInstantiationTest).with(
    test().name("MeldTaskProcessor - instantiation Test")
);
