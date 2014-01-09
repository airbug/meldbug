//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldDocumentKey')
//@Require('meldbug.MeldBucket')
//@Require('Class')
//@Require('Set')
//@Require('bugdelta.DeltaDocument')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Set                     = bugpack.require('Set');
var MeldDocument            = bugpack.require('meldbug.MeldDocument');
var MeldDocumentKey         = bugpack.require('meldbug.MeldDocumentKey');
var MeldBucket              = bugpack.require('meldbug.MeldBucket');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var DeltaDocument           = bugpack.require('bugdelta.DeltaDocument');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldDocumentTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var data = {
            testSet: new Set(["value1", "value2"]),
            testObject: {
                property1: "val1",
                property2: "val2"
            }
        };
        this.meldBucket             = new MeldBucket();
        this.meldDocumentKey        = new MeldDocumentKey("object", "id");
        this.meldDocument           = new MeldDocument(this.meldDocumentKey, data);
        this.meldBucket.addMeldDocument(this.meldDocument);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.meldDocument.addToSet("testSet", "value3");
        var testSet = this.meldDocument.getData().testSet;
        test.assertEqual(testSet.getCount(), 3,
            "Make sure count reflects the value that was added.");
        test.assertTrue(testSet.contains("value3"),
            "Make sure our new value is in the set.");
        this.meldDocument.removeFromSet("testSet", "value3");
        testSet = this.meldDocument.getData().testSet;
        test.assertEqual(testSet.getCount(), 2,
            "Make sure count reflects the value that was removed.");
        test.assertFalse(testSet.contains("value3"),
            "Make sure our removed value is not in the set.");
        
        var testData = this.meldDocument.getData();
        var testObject = testData.testObject;
        test.assertEqual(testObject.property1, "val1",
            "Ensure property on object has correct value");
        test.assertEqual(testObject.property1, "val1",
            "Ensure property on object has correct value");
        
        test.assertTrue(Class.doesExtend(this.meldDocument.getDeltaDocument(), DeltaDocument),
            "Ensure that we get a delta document back");


        // test clone
        // test commit
        // test generateObject
        // test removeObjectProperty
        // test setData
        // test setObjectProperty
        test.complete();
    }
};
bugmeta.annotate(meldDocumentTest).with(
    test().name("MeldDocument Tests")
);
