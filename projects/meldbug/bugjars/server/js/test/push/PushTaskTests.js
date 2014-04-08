//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugdouble.BugDouble')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')
//@Require('bugyarn.BugYarn')
//@Require('meldbug.PushTask')


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
var PushTask                = bugpack.require('meldbug.PushTask');


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

bugyarn.registerWeaver("testPushTask", function(yarn, args) {
    return new PushTask(args[0], args[1]);
});

bugyarn.registerWinder("setupTestPushTask", function(yarn) {
    yarn.spin([
        "setupTestPush"
    ]);
    this.testTaskUuid = "testTaskUuid";
    yarn.wind({
        pushTask: new PushTask(this.testTaskUuid, this.push)
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var pushTaskInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn = bugyarn.yarn(this);
        yarn.spin([
            "setupTestPush"
        ]);
        this.testTaskUuid   = "testTaskUuid";
        this.testPushTask   = new PushTask(this.testTaskUuid, this.push);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testPushTask, PushTask),
            "Assert instance of PushTask");
        test.assertEqual(this.testPushTask.getTaskUuid(), this.testTaskUuid,
            "Assert .taskUuid was set correctly");
        test.assertEqual(this.testPushTask.getPush(), this.push,
            "Assert .push was set correctly");
    }
};
bugmeta.annotate(pushTaskInstantiationTest).with(
    test().name("PushTask - instantiation test")
);
