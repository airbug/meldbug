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
//@Require('meldbug.CleanupTaskManager')


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
var CleanupTaskManager         = bugpack.require('meldbug.CleanupTaskManager');


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

bugyarn.registerWinder("setupTestCleanupTaskManager", function(yarn) {
    yarn.spin([
        "setupTestLogger",
        "setupDummyRedisClient",
        "setupTestPubSub",
        "setupTestMarshaller"
    ]);
    yarn.wind({
        blockingRedisClient: yarn.weave("dummyRedisClient")
    });
    yarn.wind({
        cleanupTaskManager: new CleanupTaskManager(this.logger, this.blockingRedisClient, this.redisClient, this.pubSub, this.marshaller, CleanupTaskManager.CLEANUP_TASK_QUEUE)
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var cleanupTaskManagerInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn = bugyarn.yarn(this);
        yarn.spin([
            "setupTestLogger",
            "setupDummyRedisClient",
            "setupTestPubSub",
            "setupTestMarshaller"
        ]);
        yarn.wind({
            blockingRedisClient: yarn.weave("dummyRedisClient")
        });
        this.testCleanupTaskManager    = new CleanupTaskManager(this.logger, this.blockingRedisClient, this.redisClient, this.pubSub, this.marshaller, CleanupTaskManager.CLEANUP_TASK_QUEUE);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testCleanupTaskManager, CleanupTaskManager),
            "Assert instance of CleanupTaskManager");
        test.assertEqual(this.testCleanupTaskManager.getLogger(), this.logger,
            "Assert .logger was set correctly");
        test.assertEqual(this.testCleanupTaskManager.getMarshaller(), this.marshaller,
            "Assert .marshaller was set correctly");
        test.assertEqual(this.testCleanupTaskManager.getBlockingRedisClient(), this.blockingRedisClient,
            "Assert .blockingRedisClient was set correctly");
        test.assertEqual(this.testCleanupTaskManager.getRedisClient(), this.redisClient,
            "Assert .redisClient was set correctly");
        test.assertEqual(this.testCleanupTaskManager.getPubSub(), this.pubSub,
            "Assert .pubSub was set correctly");
        test.assertEqual(this.testCleanupTaskManager.getTaskQueueName(), CleanupTaskManager.CLEANUP_TASK_QUEUE,
            "Assert .taskQueueName was set correctly");
    }
};
bugmeta.tag(cleanupTaskManagerInstantiationTest).with(
    test().name("CleanupTaskManager - instantiation test")
);
