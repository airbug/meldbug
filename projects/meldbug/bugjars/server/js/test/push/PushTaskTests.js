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
var TestTag          = bugpack.require('bugunit.TestTag');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');
var PushTask                = bugpack.require('meldbug.PushTask');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var stubObject              = BugDouble.stubObject;
var test                    = TestTag.test;


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
bugmeta.tag(pushTaskInstantiationTest).with(
    test().name("PushTask - instantiation test")
);
