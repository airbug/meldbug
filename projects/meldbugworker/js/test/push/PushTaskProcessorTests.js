//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('TypeUtil')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')
//@Require('meldbug.PushTaskProcessor')


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
var TestTag              = bugpack.require('bugunit.TestTag');
var BugYarn                     = bugpack.require('bugyarn.BugYarn');
var PushTaskProcessor           = bugpack.require('meldbug.PushTaskProcessor');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var bugyarn                     = BugYarn.context();
var test                        = TestTag.test;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWinder("setupTestPushTaskProcessor", function(yarn) {
    yarn.spin([
        "setupTestLogger",
        "setupTestPushTaskManager",
        "setupTestMeldTaskManager",
        "setupTestMeldManager"
    ]);
    yarn.wind({
        pushTaskProcessor: new PushTaskProcessor(this.logger, this.pushTaskManager, this.meldTaskManager, this.meldManager)
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var pushTaskProcessorInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn = bugyarn.yarn(this);
        yarn.spin([
            "setupTestLogger",
            "setupTestPushTaskManager",
            "setupTestMeldTaskManager",
            "setupTestMeldManager"
        ]);
        this.testPushTaskProcessor  = new PushTaskProcessor(this.logger, this.pushTaskManager, this.meldTaskManager, this.meldManager);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testPushTaskProcessor, PushTaskProcessor),
            "Assert instance of PushTaskProcessor");
        test.assertEqual(this.testPushTaskProcessor.getLogger(), this.logger,
            "Assert .logger was set correctly");
        test.assertEqual(this.testPushTaskProcessor.getPushTaskManager(), this.pushTaskManager,
            "Assert .pushTaskManager was set correctly");
        test.assertEqual(this.testPushTaskProcessor.getMeldTaskManager(), this.meldTaskManager,
            "Assert .meldTaskManager was set correctly");
        test.assertEqual(this.testPushTaskProcessor.getMeldManager(), this.meldManager,
            "Assert .meldManager was set correctly");
    }
};


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(pushTaskProcessorInstantiationTest).with(
    test().name("PushTaskProcessor - instantiation Test")
);
