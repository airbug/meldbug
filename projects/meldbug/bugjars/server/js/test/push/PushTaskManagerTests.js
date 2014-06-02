//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugdouble.BugDouble')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')
//@Require('meldbug.PushTaskManager')


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
var PushTaskManager         = bugpack.require('meldbug.PushTaskManager');


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

bugyarn.registerWinder("setupTestPushTaskManager", function(yarn) {
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
        pushTaskManager: new PushTaskManager(this.logger, this.blockingRedisClient, this.redisClient, this.pubSub, this.marshaller, PushTaskManager.PUSH_TASK_QUEUE)
    });
});

bugyarn.registerWinder("setupMockSuccessPushTaskManager", function(yarn) {
    var _this = this;
    yarn.spin([
        "setupTestPushTaskManager"
    ]);
    stubObject(this.pushTaskManager, {
        queueTask: function(task, callback) {
            setTimeout(function() {
                _this.pushTaskManager.reportTaskComplete(task, function(throwable, numberReceived) {
                    if (!throwable) {

                    } else {
                        throw throwable;
                    }
                });
            }, 0);
            callback();
        }
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var pushTaskManagerInstantiationTest = {

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
        this.testPushTaskManager    = new PushTaskManager(this.logger, this.blockingRedisClient, this.redisClient, this.pubSub, this.marshaller, PushTaskManager.PUSH_TASK_QUEUE);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testPushTaskManager, PushTaskManager),
            "Assert instance of PushTaskManager");
        test.assertEqual(this.testPushTaskManager.getLogger(), this.logger,
            "Assert .logger was set correctly");
        test.assertEqual(this.testPushTaskManager.getMarshaller(), this.marshaller,
            "Assert .marshaller was set correctly");
        test.assertEqual(this.testPushTaskManager.getBlockingRedisClient(), this.blockingRedisClient,
            "Assert .blockingRedisClient was set correctly");
        test.assertEqual(this.testPushTaskManager.getRedisClient(), this.redisClient,
            "Assert .redisClient was set correctly");
        test.assertEqual(this.testPushTaskManager.getPubSub(), this.pubSub,
            "Assert .pubSub was set correctly");
        test.assertEqual(this.testPushTaskManager.getTaskQueueName(), PushTaskManager.PUSH_TASK_QUEUE,
            "Assert .taskQueueName was set correctly");
    }
};
bugmeta.tag(pushTaskManagerInstantiationTest).with(
    test().name("PushTaskManager - instantiation test")
);
