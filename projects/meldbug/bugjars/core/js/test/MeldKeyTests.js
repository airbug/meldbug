/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('meldbug.MeldDocumentKey')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestTag          = bugpack.require('bugunit.TestTag');
var MeldDocumentKey         = bugpack.require('meldbug.MeldDocumentKey');


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
