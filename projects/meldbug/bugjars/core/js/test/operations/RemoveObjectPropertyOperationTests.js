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
//@Require('Set')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('meldbug.MeldBucket')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldDocumentKey')
//@Require('meldbug.RemoveObjectPropertyOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Set                             = bugpack.require('Set');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var TestTag                  = bugpack.require('bugunit.TestTag');
var MeldBucket                      = bugpack.require('meldbug.MeldBucket');
var MeldDocument                    = bugpack.require('meldbug.MeldDocument');
var MeldDocumentKey                 = bugpack.require('meldbug.MeldDocumentKey');
var RemoveObjectPropertyOperation   = bugpack.require('meldbug.RemoveObjectPropertyOperation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestTag.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var removeObjectPropertyOperationInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.meldDocumentKey                    = new MeldDocumentKey("TestType", "testId");
        this.testPath                           = "testPath";
        this.testPropertyName                   = "testPropertyName";
        this.testPropertyValue                  = "testPropertyValue";
        this.removeObjectPropertyOperation      = new RemoveObjectPropertyOperation(this.meldDocumentKey, this.testPath, this.testPropertyName, this.testPropertyValue);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.removeObjectPropertyOperation.meldDocumentKey, this.meldDocumentKey,
            "Assert removeObjectPropertyOperation's meldDocumentKey property is set to the meldDocumentKey given at construction");
        test.assertEqual(this.removeObjectPropertyOperation.path, this.testPath,
            "Assert removeObjectPropertyOperation's path property is set to the path given at construction");
        test.assertEqual(this.removeObjectPropertyOperation.type, RemoveObjectPropertyOperation.TYPE,
            "Assert removeObjectPropertyOperation's type is set to the value of RemoveObjectPropertyOperation.TYPE");
        test.assertEqual(this.removeObjectPropertyOperation.propertyName, this.testPropertyName,
            "Assert removeObjectPropertyOperation's propertyName property is set to the propertyName given at construction");
    }
};
bugmeta.tag(removeObjectPropertyOperationInstantiationTest).with(
    test().name("RemoveObjectPropertyOperation - instantiation Test")
);

var removeObjectPropertyOperationGetPathTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id                     = "testId";
        this.meldType               = "testType";
        this.meldDocumentKey                = new MeldDocumentKey(this.meldType, this.id);
        this.testPath               = "testPath";
        this.testPathTwo            = "testPathTwo";
        this.testPropertyName       = "testPropertyName";
        this.testPropertyNameTwo    = "testPropertyNameTwo";
        this.removeObjectPropertyOperation      = new RemoveObjectPropertyOperation(this.meldDocumentKey, this.testPath, this.testPropertyName);
        this.removeObjectPropertyOperationTwo   = new RemoveObjectPropertyOperation(this.meldDocumentKey, this.testPathTwo, this.testPropertyNameTwo);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.removeObjectPropertyOperation.getPath(), this.testPath,
            "Assert RemoveObjectPropertyOperation#getPath returns 'testPath'");
        test.assertEqual(this.removeObjectPropertyOperationTwo.getPath(), this.testPathTwo,
            "Assert RemoveFromSetOperation#getPath does not default to'testPath'");
    }
};
bugmeta.tag(removeObjectPropertyOperationGetPathTest).with(
    test().name("RemoveObjectPropertyOperation - #getPath Test")
);

var removeObjectPropertyOperationGetPropertyNameTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id                     = "testId";
        this.meldType               = "testType";
        this.meldDocumentKey                = new MeldDocumentKey(this.meldType, this.id);
        this.testPath               = "testPath";
        this.testPathTwo            = "testPathTwo";
        this.testPropertyName       = "testPropertyName";
        this.testPropertyNameTwo    = "testPropertyNameTwo";
        this.removeObjectPropertyOperation      = new RemoveObjectPropertyOperation(this.meldDocumentKey, this.testPath, this.testPropertyName);
        this.removeObjectPropertyOperationTwo   = new RemoveObjectPropertyOperation(this.meldDocumentKey, this.testPathTwo, this.testPropertyNameTwo);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.removeObjectPropertyOperation.getPropertyName(), this.testPropertyName,
            "Assert RemoveFromSetOperation#getPropertyName returns 'testPropertyName'");
        test.assertEqual(this.removeObjectPropertyOperationTwo.getPropertyName(), this.testPropertyNameTwo,
            "Assert RemoveFromSetOperation#getPropertyName does not default to'testPropertyName'");
    }
};
bugmeta.tag(removeObjectPropertyOperationGetPropertyNameTest).with(
    test().name("RemoveObjectPropertyOperation - #getPropertyName Test")
);

var removeObjectPropertyOperationApplyTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id                     = "testId";
        this.meldType               = "testType";
        this.testPath               = "testPath";
        this.testPropertyName       = "testPropertyName";
        this.complexTestPath        = "testPath.complexPath";
        this.testPropertyNameTwo    = "testPropertyNameTwo";
        this.testPropertyValue      = 123456789;
        this.testPropertyValueTwo   = 987654321;
        this.meldDocumentKey                = new MeldDocumentKey(this.meldType, this.id);
        this.meldBucket             = new MeldBucket();
        this.testData               = {
            "testPath": {
                "testPropertyName": this.testPropertyValue,
                "complexPath": {
                    "testPropertyNameTwo": 987654321
                }
            }
        };
        this.meldDocument                           = new MeldDocument(this.meldDocumentKey, this.testData);
        this.meldBucket.addMeldDocument(this.meldDocument);
        this.removeObjectPropertyOperation          = new RemoveObjectPropertyOperation(this.meldDocumentKey, this.testPath, this.testPropertyName);
        this.removeObjectPropertyOperationComplex   = new RemoveObjectPropertyOperation(this.meldDocumentKey, this.complexTestPath, this.testPropertyNameTwo);

    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.meldDocument.deltaDocument.getPath(this.complexTestPath), this.testData["testPath"]["complexPath"],
            "Assert meldDocument.deltaDocument.getPath('testPath.complexPath') is correct");
        test.assertEqual(this.meldDocument.deltaDocument.getPath(this.testPath)[this.testPropertyName], this.testPropertyValue,
            "Assert testPropertyName property exists and is equal to 123456789");
        test.assertEqual(this.meldDocument.deltaDocument.getPath(this.complexTestPath), this.testData.testPath.complexPath,
            "Assert complexTestPath value is correct");
        test.assertEqual(this.meldDocument.deltaDocument.getPath(this.complexTestPath)[this.testPropertyNameTwo], this.testPropertyValueTwo,
            "Assert testPropertyNameTwo property exists and is equal to 987654321");

        this.editedMeld     = this.removeObjectPropertyOperation.apply(this.meldBucket);
        test.assertTrue(Class.doesExtend(this.editedMeld, MeldDocument),
            "Assert removeFromSetOperation#apply returns a MeldDocument object");
        test.assertFalse(this.editedMeld.deltaDocument.getPath(this.testPath)[this.testPropertyName],
            "Assert testPropertyName property was removed");

        this.editedMeldTwo  = this.removeObjectPropertyOperationComplex.apply(this.meldBucket);
        test.assertTrue(Class.doesExtend(this.editedMeldTwo, MeldDocument),
            "Assert removeFromSetOperation#apply returns a MeldDocument object");
        test.assertFalse(this.editedMeldTwo.deltaDocument.getPath(this.complexTestPath)[this.testPropertyNameTwo],
            "Assert testPropertyNameTwo property was removed");
    }
};
bugmeta.tag(removeObjectPropertyOperationApplyTest).with(
    test().name("RemoveObjectPropertyOperation - #apply Test")
);

var removeObjectPropertyOperationCloneTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id                 = "testId";
        this.meldType           = "testType";
        this.testPath           = "testPath";
        this.testPropertyName   = "testPropertyName";
        this.testPropertyValue  = 123456789;
        this.meldDocumentKey            = new MeldDocumentKey(this.meldType, this.id);
        this.removeObjectPropertyOperation = new RemoveObjectPropertyOperation(this.meldDocumentKey, this.testPath, this.testPropertyName);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.clone = this.removeObjectPropertyOperation.clone();
        test.assertTrue(Class.doesExtend(this.clone, RemoveObjectPropertyOperation),
            "Assert the clone is an instance of RemoveObjectPropertyOperation");
        test.assertEqual(this.clone.getUuid(), this.removeObjectPropertyOperation.getUuid(),
            "Assert the clone's uuid is the same as the original's uuid");
        test.assertEqual(this.clone.getType(), this.removeObjectPropertyOperation.getType(),
            "Assert the clone's type is the same as the original's type");
        test.assertEqual(this.clone.getMeldDocumentKey(), this.removeObjectPropertyOperation.getMeldDocumentKey(),
            "Assert the clone's meldDocumentKey is equal to the original's meldDocumentKey");
        test.assertEqual(this.clone.getPath(), this.removeObjectPropertyOperation.getPath(),
            "Assert the clone's path is equal to the original's path");
        test.assertEqual(this.clone.getPropertyName(), this.removeObjectPropertyOperation.getPropertyName(),
            "Assert the clone's propertyName is equal to the original's propertyName");
        test.assertNotEqual(this.clone, this.removeObjectPropertyOperation,
            "Assert the clone is not the same object as the original");
    }
};
bugmeta.tag(removeObjectPropertyOperationCloneTest).with(
    test().name("RemoveObjectPropertyOperation - #clone Test")
);
