//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('meldbug.MeldBucket')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldKey')
//@Require('meldbug.MeldMeldOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var MeldBucket              = bugpack.require('meldbug.MeldBucket');
var MeldDocument            = bugpack.require('meldbug.MeldDocument');
var MeldKey                 = bugpack.require('meldbug.MeldKey');
var MeldMeldOperation       = bugpack.require('meldbug.MeldMeldOperation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldMeldOperationInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testMeld           = {};
        this.meldKey            = new MeldKey("TestType", "testId");
        this.meldMeldOperation  = new MeldMeldOperation(this.meldKey, this.testMeld);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.meldMeldOperation.getMeldKey(), this.meldKey,
            "Assert meldMeldOperation's MeldKey is the test meldKey");
        test.assertEqual(this.meldMeldOperation.getMeld(), this.testMeld,
            "Assert meldMeldOperation's meld is the test Meld");
        test.assertEqual(this.meldMeldOperation.getType(), MeldMeldOperation.TYPE,
            "Assert MeldMeldOperation's type is MeldMeldOperation.TYPE");
    }
};
bugmeta.annotate(meldMeldOperationInstantiationTest).with(
    test().name("MeldMeldOperation - instantiation Test")
);

var meldMeldOperationApplyTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.meldKey            = new MeldKey("TestType", "testId");
        this.meldBucket         = new MeldBucket();
        this.testMeld           = new MeldDocument(this.meldKey, {});
        this.testMeldTwo        = new MeldDocument(this.meldKey, {});
        this.meldMeldOperation  = new MeldMeldOperation(this.meldKey, this.testMeld);
        this.duplicateOperation = new MeldMeldOperation(this.meldKey, this.testMeldTwo);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertFalse(this.testMeld.getMeldBucket(),
            "Assert meld does not initially have its meldBucket property set");
        var meld = this.meldMeldOperation.apply(this.meldBucket);
        test.assertTrue(meld.getMeldBucket(),
            "Assert the meld has the meldBucket set on them after apply");

        test.assertFalse(this.testMeldTwo.getMeldBucket(),
            "Assert meld does not initially have its meldBucket property set");
        var meldTwo = this.duplicateOperation.apply(this.meldBucket);
        test.assertFalse(meldTwo.getMeldBucket(),
            "Assert duplicate MeldMeldOperations do NOT have the meldBucket set on them after apply");

        test.assertTrue(this.meldBucket.containsMeld(this.testMeld),
            "Assert the meldBucket contains the meld by meldKey");
        test.assertEqual(this.meldBucket.getMeld(this.meldKey), this.testMeld,
            "Assert the meldBucket contains the original MeldDocument");
        test.assertNotEqual(this.meldBucket.getMeld(this.meldKey), this.testMeldTwo,
            "Assert the meldBucket does not contain the duplicate MeldDocument");
    }
};
bugmeta.annotate(meldMeldOperationApplyTest).with(
    test().name("MeldMeldOperation - #apply Test")
);
