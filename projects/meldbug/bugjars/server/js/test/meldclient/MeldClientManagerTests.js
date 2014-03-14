//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugdouble.BugDouble')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('bugyarn.BugYarn')
//@Require('meldbug.MeldClientManager')


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
var MeldClientManager       = bugpack.require('meldbug.MeldClientManager');


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

bugyarn.registerWinder("setupTestMeldClientManager", function(yarn) {
    yarn.spin([
        "setupDummyRedisClient"
    ]);
    yarn.wind({
        meldClientManager: new MeldClientManager(this.redisClient)
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldClientManagerInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn = bugyarn.yarn(this);
        yarn.spin([
            "setupDummyRedisClient"
        ]);
        this.testMeldClientManager      = new MeldClientManager(this.redisClient);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testMeldClientManager, MeldClientManager),
            "Assert instance of MeldClientManager");
        test.assertEqual(this.testMeldClientManager.getRedisClient(), this.redisClient,
            "Assert .redisClient was set correctly");
    }
};
bugmeta.annotate(meldClientManagerInstantiationTest).with(
    test().name("MeldClientManager - instantiation test")
);
