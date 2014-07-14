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
//@Require('meldbug.SetObjectPropertyOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


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
var SetObjectPropertyOperation      = bugpack.require('meldbug.SetObjectPropertyOperation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                         = BugMeta.context();
var test                            = TestTag.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var setObjectPropertyOperationInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.meldDocumentKey                = new MeldDocumentKey("TestType", "testId");
        this.testPath               = "testPath";
        this.testPropertyName       = "testPropertyName";
        this.testPropertyValue      = "testPropertyValue";
        this.setObjectPropertyOperation      = new SetObjectPropertyOperation(this.meldDocumentKey, this.testPath, this.testPropertyName, this.testPropertyValue);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.setObjectPropertyOperation.meldDocumentKey, this.meldDocumentKey,
            "Assert setObjectPropertyOperation's meldDocumentKey property is set to the meldDocumentKey given at construction");
        test.assertEqual(this.setObjectPropertyOperation.path, this.testPath,
            "Assert setObjectPropertyOperation's path property is set to the path given at construction");
        test.assertEqual(this.setObjectPropertyOperation.type, SetObjectPropertyOperation.TYPE,
            "Assert setObjectPropertyOperation's type is set to the value of SetObjectPropertyOperation.TYPE");
        test.assertEqual(this.setObjectPropertyOperation.propertyName, this.testPropertyName,
            "Assert setObjectPropertyOperation's propertyName property is set to the propertyName given at construction");
        test.assertEqual(this.setObjectPropertyOperation.propertyValue, this.testPropertyValue,
            "Assert setObjectPropertyOperation's propertyValue property is set to the propertyValue given at construction");
    }
};
bugmeta.tag(setObjectPropertyOperationInstantiationTest).with(
    test().name("SetObjectPropertyOperation - instantiation Test")
);

var setObjectPropertyOperationGetPathTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.meldDocumentKey                = new MeldDocumentKey("TestType", "testId");
        this.testPath               = "testPath";
        this.testPathTwo            = "testPathTwo";
        this.testPropertyName       = "testPropertyName";
        this.testPropertyNameTwo    = "testPropertyNameTwo";
        this.setObjectPropertyOperation      = new SetObjectPropertyOperation(this.meldDocumentKey, this.testPath, this.testPropertyName, "valueOne");
        this.setObjectPropertyOperationTwo   = new SetObjectPropertyOperation(this.meldDocumentKey, this.testPathTwo, this.testPropertyNameTwo, "valueTwo");
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.setObjectPropertyOperation.getPath(), this.testPath,
            "Assert setObjectPropertyOperation#getPath returns the correct path");
        test.assertEqual(this.setObjectPropertyOperationTwo.getPath(), this.testPathTwo,
            "Assert SetObjectPropertyOperation#getPath does not default to'testPath'");
    }
};
bugmeta.tag(setObjectPropertyOperationGetPathTest).with(
    test().name("SetObjectPropertyOperation - #getPath Test")
);

var setObjectPropertyOperationGetPropertyNameTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.meldDocumentKey                = new MeldDocumentKey("TestType", "testId");
        this.testPath               = "testPath";
        this.testPathTwo            = "testPathTwo";
        this.testPropertyName       = "testPropertyName";
        this.testPropertyNameTwo    = "testPropertyNameTwo";
        this.setObjectPropertyOperation      = new SetObjectPropertyOperation(this.meldDocumentKey, this.testPath, this.testPropertyName, "valueOne");
        this.setObjectPropertyOperationTwo   = new SetObjectPropertyOperation(this.meldDocumentKey, this.testPathTwo, this.testPropertyNameTwo, "valueTwo");
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.setObjectPropertyOperation.getPropertyName(), this.testPropertyName,
            "Assert RemoveFromSetOperation#getPropertyName returns the correct propertyName");
        test.assertEqual(this.setObjectPropertyOperationTwo.getPropertyName(), this.testPropertyNameTwo,
            "Assert RemoveFromSetOperation#getPropertyName does not default to'testPropertyName'");
    }
};
bugmeta.tag(setObjectPropertyOperationGetPropertyNameTest).with(
    test().name("SetObjectPropertyOperation - #getPropertyName Test")
);

var setObjectPropertyOperationGetPropertyValueTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.meldDocumentKey                = new MeldDocumentKey("TestType", "testId");
        this.testPath               = "testPath";
        this.testPathTwo            = "testPathTwo";
        this.testPropertyName       = "testPropertyName";
        this.testPropertyNameTwo    = "testPropertyNameTwo";
        this.testSetValue           = "newSetValueOne";
        this.testSetValueTwo        = "newSetValueTwo";

        this.setObjectPropertyOperation      = new SetObjectPropertyOperation(this.meldDocumentKey, this.testPath, this.testPropertyName, this.testSetValue);
        this.setObjectPropertyOperationTwo   = new SetObjectPropertyOperation(this.meldDocumentKey, this.testPathTwo, this.testPropertyNameTwo, this.testSetValueTwo);

    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.setObjectPropertyOperation.getPropertyValue(), this.testSetValue,
            "Assert SetObjectPropertyOperation#getPropertyValue returns the correct setValue");
        test.assertEqual(this.setObjectPropertyOperationTwo.getPropertyValue(), this.testSetValueTwo,
            "Assert SetObjectPropertyOperation#getPropertyValue does not default to'newSetValueOne'");
    }
};
bugmeta.tag(setObjectPropertyOperationGetPropertyValueTest).with(
    test().name("SetObjectPropertyOperation - #getPropertyValue Test")
);

var setObjectPropertyOperationApplyTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testPath               = "testPath";
        this.testPropertyName       = "testPropertyName";
        this.testPropertyValue      = 123456789;
        this.meldDocumentKey                = new MeldDocumentKey("TestType", "testId");
        this.meldBucket             = new MeldBucket();
        this.testData               = {
            "testPath": {
                "testPropertyName": this.testPropertyValue
            }
        };
        this.testSetValue       = "newSetValueOne";
        this.meldDocument                       = new MeldDocument(this.meldDocumentKey, this.testData);
        this.meldBucket.addMeldDocument(this.meldDocument);
        this.setObjectPropertyOperation         = new SetObjectPropertyOperation(this.meldDocumentKey, this.testPath, this.testPropertyName, this.testSetValue);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.meldDocument.deltaDocument.getPath(this.testPath), this.testData["testPath"],
            "Assert value at path is stored correctly");
        test.assertEqual(this.meldDocument.deltaDocument.getPath(this.testPath)[this.testPropertyName], this.testPropertyValue,
            "Assert testPropertyName property exists and is equal to 123456789");

        var editedMeldDocument = this.setObjectPropertyOperation.apply(this.meldBucket);
        test.assertTrue(Class.doesExtend(editedMeldDocument, MeldDocument),
            "Assert setObjectPropertyOperation#apply returns a MeldDocument object");
        test.assertEqual(editedMeldDocument.deltaDocument.getPath(this.testPath)[this.testPropertyName], this.testSetValue,
            "Assert testPropertyName property was reset");
    }
};
bugmeta.tag(setObjectPropertyOperationApplyTest).with(
    test().name("SetObjectPropertyOperation - #apply Test")
);

var setObjectPropertyOperationComplexPathApplyTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testPath               = "testPath";
        this.testPropertyName       = "testPropertyName";
        this.complexTestPath        = "testPath.complexPath";
        this.testPropertyName       = "testPropertyNameTwo";
        this.testPropertyValue      = 987654321;
        this.meldDocumentKey                = new MeldDocumentKey("TestType", "testId");
        this.meldBucket             = new MeldBucket();
        this.testData               = {
            "testPath": {
                "complexPath": {
                    "testPropertyNameTwo": this.testPropertyValue
                }
            }
        };
        this.testSetValue       = "newSetValueOne";
        this.meldDocument                       = new MeldDocument(this.meldDocumentKey, this.testData);
        this.meldBucket.addMeldDocument(this.meldDocument);
        this.setObjectPropertyOperationComplex  = new SetObjectPropertyOperation(this.meldDocumentKey, this.complexTestPath, this.testPropertyName, this.testSetValue);

    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.meldDocument.getDeltaDocument().getPath(this.complexTestPath), this.testData.testPath.complexPath,
            "Assert complexTestPath value is stored correctly");
        test.assertEqual(this.meldDocument.getDeltaDocument().getPath(this.complexTestPath)[this.testPropertyName], this.testPropertyValue,
            "Assert testPropertyName property exists and is equal to 987654321");

        var editedMeldDocumentTwo  = this.setObjectPropertyOperationComplex.apply(this.meldBucket);
        test.assertTrue(Class.doesExtend(editedMeldDocumentTwo, MeldDocument),
            "Assert setObjectPropertyOperation#apply returns a MeldDocument object");
        test.assertEqual(editedMeldDocumentTwo.getDeltaDocument().getPath(this.complexTestPath)[this.testPropertyName], this.testSetValue,
            "Assert testPropertyNameTwo property was reset");
    }
};
bugmeta.tag(setObjectPropertyOperationComplexPathApplyTest).with(
    test().name("SetObjectPropertyOperation - complex path #apply Test")
);

var setObjectPropertyOperationCloneTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testPath           = "testPath";
        this.testPropertyName   = "testPropertyName";
        this.testPropertyValue  = 123456789;
        this.meldDocumentKey            = new MeldDocumentKey("TestType", "testId");
        this.setObjectPropertyOperation = new SetObjectPropertyOperation(this.meldDocumentKey, this.testPath, this.testPropertyName, this.testPropertyValue);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.clone = this.setObjectPropertyOperation.clone();
        test.assertTrue(Class.doesExtend(this.clone, SetObjectPropertyOperation),
            "Assert the clone is an instance of SetObjectPropertyOperation");
        test.assertEqual(this.clone.getUuid(), this.setObjectPropertyOperation.getUuid(),
            "Assert the clone's uuid is the same as the original's uuid");
        test.assertEqual(this.clone.getType(), this.setObjectPropertyOperation.getType(),
            "Assert the clone's type is the same as the original's type");
        test.assertEqual(this.clone.getMeldDocumentKey(), this.setObjectPropertyOperation.getMeldDocumentKey(),
            "Assert the clone's meldDocumentKey is equal to the original's meldDocumentKey");
        test.assertEqual(this.clone.getPath(), this.setObjectPropertyOperation.getPath(),
            "Assert the clone's path is equal to the original's path");
        test.assertEqual(this.clone.getPropertyName(), this.setObjectPropertyOperation.getPropertyName(),
            "Assert the clone's propertyName is equal to the original's propertyName");
        test.assertNotEqual(this.clone, this.setObjectPropertyOperation,
            "Assert the clone is not the same object as the original");
    }
};
bugmeta.tag(setObjectPropertyOperationCloneTest).with(
    test().name("SetObjectPropertyOperation - #clone Test")
);
