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
//@Require('meldbug.MeldStore')
//@Require('meldbug.MeldTransaction')
//@Require('meldbug.PutMeldDocumentOperation')
//@Require('meldbug.RemoveMeldDocumentOperation')


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
var MeldDocumentKey             = bugpack.require('meldbug.MeldDocumentKey');
var MeldStore                   = bugpack.require('meldbug.MeldStore');
var MeldTransaction             = bugpack.require('meldbug.MeldTransaction');
var PutMeldDocumentOperation    = bugpack.require('meldbug.PutMeldDocumentOperation');
var RemoveMeldDocumentOperation = bugpack.require('meldbug.RemoveMeldDocumentOperation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var test                        = TestTag.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldStoreInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testMeldBucket         = new MeldBucket();
        this.testMeldStore          = new MeldStore(this.testMeldBucket);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.testMeldStore.getMeldBucket(), this.testMeldBucket,
            "Assert getMeldBucket() returns the bucket passed in during instantiation");
    }
};
bugmeta.tag(meldStoreInstantiationTest).with(
    test().name("MeldStore - Instantiation Test")
);

var meldStoreCommitMeldTransactionTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testMeldDocumentKey    = new MeldDocumentKey("array", "id");
        this.testMeldDocument       = new MeldDocument(this.testMeldDocumentKey, "type", {});
        this.testMeldBucket         = new MeldBucket();
        this.testMeldStore          = new MeldStore(this.testMeldBucket);
        this.testMeldTransaction    = new MeldTransaction();
        this.testOperation          = new PutMeldDocumentOperation(this.testMeldDocumentKey, this.testMeldDocument);
        this.testMeldTransaction.addMeldOperation(this.testOperation);
        test.completeSetup();
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        this.testMeldStore.commitMeldTransaction(this.testMeldTransaction, function(throwable) {
            if (throwable) {
                test.error(throwable);
            } else {
                test.assertTrue(_this.testMeldStore.containsMeldDocumentByMeldDocumentKey(_this.testMeldDocumentKey),
                    "Assert testMeldStore contains MeldDocumentKey");
                test.assertEqual(_this.testMeldStore.getMeldDocumentByMeldDocumentKey(_this.testMeldDocumentKey), _this.testMeldDocument,
                    "Assert the Meld returned by testMeldStore.getMeldDocumentByMeldDocumentKey() is testMeldDocument");
                test.completeTest();
            }
        });
    }
};
bugmeta.tag(meldStoreCommitMeldTransactionTest).with(
    test().name("MeldStore #commitMeldTransaction Test")
);

var meldStoreCommitMeldTransactionWitRemoveOperationEmptyBucketTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testMeldDocumentKey    = new MeldDocumentKey("array", "id");
        this.testMeldBucket         = new MeldBucket();
        this.testMeldStore          = new MeldStore(this.testMeldBucket);
        this.testMeldTransaction    = new MeldTransaction();
        this.testOperation          = new RemoveMeldDocumentOperation(this.testMeldDocumentKey);
        this.testMeldTransaction.addMeldOperation(this.testOperation);
        test.completeSetup();
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        this.testMeldStore.commitMeldTransaction(this.testMeldTransaction, function(throwable) {
            if (throwable) {
                test.error(throwable);
            } else {
                test.assertFalse(_this.testMeldStore.containsMeldDocumentByMeldDocumentKey(_this.testMeldDocumentKey),
                    "Assert testMeldStore contains MeldDocumentKey");
                test.completeTest();
            }
        });
    }
};
bugmeta.tag(meldStoreCommitMeldTransactionWitRemoveOperationEmptyBucketTest).with(
    test().name("MeldStore - #commitMeldTransaction with RemoveMeldDocumentOperation empty MeldBucket Test")
);
