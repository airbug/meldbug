//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('meldbug.MeldKey')
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

var MeldKey                 = bugpack.require('meldbug.MeldKey');
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

var meldKeyTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        var meldKey = new MeldKey("array", "id");
        
        test.assertEqual(meldKey.getDataType(), "array",
            "Assert that the data type is what we expect");

        test.assertEqual(meldKey.getId(), "id",
            "Assert that the id is what we expect");

        var meldKey1 = new MeldKey("array", "id");
        test.assertTrue(meldKey.equals(meldKey1),
            "Verify equality test returns true for objects with same constructor signature");

        var meldKey2 = new MeldKey("array", "id2");
        test.assertFalse(meldKey.equals(meldKey2),
            "Verify equality test returns false for objects with different constructor signature");

        var meldKeyObject = meldKey.toObject();
        test.assertEqual(meldKeyObject.id, "id",
            "Verify that meld key object's id property is the same as what is contained in the MeldKey object");
        test.assertEqual(meldKeyObject.dataType, "array",
            "Verify that meld key object's dataType property is the same as what is contained in the MeldKey object");

        test.complete();
    }
};
bugmeta.annotate(meldKeyTest).with(
    test().name("MeldKey Tests")
);
