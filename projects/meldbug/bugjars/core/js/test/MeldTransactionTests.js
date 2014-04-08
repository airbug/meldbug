//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('meldbug.MeldTransaction')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var MeldTransaction         = bugpack.require('meldbug.MeldTransaction');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldTransactionInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testMeldTransaction = new MeldTransaction();
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(this.testMeldTransaction.getMeldOperationList().isEmpty(),
            "Assert meldTransaction's operation list is empty");
    }
};
bugmeta.annotate(meldTransactionInstantiationTest).with(
    test().name("MeldTransaction - Instantiation Test")
);

var meldTransactionAddMeldOperationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testMeldTransaction    = new MeldTransaction();
        this.testMeldOperation      = {};
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testMeldTransaction.addMeldOperation(this.testMeldOperation);
        test.assertTrue(this.testMeldTransaction.getMeldOperationList().contains(this.testMeldOperation),
            "Assert meldOperationList contains the added meldOperation");
    }
};
bugmeta.annotate(meldTransactionAddMeldOperationTest).with(
    test().name("MeldTransaction #addMeldOperation Test")
);
