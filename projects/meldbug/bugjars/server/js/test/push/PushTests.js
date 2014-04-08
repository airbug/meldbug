//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugdouble.BugDouble')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')
//@Require('bugyarn.BugYarn')
//@Require('meldbug.Push')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var BugDouble               = bugpack.require('bugdouble.BugDouble');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit.TestAnnotation');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');
var Push                    = bugpack.require('meldbug.Push');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var stubObject              = BugDouble.stubObject;
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWeaver("testPush", function(yarn, args) {
    yarn.spin([
        "setupTestPushTaskManager"
    ]);
    return new Push(this.pushTaskManager);
});

bugyarn.registerWinder("setupTestPush", function(yarn) {
    yarn.spin([
        "setupTestPushTaskManager"
    ]);
    yarn.wind({
        push: new Push(this.pushTaskManager)
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var pushInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn = bugyarn.yarn(this);
        yarn.spin([
            "setupTestPushTaskManager"
        ]);
        this.testPush   = new Push(this.pushTaskManager);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testPush, Push),
            "Assert instance of Push");
        test.assertEqual(this.testPush.getPushTaskManager(), this.pushTaskManager,
            "Assert .pushTaskManager was set correctly");
    }
};
bugmeta.annotate(pushInstantiationTest).with(
    test().name("Push - instantiation test")
);
