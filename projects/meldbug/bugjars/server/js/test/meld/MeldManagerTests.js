//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('bugyarn.BugYarn')
//@Require('meldbug.MeldManager')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');
var MeldManager             = bugpack.require('meldbug.MeldManager');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWinder("setupTestMeldManager", function(yarn) {
    yarn.spin([
        "setupDummyRedisClient",
        "setupTestMeldBuilder"
    ]);
    yarn.wind({
        meldManager: new MeldManager(this.redisClient, this.meldBuilder)
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldManagerInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn    = bugyarn.yarn(this);
        yarn.spin([
            "setupDummyRedisClient",
            "setupTestMeldBuilder"
        ]);
        this.testMeldManager    = new MeldManager(this.redisClient, this.meldBuilder);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testMeldManager, MeldManager),
            "Assert instance of MeldManager");
        test.assertEqual(this.testMeldManager.getMeldBuilder(), this.meldBuilder,
            "Assert .meldBuilder was set correctly");
        test.assertEqual(this.testMeldManager.getRedisClient(), this.redisClient,
            "Assert .redisClient was set correctly");
    }
};


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(meldManagerInstantiationTest).with(
    test().name("MeldManager - instantiation test")
);
