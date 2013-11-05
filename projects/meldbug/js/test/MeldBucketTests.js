//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('meldbug.Meld')
//@Require('meldbug.MeldBucket')
//@Require('meldbug.MeldKey')


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


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldBucketAddMeldTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id         = "testId";
        this.meldType   = "TestType";
        this.filter     = "basic";
        this.meldBucket = new MeldBucket();
        this.meldKey    = new MeldKey(this.meldType, this.id, this.filter);
        this.meld       = new Meld(this.meldKey, this.meldType);

    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertFalse(this.meldBucket.containsMeld(this.meld),
            "Assert meldBucket does not contain meld");
        this.meldBucket.addMeld(this.meld);
        test.assertTrue(this.meldBucket.containsMeld(this.meld),
            "Assert the meld has been added");
    }
};
bugmeta.annotate(meldBucketAddMeldTest).with(
    test().name("MeldBucket - #addMeld Test")
);

var meldBucketRemoveMeldTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id         = "testId";
        this.meldType   = "TestType";
        this.filter     = "basic";
        this.meldBucket = new MeldBucket();
        this.meldKey    = new MeldKey(this.meldType, this.id, this.filter);
        this.meld       = new Meld(this.meldKey, this.meldType);

    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertFalse(this.meldBucket.containsMeld(this.meld),
            "Assert meldBucket does not contain meld");
        this.meldBucket.addMeld(this.meld);
        test.assertTrue(this.meldBucket.containsMeld(this.meld),
            "Assert the meld has been added");
        this.meldBucket.removeMeld(this.meldKey);
        test.assertFalse(this.meldBucket.containsMeld(this.meld),
            "Assert the meld has been removed");
    }
};
bugmeta.annotate(meldBucketRemoveMeldTest).with(
    test().name("MeldBucket - #removeMeld Test")
);

// var meldBucketMeldMeldTest = {

//     //-------------------------------------------------------------------------------
//     // Setup Test
//     //-------------------------------------------------------------------------------

//     setup: function(test) {
//         this.id         = "testId";
//         this.meldType   = "TestType";
//         this.filter     = "basic";
//         this.meldBucket = new MeldBucket();
//         this.meldKey    = new MeldKey(this.meldType, this.id, this.filter);
//         this.meld       = new Meld(this.meldKey, this.meldType);

//     },


//     //-------------------------------------------------------------------------------
//     // Run Test
//     //-------------------------------------------------------------------------------

//     test: function(test) {
//         this.meldBucket.meldMeld(this.meld);
//     }
// };
// bugmeta.annotate(meldBucketMeldMeldTest).with(
//     test().name("MeldBucket - #meldMeld Test")
// );

// var meldBucketUnmeldMeldTest = {

//     //-------------------------------------------------------------------------------
//     // Setup Test
//     //-------------------------------------------------------------------------------

//     setup: function(test) {
//         this.id         = "testId";
//         this.meldType   = "TestType";
//         this.filter     = "basic";
//         this.meldBucket = new MeldBucket();
//         this.meldKey    = new MeldKey(this.meldType, this.id, this.filter);
//         this.meld       = new Meld(this.meldKey, this.meldType);

//     },


//     //-------------------------------------------------------------------------------
//     // Run Test
//     //-------------------------------------------------------------------------------

//     test: function(test) {
//         this.meldBucket.unmeldMeld(this.meld);
//         this.meldBucket.meldMeld(this.meld);
//         this.meldBucket.unmeldMeld(this.meld);
//     }
// };
// bugmeta.annotate(meldBucketUnmeldMeldTest).with(
//     test().name("MeldBucket - #unmeld Test")
// );
