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
var Meld                    = bugpack.require('meldbug.Meld');
var MeldBucket              = bugpack.require('meldbug.MeldBucket');
var MeldDocument            = bugpack.require('meldbug.MeldDocument');
var MeldKey                 = bugpack.require('meldbug.MeldKey');
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
        this.id             = "testId";
        this.meldType       = "testType";
        this.filter         = "basic";
        this.meldKey        = new MeldKey(this.meldType, this.id, this.filter);
        this.meldBucket     = new MeldBucket();
        this.meldDocument   = new MeldDocument(this.meldKey, {"testPath": new Set()});
        this.testPath       = "testPath";
        this.setValue       = "testSetValue";
        this.setValueTwo    = "testSetValueTwo";
        this.setValueThree  = "testSetValueThree";
        this.meldDocument.addToSet(this.testPath, this.setValue);
        this.meldDocument.addToSet(this.testPath, this.setValueTwo);
        this.meldDocument.addToSet(this.testPath, this.setValueThree);
        this.meldBucket.addMeld(this.meldDocument);
        this.removeFromSetOperation = new RemoveFromSetOperation(this.meldKey, this.testPath, this.setValue);
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
        this.filter         = "basic";
        this.meldKey        = new MeldKey(this.meldType, this.id, this.filter);
        this.meldBucket     = new MeldBucket();
        this.meldDocument   = new MeldDocument(this.meldKey, {"testPath": new Set()});
        this.testPath       = "testPath";
        this.setValue       = "testSetValue";
        this.setValueTwo    = "testSetValueTwo";
        this.setValueThree  = "testSetValueThree";
        this.meldDocument.addToSet(this.testPath, this.setValue);
        this.meldDocument.addToSet(this.testPath, this.setValueTwo);
        this.meldDocument.addToSet(this.testPath, this.setValueThree);
        this.meldBucket.addMeld(this.meldDocument);
        this.removeFromSetOperation = new RemoveFromSetOperation(this.meldKey, this.testPath, this.setValue);
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
        this.filter         = "basic";
        this.meldKey        = new MeldKey(this.meldType, this.id, this.filter);
        this.meldBucket     = new MeldBucket();
        this.testData       = {"testPath": new Set()};
        this.meldDocument   = new MeldDocument(this.meldKey, this.testData);
        this.testPath       = "testPath";
        this.setValue       = "testSetValue";
        this.setValueTwo    = "testSetValueTwo";
        this.setValueThree  = "testSetValueThree";
        this.meldDocument.addToSet(this.testPath, this.setValue);
        this.meldDocument.addToSet(this.testPath, this.setValueTwo);
        this.meldDocument.addToSet(this.testPath, this.setValueThree);
        this.meldBucket.addMeld(this.meldDocument);
        this.removeFromSetOperation = new RemoveFromSetOperation(this.meldKey, this.testPath, this.setValue);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.editedMeld     = this.removeFromSetOperation.apply(this.meldBucket);
        test.assertTrue(Class.doesExtend(this.editedMeld, Meld),
            "Assert removeFromSetOperation#apply returns a Meld object");
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
