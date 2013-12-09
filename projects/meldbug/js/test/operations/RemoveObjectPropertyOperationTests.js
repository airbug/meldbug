//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Set')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('meldbug.Meld')
//@Require('meldbug.MeldBucket')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldKey')
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
var TestAnnotation                  = bugpack.require('bugunit-annotate.TestAnnotation');
var Meld                            = bugpack.require('meldbug.Meld');
var MeldBucket                      = bugpack.require('meldbug.MeldBucket');
var MeldDocument                    = bugpack.require('meldbug.MeldDocument');
var MeldKey                         = bugpack.require('meldbug.MeldKey');
var RemoveObjectPropertyOperation   = bugpack.require('meldbug.RemoveObjectPropertyOperation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var removeObjectPropertyOperationInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.meldKey                = new MeldKey("TestType", "testId");
        this.testPath               = "testPath";
        this.testPropertyName       = "testPropertyName";
        this.testPropertyValue      = "testPropertyValue";
        this.removeObjectPropertyOperation      = new RemoveObjectPropertyOperation(this.meldKey, this.testPath, this.testPropertyName, this.testPropertyValue);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.removeObjectPropertyOperation.meldKey, this.meldKey,
            "Assert removeObjectPropertyOperation's meldKey property is set to the meldKey given at construction");
        test.assertEqual(this.removeObjectPropertyOperation.path, this.testPath,
            "Assert removeObjectPropertyOperation's path property is set to the path given at construction");
        test.assertEqual(this.removeObjectPropertyOperation.type, RemoveObjectPropertyOperation.TYPE,
            "Assert removeObjectPropertyOperation's type is set to the value of RemoveObjectPropertyOperation.TYPE");
        test.assertEqual(this.removeObjectPropertyOperation.propertyName, this.testPropertyName,
            "Assert removeObjectPropertyOperation's propertyName property is set to the propertyName given at construction");
    }
};
bugmeta.annotate(removeObjectPropertyOperationInstantiationTest).with(
    test().name("RemoveObjectPropertyOperation - instantiation Test")
);

var removeObjectPropertyOperationGetPathTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id                     = "testId";
        this.meldType               = "testType";
        this.meldKey                = new MeldKey(this.meldType, this.id);
        this.testPath               = "testPath";
        this.testPathTwo            = "testPathTwo";
        this.testPropertyName       = "testPropertyName";
        this.testPropertyNameTwo    = "testPropertyNameTwo";
        this.removeObjectPropertyOperation      = new RemoveObjectPropertyOperation(this.meldKey, this.testPath, this.testPropertyName);
        this.removeObjectPropertyOperationTwo   = new RemoveObjectPropertyOperation(this.meldKey, this.testPathTwo, this.testPropertyNameTwo);
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
bugmeta.annotate(removeObjectPropertyOperationGetPathTest).with(
    test().name("RemoveObjectPropertyOperation - #getPath Test")
);

var removeObjectPropertyOperationGetPropertyNameTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id                     = "testId";
        this.meldType               = "testType";
        this.meldKey                = new MeldKey(this.meldType, this.id);
        this.testPath               = "testPath";
        this.testPathTwo            = "testPathTwo";
        this.testPropertyName       = "testPropertyName";
        this.testPropertyNameTwo    = "testPropertyNameTwo";
        this.removeObjectPropertyOperation      = new RemoveObjectPropertyOperation(this.meldKey, this.testPath, this.testPropertyName);
        this.removeObjectPropertyOperationTwo   = new RemoveObjectPropertyOperation(this.meldKey, this.testPathTwo, this.testPropertyNameTwo);
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
bugmeta.annotate(removeObjectPropertyOperationGetPropertyNameTest).with(
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
        this.meldKey                = new MeldKey(this.meldType, this.id);
        this.meldBucket             = new MeldBucket();
        this.testData               = {
            "testPath": {
                "testPropertyName": this.testPropertyValue,
                "complexPath": {
                    "testPropertyNameTwo": 987654321
                }
            }
        };
        this.meldDocument                           = new MeldDocument(this.meldKey, this.testData);
        this.meldBucket.addMeld(this.meldDocument);
        this.removeObjectPropertyOperation          = new RemoveObjectPropertyOperation(this.meldKey, this.testPath, this.testPropertyName);
        this.removeObjectPropertyOperationComplex   = new RemoveObjectPropertyOperation(this.meldKey, this.complexTestPath, this.testPropertyNameTwo);

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
        test.assertTrue(Class.doesExtend(this.editedMeld, Meld),
            "Assert removeFromSetOperation#apply returns a Meld object");
        test.assertTrue(Class.doesExtend(this.editedMeld, MeldDocument),
            "Assert removeFromSetOperation#apply returns a MeldDocument object");
        test.assertFalse(this.editedMeld.deltaDocument.getPath(this.testPath)[this.testPropertyName],
            "Assert testPropertyName property was removed");

        this.editedMeldTwo  = this.removeObjectPropertyOperationComplex.apply(this.meldBucket);
        test.assertTrue(Class.doesExtend(this.editedMeldTwo, Meld),
            "Assert removeFromSetOperation#apply returns a Meld object");
        test.assertTrue(Class.doesExtend(this.editedMeldTwo, MeldDocument),
            "Assert removeFromSetOperation#apply returns a MeldDocument object");
        test.assertFalse(this.editedMeldTwo.deltaDocument.getPath(this.complexTestPath)[this.testPropertyNameTwo],
            "Assert testPropertyNameTwo property was removed");
    }
};
bugmeta.annotate(removeObjectPropertyOperationApplyTest).with(
    test().name("RemoveObjectPropertyOperation - #apply Test")
);

var removeObjectPropertyOperationCommitTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id                 = "testId";
        this.meldType           = "testType";
        this.testPath           = "testPath";
        this.testPropertyName   = "testPropertyName";
        this.testPropertyValue  = 123456789;
        this.meldKey            = new MeldKey(this.meldType, this.id);
        this.meldBucket         = new MeldBucket();
        this.meldDocument       = new MeldDocument(this.meldKey, {"testPath": {"testPropertyName": this.testPropertyValue}});
        this.meldBucket.addMeld(this.meldDocument);
        this.removeObjectPropertyOperation = new RemoveObjectPropertyOperation(this.meldKey, this.testPath, this.testPropertyName);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.meldDocument.deltaDocument.getPath(this.testPath)[this.testPropertyName], this.testPropertyValue,
            "Assert testPropertyName property exists and is equal to 123456789");
        this.editedMeld         = this.removeObjectPropertyOperation.commit(this.meldBucket);
        var meldOperationList   = this.editedMeld.getMeldOperationList();
        test.assertTrue(( meldOperationList.indexOfLast(this.removeObjectPropertyOperation) > -1),
            "Assert removeObjectPropertyOperation is now in the meldOperationList");
        test.assertEqual(meldOperationList.getAt(meldOperationList.getCount() - 1), this.removeObjectPropertyOperation,
            "Assert removeObjectPropertyOperation is at the end of the meldOperationList");
        test.assertTrue(Class.doesExtend(this.editedMeld, Meld),
            "Assert removeFromSetOperation#commit returns a Meld object");
        test.assertTrue(Class.doesExtend(this.editedMeld, MeldDocument),
            "Assert removeFromSetOperation#commit returns a MeldDocument object");
        test.assertFalse(this.editedMeld.deltaDocument.getPath(this.testPath)[this.testPropertyName],
            "Assert testPropertyName property was removed");
    }
};
bugmeta.annotate(removeObjectPropertyOperationCommitTest).with(
    test().name("RemoveObjectPropertyOperation - #commit Test")
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
        this.previousOperationUuid = "previousOperationUuid123"
        this.meldKey            = new MeldKey(this.meldType, this.id);
        this.removeObjectPropertyOperation = new RemoveObjectPropertyOperation(this.meldKey, this.testPath, this.testPropertyName);
        this.removeObjectPropertyOperation.setPreviousOperationUuid("previousOperationUuid123");
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
        test.assertEqual(this.clone.getPreviousOperationUuid(), this.removeObjectPropertyOperation.getPreviousOperationUuid(),
            "Assert the clone's previousOperationUuid is the same as the original's previousOperationUuid");
        test.assertEqual(this.clone.getMeldKey(), this.removeObjectPropertyOperation.getMeldKey(),
            "Assert the clone's meldKey is equal to the original's meldKey");
        test.assertEqual(this.clone.getPath(), this.removeObjectPropertyOperation.getPath(),
            "Assert the clone's path is equal to the original's path");
        test.assertEqual(this.clone.getPropertyName(), this.removeObjectPropertyOperation.getPropertyName(),
            "Assert the clone's propertyName is equal to the original's propertyName");
        test.assertNotEqual(this.clone, this.removeObjectPropertyOperation,
            "Assert the clone is not the same object as the original");
    }
};
bugmeta.annotate(removeObjectPropertyOperationCloneTest).with(
    test().name("RemoveObjectPropertyOperation - #clone Test")
);
