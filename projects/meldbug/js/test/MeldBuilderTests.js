//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('meldbug.MeldBuilder')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var MeldBuilder         = bugpack.require('meldbug.MeldBuilder');
var BugMeta             = bugpack.require('bugmeta.BugMeta');
var TestAnnotation      = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta             = BugMeta.context();
var test                = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldBuilderGenerateMeldKeyTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testDataType = "testDataType";
        this.testId = "testId";
        this.testFilterType = "testFilterType";
        this.testMeldBuilder = new MeldBuilder();
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var meldKey = this.testMeldBuilder.generateMeldKey(this.testDataType, this.testId, this.testFilterType);
        test.assertEqual(meldKey.getDataType(), this.testDataType,
            "Assert meldKey's dataType is testDataType");
        test.assertEqual(meldKey.getFilterType(), this.testFilterType,
            "Assert meldKey's filterType is testFilterType");
        test.assertEqual(meldKey.getId(), this.testId,
            "Assert meldKey's id is testId");
    }
};
bugmeta.annotate(meldBuilderGenerateMeldKeyTest).with(
    test().name("MeldBuilder #generateMeldKey Test")
);
