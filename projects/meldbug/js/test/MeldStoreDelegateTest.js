//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('meldbug.MeldBucket')
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
var MeldBucket              = bugpack.require('meldbug.MeldBucket');
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

// var meldStoreDelegateEnsureMeldKeyRetrieved = {

//     //-------------------------------------------------------------------------------
//     // Setup Test
//     //-------------------------------------------------------------------------------

//     setup: function(test) {
//         this.meldBucket             = new MeldBucket();
//         this.meldStore              = new MeldStore(this.meldBucket);
//         this.meldStoreDelegate      = new MeldStoreDelegate(this.meldStore);
//     },


//     //-------------------------------------------------------------------------------
//     // Run Test
//     //-------------------------------------------------------------------------------

//     test: function(test) {
//         this.meldStoreDelegate.ensureMeldKeyRetrieved(this.meldKey);
//         var parentPropagator = this.meldStoreDelegate.meldBucket.getParentPropagator();
//         test.assertEqual(parentPropagator, this.meldStoreDelegate,
//             "Assert meldStoreDelegate is the parentPropagator");
//     }
// };
// bugmeta.annotate(meldStoreDelegateInitializeTest).with(
//     test().name("MeldStoreDelegate - #ensureMeldKeyRetrieved Test")
// );
