//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugdouble.BugDouble')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('bugyarn.BugYarn')
//@Require('meldbug.Task')


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
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');
var Task                    = bugpack.require('meldbug.Task');


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

bugyarn.registerWeaver("testTask", function(yarn, args) {
    return new Task(args[0]);
});

bugyarn.registerWinder("setupTestTask", function(yarn) {
    yarn.wind({
        task: new Task("testTaskUuid")
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var taskInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testTaskUuid   = "testTaskUuid";
        this.testTask       = new Task(this.testTaskUuid);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testTask, Task),
            "Assert instance of Task");
        test.assertEqual(this.testTask.getTaskUuid(), this.testTaskUuid,
            "Assert .taskUuid was set correctly");
    }
};
bugmeta.annotate(taskInstantiationTest).with(
    test().name("Task - instantiation test")
);
