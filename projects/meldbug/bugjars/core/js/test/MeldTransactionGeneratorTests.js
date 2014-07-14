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
//@Require('bugdelta.DeltaBuilder')
//@Require('bugdouble.BugDouble')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
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
var TestTag              = bugpack.require('bugunit.TestTag');
var BugYarn                     = bugpack.require('bugyarn.BugYarn');
var MeldTransactionGenerator    = bugpack.require('meldbug.MeldTransactionGenerator');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var bugyarn                     = BugYarn.context();
var stubObject                  = BugDouble.stubObject;
var test                        = TestTag.test;


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
bugmeta.tag(meldTransactionGeneratorInstantiationTest).with(
    test().name("MeldTransactionGenerator - instantiation test")
);
