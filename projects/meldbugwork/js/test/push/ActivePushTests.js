//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Set')
//@Require('TypeUtil')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('bugyarn.BugYarn')
//@Require('meldbug.ActivePush')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Set                         = bugpack.require('Set');
var TypeUtil                    = bugpack.require('TypeUtil');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var TestAnnotation              = bugpack.require('bugunit-annotate.TestAnnotation');
var BugYarn                     = bugpack.require('bugyarn.BugYarn');
var ActivePush                  = bugpack.require('meldbug.ActivePush');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var bugyarn                     = BugYarn.context();
var test                        = TestAnnotation.test;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWeaver("testActivePush", function(yarn, args) {
    yarn.spin([
        "setupTestLogger",
        "setupTestMeldTaskManager"
    ]);
    return new ActivePush(this.logger, this.meldTaskManager, args[0], args[1]);
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var activePushInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn = bugyarn.yarn(this);
        yarn.spin([
            "setupTestLogger",
            "setupTestMeldTaskManager"
        ]);
        this.testPushTaskUuid       = "testPushTaskUuid";
        this.testMeldTaskUuidSet    = new Set();
        this.testActivePush         = new ActivePush(this.logger, this.meldTaskManager, this.testPushTaskUuid, this.testMeldTaskUuidSet);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testActivePush, ActivePush),
            "Assert instance of ActivePush");
        test.assertEqual(this.testActivePush.getLogger(), this.logger,
            "Assert .logger was set correctly");
        test.assertEqual(this.testActivePush.getMeldTaskManager(), this.meldTaskManager,
            "Assert .meldTaskManager was set correctly");
        test.assertEqual(this.testActivePush.getPushTaskUuid(), this.testPushTaskUuid,
            "Assert .pushTaskUuid was set correctly");
        test.assertEqual(this.testActivePush.getMeldTaskUuidSet(), this.testMeldTaskUuidSet,
            "Assert .meldTaskUuidSet was set correctly");
        test.assertEqual(this.testActivePush.getCompleted(), false,
            "Assert .completed defaults to false");
        test.assertEqual(this.testActivePush.getStarted(), false,
            "Assert .started defaults to false");
    }
};


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(activePushInstantiationTest).with(
    test().name("ActivePush - instantiation Test")
);
