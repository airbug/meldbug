//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugdouble.BugDouble')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')
//@Require('bugyarn.BugYarn')
//@Require('meldbug.MeldTaskManager')


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
var MeldTaskManager         = bugpack.require('meldbug.MeldTaskManager');


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

bugyarn.registerWinder("setupTestMeldTaskManager", function(yarn) {
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
        meldTaskManager: new MeldTaskManager(this.logger, this.blockingRedisClient, this.redisClient, this.pubSub, this.marshaller, MeldTaskManager.MELD_TASK_QUEUE)
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldTaskManagerInstantiationTest = {

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
        this.testMeldTaskManager    = new MeldTaskManager(this.logger, this.blockingRedisClient, this.redisClient, this.pubSub, this.marshaller, MeldTaskManager.MELD_TASK_QUEUE);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testMeldTaskManager, MeldTaskManager),
            "Assert instance of MeldTaskManager");
        test.assertEqual(this.testMeldTaskManager.getLogger(), this.logger,
            "Assert .logger was set correctly");
        test.assertEqual(this.testMeldTaskManager.getMarshaller(), this.marshaller,
            "Assert .marshaller was set correctly");
        test.assertEqual(this.testMeldTaskManager.getBlockingRedisClient(), this.blockingRedisClient,
            "Assert .blockingRedisClient was set correctly");
        test.assertEqual(this.testMeldTaskManager.getRedisClient(), this.redisClient,
            "Assert .redisClient was set correctly");
        test.assertEqual(this.testMeldTaskManager.getPubSub(), this.pubSub,
            "Assert .pubSub was set correctly");
        test.assertEqual(this.testMeldTaskManager.getTaskQueueName(), MeldTaskManager.MELD_TASK_QUEUE,
            "Assert .taskQueueName was set correctly");
    }
};
bugmeta.annotate(meldTaskManagerInstantiationTest).with(
    test().name("MeldTaskManager - instantiation test")
);
