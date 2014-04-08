//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Set')
//@Require('bugdelta.DeltaDocument')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')
//@Require('bugyarn.BugYarn')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldDocumentKey')
//@Require('meldbug.MeldBucket')


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
var DeltaDocument           = bugpack.require('bugdelta.DeltaDocument');
var TestAnnotation          = bugpack.require('bugunit.TestAnnotation');
var BugYarn                 = bugpack.require('bugyarn.BugYarn');
var MeldDocument            = bugpack.require('meldbug.MeldDocument');
var MeldDocumentKey         = bugpack.require('meldbug.MeldDocumentKey');
var MeldBucket              = bugpack.require('meldbug.MeldBucket');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var bugyarn                 = BugYarn.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWeaver("testMeldDocument", function(yarn, args) {
    return new MeldDocument(args[0], args[1]);
});

bugyarn.registerWinder("setupTestMeldDocument", function(yarn) {
    yarn.spin([
        "setupTestMeldDocumentKey"
    ]);
    var testData = {};
    yarn.wind({
        meldDocumentKey: new MeldDocumentKey(this.meldDocumentKey, testData)
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldDocumentInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn                    = bugyarn.yarn(this);
        yarn.spin([
            "setupTestMeldDocumentKey"
        ]);
        this.testData               = {};
        this.testMeldDocument       = new MeldDocument(this.meldDocumentKey, this.testData);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testMeldDocument, MeldDocument),
            "Assert instance of MeldDocument");
        test.assertEqual(this.testMeldDocument.getData(), this.testData,
            "Assert .data was set correctly");
        test.assertEqual(this.testMeldDocument.getMeldDocumentKey(), this.meldDocumentKey,
            "Assert .meldDocumentKey was set correctly");
    }
};

var meldDocumentTest = {

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
    }
};

var meldDocumentAddToSetNonExistentTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.meldDocumentKey        = new MeldDocumentKey("object", "id");
        this.meldDocument           = new MeldDocument(this.meldDocumentKey);
        this.testPath               = "testPath";
        this.testValue              = "value3";
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.meldDocument.addToSet(this.testPath, this.testValue);
        var returnedSet = this.meldDocument.getPath(this.testPath);
        test.assertTrue(Class.doesExtend(returnedSet, Set),
            "Assert a Set was created at testPath path");
        test.assertTrue(returnedSet.contains(this.testValue),
            "Assert new Set contains the testValue");
    }
};


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(meldDocumentInstantiationTest).with(
    test().name("MeldDocument - instantiation Test")
);

bugmeta.annotate(meldDocumentTest).with(
    test().name("MeldDocument Tests")
);

bugmeta.annotate(meldDocumentAddToSetNonExistentTest).with(
    test().name("MeldDocument - addToSet non existent Set test")
);
