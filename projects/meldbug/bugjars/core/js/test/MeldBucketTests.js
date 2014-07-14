/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')
//@Require('meldbug.MeldBucket')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldDocumentKey')
//@Require('meldbug.MeldEvent')
//@Require('meldbug.MeldOperation')
//@Require('meldbug.PutMeldDocumentOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var TestTag              = bugpack.require('bugunit.TestTag');
var BugYarn                     = bugpack.require('bugyarn.BugYarn');
var MeldBucket                  = bugpack.require('meldbug.MeldBucket');
var MeldDocument                = bugpack.require('meldbug.MeldDocument');
var MeldDocumentKey             = bugpack.require('meldbug.MeldDocumentKey');
var MeldEvent                   = bugpack.require('meldbug.MeldEvent');
var PutMeldDocumentOperation    = bugpack.require('meldbug.PutMeldDocumentOperation');
var RemoveMeldDocumentOperation = bugpack.require('meldbug.RemoveMeldDocumentOperation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var bugyarn                     = BugYarn.context();
var test                        = TestTag.test;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWeaver("testMeldBucket", function(yarn) {
    return new MeldBucket();
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------


var meldBucketInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.meldBucket     = new MeldBucket();
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.meldBucket, MeldBucket),
            "Assert instance of MeldBucket");
    }
};
bugmeta.tag(meldBucketInstantiationTest).with(
    test().name("MeldBucket - instantiation Test")
);

var meldBucketCloneDeepTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testData           = {};
        this.meldBucket         = new MeldBucket();
        this.meldDocumentKey    = new MeldDocumentKey("TestType", "testId");
        this.meldDocument       = new MeldDocument(this.meldDocumentKey, this.testData);
        this.meldBucket.addMeldDocument(this.meldDocument);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        /** @type {MeldBucket} */
        var cloneMeldBucket = this.meldBucket.clone(true);
        test.assertTrue(cloneMeldBucket !== this.meldBucket,
            "Assert clone is a new instance");
        var cloneMeldDocument = cloneMeldBucket.getMeldDocumentByMeldDocumentKey(this.meldDocumentKey);
        test.assertTrue(cloneMeldDocument !== this.meldDocument,
            "Assert deep clone has been performed");
    }
};
bugmeta.tag(meldBucketCloneDeepTest).with(
    test().name("MeldBucket - #clone deep Test")
);

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
bugmeta.tag(meldBucketContainsMeldDocumentTest).with(
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
bugmeta.tag(meldBucketContainsMeldDocumentByKeyTest).with(
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
bugmeta.tag(meldBucketAddMeldDocumentTest).with(
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
bugmeta.tag(meldBucketGetMeldDocumentByMeldDocumentKeyTest).with(
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
bugmeta.tag(meldBucketRemoveMeldTest).with(
    test().name("MeldBucket - #removeMeld Test")
);
