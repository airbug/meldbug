//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('meldbug.Meld')
//@Require('meldbug.MeldBucket')
//@Require('meldbug.MeldKey')
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

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        var meldKey                 = new MeldKey("array", "basic", "id");
        this.meld                   = new Meld(meldKey, "type");
        this.testMeldBucket         = new MeldBucket();
        this.testMeldStore          = new MeldStore(this.testMeldBucket);
        this.testMeldTransaction    = new MeldTransaction();

    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        // test getMeldBucket
        // test commitMeldTransaction
        // test containsMeldByKey
        // test getMeld
        // test getEachMeld
    }
};
bugmeta.annotate(meldStoreCommitMeldTransactionTest).with(
    test().name("MeldStore #commitMeldTransaction Test")
);
