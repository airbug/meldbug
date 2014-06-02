//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('meldbug.MeldDocumentKey')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var MeldDocumentKey         = bugpack.require('meldbug.MeldDocumentKey');
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

var meldDocumentKeyTest = {

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        var meldDocumentKey = new MeldDocumentKey("array", "id");
        
        test.assertEqual(meldDocumentKey.getDataType(), "array",
            "Assert that the data type is what we expect");

        test.assertEqual(meldDocumentKey.getId(), "id",
            "Assert that the id is what we expect");

        var meldDocumentKey1 = new MeldDocumentKey("array", "id");
        test.assertTrue(meldDocumentKey.equals(meldDocumentKey1),
            "Verify equality test returns true for objects with same constructor signature");

        var meldDocumentKey2 = new MeldDocumentKey("array", "id2");
        test.assertFalse(meldDocumentKey.equals(meldDocumentKey2),
            "Verify equality test returns false for objects with different constructor signature");

        var meldDocumentKeyObject = meldDocumentKey.toObject();
        test.assertEqual(meldDocumentKeyObject.id, "id",
            "Verify that meld key object's id property is the same as what is contained in the MeldDocumentKey object");
        test.assertEqual(meldDocumentKeyObject.dataType, "array",
            "Verify that meld key object's dataType property is the same as what is contained in the MeldDocumentKey object");
    }
};
bugmeta.tag(meldDocumentKeyTest).with(
    test().name("MeldDocumentKey Tests")
);
