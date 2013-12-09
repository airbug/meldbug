//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('meldbug.Meld')
//@Require('meldbug.MeldBucket')
//@Require('meldbug.MeldKey')
//@Require('meldbug.MeldStore')
//@Require('meldbug.MeldStoreDelegate')



//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var Meld                    = bugpack.require('meldbug.Meld');
var MeldBucket              = bugpack.require('meldbug.MeldBucket');
var MeldKey                 = bugpack.require('meldbug.MeldKey');
var MeldStore               = bugpack.require('meldbug.MeldStore');
var MeldStoreDelegate       = bugpack.require('meldbug.MeldStoreDelegate');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldStoreDelegateInitializeTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.meldBucket             = new MeldBucket();
        this.meldStore              = new MeldStore(this.meldBucket);
        this.meldStoreDelegate      = new MeldStoreDelegate(this.meldStore);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.meldStoreDelegate.initialize();
        var parentPropagator = this.meldStoreDelegate.meldBucket.getParentPropagator();
        test.assertEqual(parentPropagator, this.meldStoreDelegate,
            "Assert meldStoreDelegate is the parentPropagator");
    }
};
bugmeta.annotate(meldStoreDelegateInitializeTest).with(
    test().name("MeldStoreDelegate - #initialize Test")
);

var meldStoreDelegateEnsureMeldKeyRetrievedTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.meldBucket             = new MeldBucket();
        this.meldStore              = new MeldStore(this.meldBucket);
        this.meldKey                = new MeldKey("TestType", "testId", "basic");
        this.meld                   = new Meld(this.meldKey, this.meldType);
        this.meldStoreDelegate      = new MeldStoreDelegate(this.meldStore);
        this.meldBucket.addMeld(this.meld);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertFalse(this.meldStoreDelegate.meldKeyRetrievedSet.contains(this.meldKey),
            "Assert the meldKey is not contained in the meldKeyRetrievedSet");
        this.meldStoreDelegate.ensureMeldKeyRetrieved(this.meldKey);
        test.assertTrue(this.meldStoreDelegate.meldKeyRetrievedSet.contains(this.meldKey),
            "Assert that the meldKey is contained in the meldKeyRetrievedSet after #ensureMeldKeyRetrieved call");
        //TODO SUNG What if the meld is not in the meldStore? Should it error?
    }
};
bugmeta.annotate(meldStoreDelegateEnsureMeldKeyRetrievedTest).with(
    test().name("MeldStoreDelegate - #ensureMeldKeyRetrieved Test")
);

// var meldStoreDelegateEnsureMeldKeyRetrievedTestTwo = {

//     //-------------------------------------------------------------------------------
//     // Setup Test
//     //-------------------------------------------------------------------------------

//     setup: function(test) {
//         this.meldBucket             = new MeldBucket();
//         this.meldStore              = new MeldStore(this.meldBucket);
//         this.meldKey                = new MeldKey("TestType", "testId", "basic");
//         this.meld                   = new Meld(this.meldKey, this.meldType);
//         this.meldStoreDelegate      = new MeldStoreDelegate(this.meldStore);
//     },


//     //-------------------------------------------------------------------------------
//     // Run Test
//     //-------------------------------------------------------------------------------

//     test: function(test) {
//         //case where it already has the meldKey
//         //case where it does not have the meldKey
//         //case where it does not have the meldKey and it is not in the meldstore
//         //case where it does not have the meldKey and it is in the meldStore
//         test.assertFalse(this.meldStoreDelegate.meldKeyRetrievedSet.contains(this.meldKey),
//             "Assert the meldKey is not contained in the meldKeyRetrievedSet");
//         this.meldStoreDelegate.ensureMeldKeyRetrieved(this.meldKey);
//         test.assertTrue(this.meldStoreDelegate.meldKeyRetrievedSet.contains(this.meldKey),
//             "Assert that the meldKey is contained in the meldKeyRetrievedSet after #ensureMeldKeyRetrieved call");
//         //TODO SUNG What if the meld is not in the meldStore? Should it error?
//     }
// };
// bugmeta.annotate(meldStoreDelegateEnsureMeldKeyRetrievedTestTwo).with(
//     test().name("MeldStoreDelegate - #ensureMeldKeyRetrieved Test Two")
// );

var meldStoreDelegateGetMeldTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.meldBucket         = new MeldBucket();
        this.meldKey            = new MeldKey("TestType", "testId", "basic");
        this.meldKeyTwo         = new MeldKey("OtherType", "otherId", "basic");
        this.meld               = new Meld(this.meldKey, this.meldType);
        this.meldBucket.addMeld(this.meld);
        this.meldStore          = new MeldStore(this.meldBucket);
        this.meldStoreDelegate  = new MeldStoreDelegate(this.meldStore);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var meld    = this.meldStoreDelegate.getMeld(this.meldKey);
        var meldKey = meld.getMeldKey();
        test.assertNotEqual(meld, this.meld,
            "Assert meld returned by #getMeld is not equal to the original meld. It should be a clone.");
        test.assertTrue((meldKey.getId() === this.meldKey.getId() && meldKey.getFilterType() === this.meldKey.getFilterType() && meldKey.getDataType() === this.meldKey.getDataType()),
            "Assert the meldClone has a meldKey with the same type, id and filter");
    }
};
bugmeta.annotate(meldStoreDelegateGetMeldTest).with(
    test().name("MeldStoreDelegate - #getMeld Test")
);

var meldStoreDelegateContainsMeldByKeyTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.meldBucket         = new MeldBucket();
        this.meldKey            = new MeldKey("TestType", "testId", "basic");
        this.meldKeyTwo         = new MeldKey("OtherType", "otherId", "basic");
        this.meld               = new Meld(this.meldKey, this.meldType);
        this.meldBucket.addMeld(this.meld);
        this.meldStore          = new MeldStore(this.meldBucket);
        this.meldStoreDelegate  = new MeldStoreDelegate(this.meldStore);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(this.meldStoreDelegate.containsMeldByKey(this.meldKey),
            "Assert #containsMeldByKey returns true for a meld that has been added to the meldBucket");
        test.assertTrue(this.meldStoreDelegate.containsMeldByKey(this.meldKey.clone()),
            "Assert #containsMeldByKey returns true for a meld that has been added to the meldBucket when retrieved using a clone of the meldKey");
        test.assertFalse(this.meldStoreDelegate.containsMeldByKey(this.meldKeyTwo),
            "Assert #containsMeldByKey returns false for a meld that has not been added to the meldBucket");
    }
};
bugmeta.annotate(meldStoreDelegateContainsMeldByKeyTest).with(
    test().name("MeldStoreDelegate - #containsMeldByKey Test")
);
