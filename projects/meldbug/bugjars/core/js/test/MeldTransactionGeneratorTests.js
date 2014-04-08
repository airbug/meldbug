//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugdelta.DeltaBuilder')
//@Require('bugdouble.BugDouble')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')
//@Require('bugyarn.BugYarn')
//@Require('meldbug.MeldTransactionGenerator')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var DeltaBuilder                = bugpack.require('bugdelta.DeltaBuilder');
var BugDouble                   = bugpack.require('bugdouble.BugDouble');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var TestAnnotation              = bugpack.require('bugunit.TestAnnotation');
var BugYarn                     = bugpack.require('bugyarn.BugYarn');
var MeldTransactionGenerator    = bugpack.require('meldbug.MeldTransactionGenerator');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var bugyarn                     = BugYarn.context();
var stubObject                  = BugDouble.stubObject;
var test                        = TestAnnotation.test;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWinder("setupTestMeldTransactionGenerator", function(yarn) {
    yarn.wind({
        meldTransactionGenerator: new MeldTransactionGenerator()
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldTransactionGeneratorInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testMeldTransactionGenerator   = new MeldTransactionGenerator();
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testMeldTransactionGenerator, MeldTransactionGenerator),
            "Assert instance of MeldTransactionGenerator");
        test.assertTrue(Class.doesExtend(this.testMeldTransactionGenerator.getDeltaBuilder(), DeltaBuilder),
            "Assert .deltaBuilder is instance of DeltaBuilder");
    }
};
bugmeta.annotate(meldTransactionGeneratorInstantiationTest).with(
    test().name("MeldTransactionGenerator - instantiation test")
);
