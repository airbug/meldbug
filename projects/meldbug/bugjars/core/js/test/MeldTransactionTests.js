//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('meldbug.MeldTransaction')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var MeldTransaction         = bugpack.require('meldbug.MeldTransaction');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestTag          = bugpack.require('bugunit.TestTag');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestTag.test;


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
bugmeta.tag(meldTransactionInstantiationTest).with(
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
bugmeta.tag(meldTransactionAddMeldOperationTest).with(
    test().name("MeldTransaction #addMeldOperation Test")
);
