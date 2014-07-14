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
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
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
var TestTag          = bugpack.require('bugunit.TestTag');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');
var Push                    = bugpack.require('meldbug.Push');
var PushManager             = bugpack.require('meldbug.PushManager');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestTag.test;


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
bugmeta.tag(pushManagerInstantiationTest).with(
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
bugmeta.tag(pushManagerPushTest).with(
    test().name("PushManager - #push test")
);
