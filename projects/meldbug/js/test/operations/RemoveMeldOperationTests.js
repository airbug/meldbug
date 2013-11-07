//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('meldbug.MeldKey')
//@Require('meldbug.RemoveMeldOperation')


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
var RemoveMeldOperation     = bugpack.require('meldbug.RemoveMeldOperation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var removeMeldOperationInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id             = "testId";
        this.type           = "TestType";
        this.filter         = "basic";
        this.meldKey        = new MeldKey(this.type, this.id, this.filter);
        this.removeMeldOperation  = new RemoveMeldOperation(this.meldKey);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.removeMeldOperation.getMeldKey(), this.meldKey,
            "Assert removeMeldOperation's MeldKey is the test meldKey");
        test.assertEqual(this.removeMeldOperation.getType(), RemoveMeldOperation.TYPE,
            "Assert removeMeldOperation's type is RemoveMeldOperation.TYPE");
    }
};
bugmeta.annotate(removeMeldOperationInstantiationTest).with(
    test().name("RemoveMeldOperation - instantiation Test")
);
