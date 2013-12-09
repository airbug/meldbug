//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('meldbug.Meld')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldKey')
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
var mongoose                = require('mongoose');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Set                     = bugpack.require('Set');
var Meld                    = bugpack.require('meldbug.Meld');
var MeldDocument            = bugpack.require('meldbug.MeldDocument');
var MeldKey                 = bugpack.require('meldbug.MeldKey');
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
        var _this = this;
        var data = {
            testSet: new Set(["value1", "value2"]),
            testObject: {
                property1: "val1",
                property2: "val2"
            }
        };
        this.meldBucket = new MeldBucket();
        this.meldKey = new MeldKey("object", "id");
        this.meldDocument = new MeldDocument(this.meldKey, data);
        this.meldBucket.addMeld(this.meldDocument);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;

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

        this.meldDocument.meldToSet("testSet", "value4");

        // test clone
        // test commit
        // test generateObject
        // test meldData
        // test meldObjectProperty
        // test meldToSet
        // test removeObjectProperty
        // test setData
        // test setObjectProperty
        // test unmeldFromSet
        // test unmeldObjectProperty
        test.complete();
    }
};
bugmeta.annotate(meldDocumentTest).with(
    test().name("Meld Document Tests")
);
