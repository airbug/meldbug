//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('meldbug.PutMeldDocumentOperation')
//@Require('meldbug.RemoveMeldDocumentOperation')
//@Require('meldbug.MeldBucket')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldDocumentKey')
//@Require('meldbug.MeldStore')
//@Require('meldbug.MeldTransaction')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var PutMeldDocumentOperation    = bugpack.require('meldbug.PutMeldDocumentOperation');
var RemoveMeldDocumentOperation = bugpack.require('meldbug.RemoveMeldDocumentOperation');
var MeldBucket                  = bugpack.require('meldbug.MeldBucket');
var MeldDocument                = bugpack.require('meldbug.MeldDocument');
var MeldDocumentKey             = bugpack.require('meldbug.MeldDocumentKey');
var MeldStore                   = bugpack.require('meldbug.MeldStore');
var MeldTransaction             = bugpack.require('meldbug.MeldTransaction');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var TestAnnotation              = bugpack.require('bugunit.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var test                        = TestAnnotation.test;


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
bugmeta.annotate(meldStoreInstantiationTest).with(
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
bugmeta.annotate(meldStoreCommitMeldTransactionTest).with(
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
bugmeta.annotate(meldStoreCommitMeldTransactionWitRemoveOperationEmptyBucketTest).with(
    test().name("MeldStore - #commitMeldTransaction with RemoveMeldDocumentOperation empty MeldBucket Test")
);
