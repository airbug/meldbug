//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugflow.BugFlow')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')
//@Require('meldbug.MeldBucket')
//@Require('meldbug.MeldBucketManager')
//@Require('meldbug.MeldDocument')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestTag          = bugpack.require('bugunit.TestTag');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');
var MeldBucket              = bugpack.require('meldbug.MeldBucket');
var MeldBucketManager       = bugpack.require('meldbug.MeldBucketManager');
var MeldDocument            = bugpack.require('meldbug.MeldDocument');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestTag.test;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWinder("setupTestMeldBucketManager", function(yarn) {
    yarn.spin([
        "setupDummyRedisClient",
        "setupTestMeldBuilder"
    ]);
    yarn.wind({
        meldBucketManager: new MeldBucketManager(this.redisClient, this.meldBuilder)
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldBucketManagerInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn    = bugyarn.yarn(this);
        yarn.spin([
            "setupDummyRedisClient",
            "setupTestMeldBuilder"
        ]);
        this.testMeldBucketManager    = new MeldBucketManager(this.redisClient, this.meldBuilder);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testMeldBucketManager, MeldBucketManager),
            "Assert instance of MeldBucketManager");
        test.assertEqual(this.testMeldBucketManager.getRedisClient(), this.redisClient,
            "Assert .redisClient was set correctly");
        test.assertEqual(this.testMeldBucketManager.getMeldBuilder(), this.meldBuilder,
            "Assert .meldBuilder was set correctly");
    }
};

var meldBucketManagerCompressDecompressMeldBucketTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn    = bugyarn.yarn(this);
        yarn.spin([
            "setupTestMeldBucketManager"
        ]);
        this.testMeldBucket         = yarn.weave("testMeldBucket");
        this.testDataValue          = "testDataValue";
        this.testData               = {
            key: this.testDataValue
        };
        this.testDataType           = "testDataType";
        this.testId                 = "testId";
        this.testMeldDocumentKey    = yarn.weave("testMeldDocumentKey", [this.testDataType, this.testId]);
        this.testMeldDocument       = yarn.weave("testMeldDocument", [this.testMeldDocumentKey, this.testData]);
        this.testMeldBucket.addMeldDocument(this.testMeldDocument);
        this.marshRegistry.processModule();
        test.completeSetup();
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        var meldBucketData = null;
        $series([
            $task(function(flow) {
                _this.meldBucketManager.compressMeldBucket(_this.testMeldBucket, function(throwable, returnedMeldBucketData) {
                    if (!throwable) {
                        meldBucketData = returnedMeldBucketData;
                    }
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.meldBucketManager.decompressMeldBucket(meldBucketData, function(throwable, returnedMeldBucket) {
                    if (!throwable) {
                        test.assertTrue(Class.doesExtend(returnedMeldBucket, MeldBucket),
                            "Assert instance of MeldBucket");
                        if (Class.doesExtend(returnedMeldBucket, MeldBucket)) {
                            var meldDocument = returnedMeldBucket.getMeldDocumentByMeldDocumentKey(_this.testMeldDocumentKey);
                            test.assertTrue(Class.doesExtend(meldDocument, MeldDocument),
                                "Assert instance of MeldDocument");
                            if (meldDocument) {
                                test.assertEqual(_this.testMeldDocumentKey, meldDocument.getMeldDocumentKey(),
                                    "Assert MeldDocumentKeys are equal");
                                test.assertEqual(meldDocument.getData().key, _this.testDataValue,
                                    "Assert dataValues are equal");
                            }
                        }
                    }
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                test.completeTest();
            } else {
                test.error(throwable);
            }
        });

    }
};


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(meldBucketManagerInstantiationTest).with(
    test().name("MeldBucketManager - instantiation test")
);
bugmeta.tag(meldBucketManagerCompressDecompressMeldBucketTest).with(
    test().name("MeldBucketManager - #compressMeldBucket #decompressMeldBucket test")
);