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
//@Require('meldbug.MeldEvent')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestTag          = bugpack.require('bugunit.TestTag');
var MeldDocumentKey                 = bugpack.require('meldbug.MeldDocumentKey');
var MeldEvent               = bugpack.require('meldbug.MeldEvent');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestTag.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldEventGetMeldDocumentKeyTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id         = "testId";
        this.meldType   = "TestType";
        this.meldDocumentKey    = new MeldDocumentKey(this.meldType, this.id);
        this.data       = {testData: "testValue"};
        this.meldEvent  = new MeldEvent(this.eventType, this.meldDocumentKey, this.data);

    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.meldEvent.getMeldDocumentKey(), this.meldDocumentKey,
            "Assert meldEvent#getMeldDocumentKey returns the correct meldDocumentKey");
    }
};
bugmeta.tag(meldEventGetMeldDocumentKeyTest).with(
    test().name("MeldEvent - #getMeldDocumentKey Test")
);
