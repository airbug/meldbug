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

//@Require('Class')
//@Require('TypeUtil')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')
//@Require('meldbug.MeldDocumentKey')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var TypeUtil                    = bugpack.require('TypeUtil');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var TestTag              = bugpack.require('bugunit.TestTag');
var BugYarn                     = bugpack.require('bugyarn.BugYarn');
var MeldDocumentKey             = bugpack.require('meldbug.MeldDocumentKey');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var bugyarn                     = BugYarn.context();
var test                        = TestTag.test;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWeaver("testMeldDocumentKey", function(yarn, args) {
    return new MeldDocumentKey(args[0], args[1]);
});

bugyarn.registerWinder("setupTestMeldDocumentKey", function(yarn) {
    yarn.wind({
        meldDocumentKey: new MeldDocumentKey("testDataType", "testId")
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldDocumentKeyInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testDataType           = "testDataType";
        this.testId                 = "testId";
        this.testMeldDocumentKey    = new MeldDocumentKey(this.testDataType, this.testId);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testMeldDocumentKey, MeldDocumentKey),
            "Assert instance of MeldDocumentKey");
        test.assertEqual(this.testMeldDocumentKey.getDataType(), this.testDataType,
            "Assert .dataType was set correctly");
        test.assertEqual(this.testMeldDocumentKey.getId(), this.testId,
            "Assert .id was set correctly");
    }
};


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(meldDocumentKeyInstantiationTest).with(
    test().name("MeldDocumentKey - instantiation test")
);
