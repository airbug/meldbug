//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('meldbug.PutMeldDocumentOperation')
//@Require('meldbug.MeldBucket')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldEvent')
//@Require('meldbug.MeldDocumentKey')
//@Require('meldbug.MeldOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var TestAnnotation              = bugpack.require('bugunit-annotate.TestAnnotation');
var PutMeldDocumentOperation    = bugpack.require('meldbug.PutMeldDocumentOperation');
var MeldBucket                  = bugpack.require('meldbug.MeldBucket');
var MeldDocument                = bugpack.require('meldbug.MeldDocument');
var MeldEvent                   = bugpack.require('meldbug.MeldEvent');
var MeldDocumentKey                     = bugpack.require('meldbug.MeldDocumentKey');
var RemoveMeldDocumentOperation = bugpack.require('meldbug.RemoveMeldDocumentOperation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var test                        = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldBucketContainsMeldDocumentTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testData       = {};
        this.meldBucket     = new MeldBucket();
        this.meldDocumentKey        = new MeldDocumentKey("TestType", "testId");
        this.meldDocument   = new MeldDocument(this.meldDocumentKey, this.testData);
        this.meldBucket.addMeldDocument(this.meldDocument);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(this.meldBucket.containsMeldDocument(this.meldDocument),
            "Assert #containsMeldDocument returns true for a meldDocument that has been added to the meldBucket");
        test.assertEqual(this.meldBucket.getMeldDocumentByMeldDocumentKey(this.meldDocumentKey), this.meldDocument,
            "Assert the correct meldDocument is in the meldBucket");
    }
};
bugmeta.annotate(meldBucketContainsMeldDocumentTest).with(
    test().name("MeldBucket - #containsMeldDocument Test")
);

var meldBucketContainsMeldDocumentByKeyTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.meldBucket             = new MeldBucket();
        this.meldDocumentKey        = new MeldDocumentKey("TestType", "testId");
        this.meldDocumentKeyTwo     = new MeldDocumentKey("OtherType", "otherId");
        this.meldDocument           = new MeldDocument(this.meldDocumentKey, this.meldType);
        this.meldBucket.addMeldDocument(this.meldDocument);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(this.meldBucket.containsMeldDocumentByMeldDocumentKey(this.meldDocumentKey),
            "Assert #containsMeldDocumentByKey returns true for a meld that has been added to the meldBucket");
        test.assertTrue(this.meldBucket.containsMeldDocumentByMeldDocumentKey(this.meldDocumentKey.clone()),
            "Assert #containsMeld returns true for a meld that has been added to the meldBucket when retrieved using a clone of the meldDocumentKey");
        test.assertFalse(this.meldBucket.containsMeldDocumentByMeldDocumentKey(this.meldDocumentKeyTwo),
            "Assert #containsMeld returns false for a meld that has not been added to the meldBucket");
        test.assertEqual(this.meldBucket.getMeldDocumentByMeldDocumentKey(this.meldDocumentKey), this.meldDocument,
            "Assert the correct meldDocument is in the meldBucket");
        test.assertEqual(this.meldBucket.getMeldDocumentByMeldDocumentKey(this.meldDocumentKey.clone()), this.meldDocument,
            "Assert the correct meldDocument is retrieved using a meldDocumentKey clone");
    }
};
bugmeta.annotate(meldBucketContainsMeldDocumentByKeyTest).with(
    test().name("MeldBucket - #containsMeldDocumentByKey Test")
);

var meldBucketAddMeldDocumentTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.meldBucket     = new MeldBucket();
        this.meldDocumentKey        = new MeldDocumentKey("TestType", "testId");
        this.meldDocument   = new MeldDocument(this.meldDocumentKey);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertFalse(this.meldBucket.containsMeldDocument(this.meldDocument),
            "Assert meldBucket does not contain meldDocument");
        this.meldBucket.addMeldDocument(this.meldDocument);
        test.assertTrue(this.meldBucket.containsMeldDocument(this.meldDocument),
            "Assert the meldDocument has been added");
    }
};
bugmeta.annotate(meldBucketAddMeldDocumentTest).with(
    test().name("MeldBucket - #addMeldDocument Test")
);

var meldBucketGetMeldDocumentByMeldDocumentKeyTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testData           = {};
        this.meldBucket         = new MeldBucket();
        this.meldDocumentKey    = new MeldDocumentKey("TestType", "testId");
        this.meldDocument       = new MeldDocument(this.meldDocumentKey, this.testData);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.meldBucket.addMeldDocument(this.meldDocument);
        test.assertEqual(this.meldBucket.getMeldDocumentByMeldDocumentKey(this.meldDocumentKey), this.meldDocument,
            "Assert getMeldDocumentByMeldDocumentKey returns the correct meldDocument");
    }
};
bugmeta.annotate(meldBucketGetMeldDocumentByMeldDocumentKeyTest).with(
    test().name("MeldBucket - #getMeldDocumentByMeldDocumentKey Test")
);

var meldBucketRemoveMeldTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.meldBucket = new MeldBucket();
        this.meldDocumentKey    = new MeldDocumentKey("TestType", "testId");
        this.meldDocument       = new MeldDocument(this.meldDocumentKey, this.meldType);

    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertFalse(this.meldBucket.containsMeldDocument(this.meldDocument),
            "Assert meldBucket does not contain meldDocument");
        this.meldBucket.addMeldDocument(this.meldDocument);
        test.assertTrue(this.meldBucket.containsMeldDocument(this.meldDocument),
            "Assert the meld has been added");
        this.meldBucket.removeMeldDocumentByMeldDocumentKey(this.meldDocumentKey);
        test.assertFalse(this.meldBucket.containsMeldDocument(this.meldDocument),
            "Assert the meld has been removed");
    }
};
bugmeta.annotate(meldBucketRemoveMeldTest).with(
    test().name("MeldBucket - #removeMeld Test")
);
