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

//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('meldbug.MeldBucket')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldDocumentKey')
//@Require('meldbug.PutMeldDocumentOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var TestTag              = bugpack.require('bugunit.TestTag');
var MeldBucket                  = bugpack.require('meldbug.MeldBucket');
var MeldDocument                = bugpack.require('meldbug.MeldDocument');
var MeldDocumentKey                     = bugpack.require('meldbug.MeldDocumentKey');
var PutMeldDocumentOperation    = bugpack.require('meldbug.PutMeldDocumentOperation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var test                        = TestTag.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var putMeldDocumentOperationInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testMeldDocument           = {};
        this.meldDocumentKey            = new MeldDocumentKey("TestType", "testId");
        this.putMeldDocumentOperation   = new PutMeldDocumentOperation(this.meldDocumentKey, this.testMeldDocument);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.putMeldDocumentOperation.getMeldDocumentKey(), this.meldDocumentKey,
            "Assert putMeldDocumentOperation's MeldDocumentKey is the test meldDocumentKey");
        test.assertEqual(this.putMeldDocumentOperation.getMeldDocument(), this.testMeldDocument,
            "Assert putMeldDocumentOperation's meld is the test Meld");
        test.assertEqual(this.putMeldDocumentOperation.getType(), PutMeldDocumentOperation.TYPE,
            "Assert PutMeldDocumentOperation's type is PutMeldDocumentOperation.TYPE");
    }
};
bugmeta.tag(putMeldDocumentOperationInstantiationTest).with(
    test().name("PutMeldDocumentOperation - instantiation Test")
);

var putMeldDocumentOperationApplyTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.meldDocumentKey            = new MeldDocumentKey("TestType", "testId");
        this.meldBucket                 = new MeldBucket();
        this.testMeldDocument           = new MeldDocument(this.meldDocumentKey, {});
        this.testMeldDocumentTwo        = new MeldDocument(this.meldDocumentKey, {});
        this.testOperation              = new PutMeldDocumentOperation(this.meldDocumentKey, this.testMeldDocument);
        this.duplicateOperation         = new PutMeldDocumentOperation(this.meldDocumentKey, this.testMeldDocumentTwo);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testMeldDocument.getMeldBucket(), null,
            "Assert meld does not initially have its meldBucket property set");
        var meldDocument = this.testOperation.apply(this.meldBucket);
        test.assertEqual(meldDocument.getMeldBucket(), this.meldBucket,
            "Assert the meld has the meldBucket set on them after apply");

        test.assertEqual(this.testMeldDocumentTwo.getMeldBucket(), null,
            "Assert meld does not initially have its meldBucket property set");
        var meldDocumentTwo = this.duplicateOperation.apply(this.meldBucket);
        test.assertEqual(meldDocumentTwo.getMeldBucket(), null,
            "Assert duplicate PutMeldDocumentOperations do NOT have the meldBucket set on them after apply");

        test.assertTrue(this.meldBucket.containsMeldDocument(this.testMeldDocument),
            "Assert the meldBucket contains the meld by meldDocumentKey");
        test.assertEqual(this.meldBucket.getMeldDocumentByMeldDocumentKey(this.meldDocumentKey), this.testMeldDocument,
            "Assert the meldBucket contains the original MeldDocument");
        test.assertNotEqual(this.meldBucket.getMeldDocumentByMeldDocumentKey(this.meldDocumentKey), this.testMeldDocumentTwo,
            "Assert the meldBucket does not contain the duplicate MeldDocument");
    }
};
bugmeta.tag(putMeldDocumentOperationApplyTest).with(
    test().name("PutMeldDocumentOperation - #apply Test")
);
