//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')
//@Require('meldbug.MeldBucket')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldDocumentKey')
//@Require('meldbug.MeldOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit.TestAnnotation');
var MeldBucket              = bugpack.require('meldbug.MeldBucket');
var MeldDocument            = bugpack.require('meldbug.MeldDocument');
var MeldDocumentKey         = bugpack.require('meldbug.MeldDocumentKey');
var MeldOperation           = bugpack.require('meldbug.MeldOperation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldOperationInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id                         = "testId";
        this.meldType                   = "TestType";
        this.filter                     = "basic";
        this.testUuid                   = "testUuid";
        this.meldDocumentKey            = new MeldDocumentKey(this.meldType, this.id);
        this.meldOperationType          = "testMeldOperationType";
        this.meldOperation              = new MeldOperation(this.meldDocumentKey, this.meldOperationType);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(!!this.meldOperation.getUuid(),
            "Assert meldOperation uuid is defined and not null");
        test.assertEqual(this.meldOperation.getMeldDocumentKey(), this.meldDocumentKey,
            "Assert meldOperation.meldDocumentKey is the meldDocumentKey passed in at construction");
        test.assertEqual(this.meldOperation.getType(), this.meldOperationType,
            "Assert meldOperation.type is the type passed in at construction");
    }
};
bugmeta.annotate(meldOperationInstantiationTest).with(
    test().name("MeldOperation - instantiation Test")
);

var meldOperationGetMeldDocumentKeyTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id                     = "testId";
        this.meldType               = "TestType";
        this.meldDocumentKey        = new MeldDocumentKey(this.meldType, this.id);
        this.previousOperationUuid  = null;
        this.meldOperationType      = "";
        this.meldOperation          = new MeldOperation(this.meldDocumentKey, this.meldOperationType, this.previousOperationUuid);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.meldDocumentKey, this.meldOperation.getMeldDocumentKey(),
            "Assert meldOperation#getMeldDocumentKey retrieves correct meldDocumentKey");
    }
};
bugmeta.annotate(meldOperationGetMeldDocumentKeyTest).with(
    test().name("MeldOperation - #getMeldDocumentKey Test")
);

var meldOperationGetUuidTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testId                 = "testId";
        this.meldType               = "TestType";
        this.testUuid               = "testUuid";
        this.meldDocumentKey        = new MeldDocumentKey(this.meldType, this.testId);
        this.meldOperationType      = "";
        this.meldOperation          = new MeldOperation(this.meldDocumentKey, this.meldOperationType, null);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.meldOperation.uuid, this.meldOperation.getUuid(),
            "Assert meldOperation#getUuid retrieves correct uuid");
    }
};
bugmeta.annotate(meldOperationGetUuidTest).with(
    test().name("MeldOperation - #getUuid Test")
);

var meldOperationSetUuidTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id                     = "testId";
        this.meldType               = "TestType";
        this.meldDocumentKey                = new MeldDocumentKey(this.meldType, this.id);
        this.meldOperationType      = "";
        this.meldOperation          = new MeldOperation(this.meldDocumentKey, this.meldOperationType, this.previousOperationUuid);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.newUuid = "newUuid";
        this.meldOperation.setUuid(this.newUuid);

        test.assertEqual(this.meldOperation.uuid, this.newUuid,
            "Assert meldOperation.uuid is set to the new uuid");
    }
};
bugmeta.annotate(meldOperationSetUuidTest).with(
    test().name("MeldOperation - #setUuid Test")
);

var meldOperationApplyTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id                     = "testId";
        this.meldType               = "testType";
        this.meldDocumentKey        = new MeldDocumentKey(this.meldType, this.id);
        this.meldBucket             = new MeldBucket();
        this.testData               = {
            "testPath": {
                "testPropertyName": this.testPropertyValue,
                "complexPath": {
                    "testPropertyNameTwo": 987654321
                }
            }
        };
        this.meldDocument       = new MeldDocument(this.meldDocumentKey, this.testData);
        this.meldBucket.addMeldDocument(this.meldDocument);
        this.meldOperation      = new MeldOperation(this.meldDocumentKey, "testType", null);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.editedMeldDocument         = this.meldOperation.apply(this.meldBucket);
        test.assertTrue(Class.doesExtend(this.editedMeldDocument, MeldDocument),
            "Assert meldOperation#apply returns a MeldDocument object");
    }
};
bugmeta.annotate(meldOperationApplyTest).with(
    test().name("MeldOperation - #apply Test")
);
