//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('bugyarn.BugYarn')
//@Require('meldbug.Push')
//@Require('meldbug.PushManager')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');
var Push                    = bugpack.require('meldbug.Push');
var PushManager             = bugpack.require('meldbug.PushManager');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWinder("setupTestPushManager", function(yarn) {
    yarn.spin([
        "setupTestPushTaskManager"
    ]);
    yarn.wind({
        pushManager: new PushManager(this.pushTaskManager)
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var pushManagerInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn    = bugyarn.yarn(this);
        yarn.spin([
            "setupTestPushTaskManager"
        ]);
        this.testPushManager    = new PushManager(this.pushTaskManager);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testPushManager, PushManager),
            "Assert instance of PushManager");
        test.assertEqual(this.testPushManager.getPushTaskManager(), this.pushTaskManager,
            "Assert .pushTaskManager was set correctly");
    }
};
bugmeta.annotate(pushManagerInstantiationTest).with(
    test().name("PushManager - instantiation test")
);


var pushManagerPushTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn    = bugyarn.yarn(this);
        yarn.spin([
            "setupTestPushManager"
        ]);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var push = this.pushManager.push();
        test.assertTrue(Class.doesExtend(push, Push),
            "Assert that push is an instance of Push");
        test.assertEqual(push.getPushTaskManager(), this.pushTaskManager,
            "Assert that pushTaskManager was passed to Push correctly");
    }
};
bugmeta.annotate(pushManagerPushTest).with(
    test().name("PushManager - #push test")
);
