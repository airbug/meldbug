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
//@Require('meldbug.MeldTransaction')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestTag          = bugpack.require('bugunit.TestTag');
var MeldTransaction         = bugpack.require('meldbug.MeldTransaction');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestTag.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldTransactionInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testMeldTransaction = new MeldTransaction();
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(this.testMeldTransaction.getMeldOperationList().isEmpty(),
            "Assert meldTransaction's operation list is empty");
    }
};
bugmeta.tag(meldTransactionInstantiationTest).with(
    test().name("MeldTransaction - Instantiation Test")
);

var meldTransactionAddMeldOperationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testMeldTransaction    = new MeldTransaction();
        this.testMeldOperation      = {};
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.testMeldTransaction.addMeldOperation(this.testMeldOperation);
        test.assertTrue(this.testMeldTransaction.getMeldOperationList().contains(this.testMeldOperation),
            "Assert meldOperationList contains the added meldOperation");
    }
};
bugmeta.tag(meldTransactionAddMeldOperationTest).with(
    test().name("MeldTransaction #addMeldOperation Test")
);
