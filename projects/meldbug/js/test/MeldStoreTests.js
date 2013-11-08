//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('meldbug.Meld')
//@Require('meldbug.MeldBucket')
//@Require('meldbug.MeldKey')
//@Require('meldbug.MeldMeldOperation')
//@Require('meldbug.MeldStore')
//@Require('meldbug.MeldTransaction')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();
var mongoose                = require('mongoose');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Meld                    = bugpack.require('meldbug.Meld');
var MeldBucket              = bugpack.require('meldbug.MeldBucket');
var MeldKey                 = bugpack.require('meldbug.MeldKey');
var MeldMeldOperation       = bugpack.require('meldbug.MeldMeldOperation');
var MeldStore               = bugpack.require('meldbug.MeldStore');
var MeldTransaction         = bugpack.require('meldbug.MeldTransaction');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


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
        test.assertEqual(this.testMeldBucket.getParentPropagator(), this.testMeldStore,
            "Assert testMeldBucket's parentPropagator has been set to the testMeldStore");
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
        var _this = this;
        this.testMeldKey            = new MeldKey("array", "basic", "id");
        this.testMeld               = new Meld(this.testMeldKey, "type");
        this.testMeldBucket         = new MeldBucket();
        this.testMeldStore          = new MeldStore(this.testMeldBucket);
        this.testMeldTransaction    = new MeldTransaction();
        this.testMeldMeldOperation  = new MeldMeldOperation(this.testMeldKey, this.testMeld);
        this.testMeldTransaction.addMeldOperation(this.testMeldMeldOperation);
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
                test.assertTrue(_this.testMeldStore.containsMeldByKey(_this.testMeldKey),
                    "Assert testMeldStore contains MeldKey");
                test.assertEqual(_this.testMeldStore.getMeld(_this.testMeldKey), _this.testMeld,
                    "Assert the Meld returned by testMeldStore.getMeld() is testMeld");
            }
            test.complete();
        });
    }
};
bugmeta.annotate(meldStoreCommitMeldTransactionTest).with(
    test().name("MeldStore #commitMeldTransaction Test")
);
