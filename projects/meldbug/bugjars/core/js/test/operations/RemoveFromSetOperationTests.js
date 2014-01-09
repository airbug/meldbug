//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Set')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('meldbug.MeldBucket')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldDocumentKey')
//@Require('meldbug.RemoveFromSetOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Set                     = bugpack.require('Set');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var MeldBucket              = bugpack.require('meldbug.MeldBucket');
var MeldDocument            = bugpack.require('meldbug.MeldDocument');
var MeldDocumentKey         = bugpack.require('meldbug.MeldDocumentKey');
var RemoveFromSetOperation  = bugpack.require('meldbug.RemoveFromSetOperation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------
var removeFromSetOperationGetPathTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id                     = "testId";
        this.meldType               = "testType";
        this.meldDocumentKey        = new MeldDocumentKey(this.meldType, this.id);
        this.meldBucket             = new MeldBucket();
        this.meldDocument           = new MeldDocument(this.meldDocumentKey, {"testPath": new Set()});
        this.testPath               = "testPath";
        this.setValue               = "testSetValue";
        this.meldBucket.addMeldDocument(this.meldDocument);
        this.removeFromSetOperation = new RemoveFromSetOperation(this.meldDocumentKey, this.testPath, this.setValue);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.removeFromSetOperation.getPath(), this.testPath,
            "Assert removeFromSetOperation#getPath returns 'testPath'");
    }
};
bugmeta.annotate(removeFromSetOperationGetPathTest).with(
    test().name("RemoveFromSetOperation - #getPath Test")
);

var removeFromSetOperationGetSetValueTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id             = "testId";
        this.meldType       = "testType";
        this.meldDocumentKey        = new MeldDocumentKey(this.meldType, this.id);
        this.meldBucket     = new MeldBucket();
        this.meldDocument   = new MeldDocument(this.meldDocumentKey, {"testPath": new Set()});
        this.testPath       = "testPath";
        this.setValue       = "testSetValue";
        this.meldBucket.addMeldDocument(this.meldDocument);
        this.removeFromSetOperation = new RemoveFromSetOperation(this.meldDocumentKey, this.testPath, this.setValue);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.removeFromSetOperation.getSetValue(), this.setValue,
            "Assert removeFromSetOperation#getPath returns 'testSetValue'");
    }
};
bugmeta.annotate(removeFromSetOperationGetSetValueTest).with(
    test().name("RemoveFromSetOperation - #getSetValue Test")
);

var removeFromSetOperationApplyTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id             = "testId";
        this.meldType       = "testType";
        this.meldDocumentKey        = new MeldDocumentKey(this.meldType, this.id);
        this.meldBucket     = new MeldBucket();
        this.testData       = {"testPath": new Set()};
        this.meldDocument   = new MeldDocument(this.meldDocumentKey, this.testData);
        this.testPath       = "testPath";
        this.setValue       = "testSetValue";
        this.setValueTwo    = "testSetValueTwo";
        this.setValueThree  = "testSetValueThree";
        this.meldDocument.addToSet(this.testPath, this.setValue);
        this.meldDocument.addToSet(this.testPath, this.setValueTwo);
        this.meldDocument.addToSet(this.testPath, this.setValueThree);
        this.meldBucket.addMeldDocument(this.meldDocument);
        this.removeFromSetOperation = new RemoveFromSetOperation(this.meldDocumentKey, this.testPath, this.setValue);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.editedMeld     = this.removeFromSetOperation.apply(this.meldBucket);
        test.assertTrue(Class.doesExtend(this.editedMeld, MeldDocument),
            "Assert removeFromSetOperation#apply returns a MeldDocument object");
        test.assertFalse(this.editedMeld.deltaDocument.getPath(this.testPath).contains(this.setValue),
            "Assert 'testSetValue' was removed");
        test.assertTrue(this.editedMeld.deltaDocument.getPath(this.testPath).contains(this.setValueTwo),
            "Assert 'testSetValueTwo was not removed");
        test.assertTrue(this.editedMeld.deltaDocument.getPath(this.testPath).contains(this.setValueThree),
            "Assert 'testSetValueThree' was not removed");
    }
};
bugmeta.annotate(removeFromSetOperationApplyTest).with(
    test().name("RemoveFromSetOperation - #apply Test")
);

var removeFromSetOperationCloneTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id                 = "testId";
        this.meldType           = "testType";
        this.meldDocumentKey    = new MeldDocumentKey(this.meldType, this.id);
        this.meldBucket         = new MeldBucket();
        this.testData           = {"testPath": new Set()};
        this.meldDocument       = new MeldDocument(this.meldDocumentKey, this.testData);
        this.testPath           = "testPath";
        this.setValue           = "testSetValue";
        this.setValueTwo        = "testSetValueTwo";
        this.setValueThree      = "testSetValueThree";
        this.meldDocument.addToSet(this.testPath, this.setValue);
        this.meldDocument.addToSet(this.testPath, this.setValueTwo);
        this.meldDocument.addToSet(this.testPath, this.setValueThree);
        this.meldBucket.addMeldDocument(this.meldDocument);
        this.removeFromSetOperation = new RemoveFromSetOperation(this.meldDocumentKey, this.testPath, this.setValue);
        this.clone              = this.removeFromSetOperation.clone();
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.clone, RemoveFromSetOperation),
            "Assert that the clone is an instance of RemoveFromSetOperation");
        test.assertEqual(this.clone.getUuid(), this.removeFromSetOperation.getUuid(),
            "Assert the clone's uuid is the same as the original's uuid");
        test.assertEqual(this.clone.getType(), this.removeFromSetOperation.getType(),
            "Assert the clone's type is the same as the original's type");
        test.assertEqual(this.clone.getMeldDocumentKey(), this.removeFromSetOperation.getMeldDocumentKey(),
            "Assert that the clone's meldDocumentKey is equal to the original's meldDocumentKey");
        test.assertEqual(this.clone.getPath(), this.removeFromSetOperation.getPath(),
            "Assert that the clone's path is equal to the original's path");
        test.assertEqual(this.clone.getSetValue(), this.removeFromSetOperation.getSetValue(),
            "Assert that the clone's setValue is equal to the original's setValue");
        test.assertNotEqual(this.clone, this.removeFromSetOperation,
            "Assert that the clone is not the same object as the original");
    }
};
bugmeta.annotate(removeFromSetOperationCloneTest).with(
    test().name("RemoveFromSetOperation - #clone Test")
);
