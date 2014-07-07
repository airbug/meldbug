//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugflow.BugFlow')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')
//@Require('meldbugserver.MeldBucketService')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var BugFlow                     = bugpack.require('bugflow.BugFlow');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var TestTag              = bugpack.require('bugunit.TestTag');
var BugYarn                     = bugpack.require('bugyarn.BugYarn');
var MeldBucketService           = bugpack.require('meldbugserver.MeldBucketService');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var bugyarn                     = BugYarn.context();
var test                        = TestTag.test;
var $series                     = BugFlow.$series;
var $task                       = BugFlow.$task;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWinder("setupTestMeldBucketService", function(yarn) {
    yarn.spin([
        "setupTestMeldBuilder",
        "setupTestMeldBucketManager",
        "setupTestBugCallServer"
    ]);
    yarn.wind({
        meldBucketService: new MeldBucketService(this.bugCallServer, this.meldBucketManager, this.meldBuilder)
    });
});


//-------------------------------------------------------------------------------
// Test Setup
//-------------------------------------------------------------------------------

var setupMeldBucketService = function(setupObject, callback) {
    setupObject.marshRegistry.configureModule();
    $series([
        $task(function(flow) {
            setupObject.redisClient.connect(function(throwable) {
                flow.complete(throwable);
            });
        })
    ]).execute(callback);
};


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldBucketServiceInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn = bugyarn.yarn(this);
        yarn.spin([
            "setupTestMeldBuilder",
            "setupTestMeldBucketManager",
            "setupTestBugCallServer"
        ]);
        this.testMeldBucketService = new MeldBucketService(this.bugCallServer, this.meldBucketManager, this.meldBuilder);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testMeldBucketService, MeldBucketService),
            "Assert that testMeldBucketService is an instance of MeldBucketService");
        test.assertEqual(this.testMeldBucketService.getBugCallServer(), this.bugCallServer,
            "Assert that .bugCallServer was set correctly");
        test.assertEqual(this.testMeldBucketService.getMeldBucketManager(), this.meldBucketManager,
            "Assert that .meldBucketManager was set correctly");
        test.assertEqual(this.testMeldBucketService.getMeldBuilder(), this.meldBuilder,
            "Assert that .meldBuilder was set correctly");
    }
};
bugmeta.tag(meldBucketServiceInstantiationTest).with(
    test().name("MeldBucketService - instantiation Test")
);


var meldBucketServicePreProcessCallNotCreatedNotReconnectTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this   = this;
        var yarn    = bugyarn.yarn(this);
        yarn.spin([
            "setupTestMeldBucketService",
            "setupTestCall"
        ]);
        $task(function(flow) {
            setupMeldBucketService(_this, function(throwable) {
                flow.complete(throwable);
            });
        }).execute(function(throwable) {
            if (!throwable) {
                test.completeSetup();
            } else {
                test.error(throwable);
            }
        });
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.meldBucketService.preProcessCall(this.call, function(throwable) {
            if (!throwable) {
                //TODO Validations
                test.completeTest();
            } else {
                test.error(throwable);
            }
        });
    }
};
bugmeta.tag(meldBucketServicePreProcessCallNotCreatedNotReconnectTest).with(
    test().name("MeldBucketService - #preProcessCall not created not reconnect Test")
);
