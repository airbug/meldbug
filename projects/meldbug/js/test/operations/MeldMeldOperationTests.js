//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
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
        this.id             = "testId";
        this.meldType       = "TestType";
        this.filter         = "basic";
        this.testMeld       = {};
        this.meldKey        = new MeldKey(this.meldType, this.id, this.filter);
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
