//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('meldbug.Meld')
//@Require('meldbug.MeldBucket')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldKey')
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
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var Meld                    = bugpack.require('meldbug.Meld');
var MeldBucket              = bugpack.require('meldbug.MeldBucket');
var MeldDocument            = bugpack.require('meldbug.MeldDocument');
var MeldKey                 = bugpack.require('meldbug.MeldKey');
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
        this.testPreviousOperationUuid  = "testPreviousOperationUuid";
        this.meldKey                    = new MeldKey(this.meldType, this.id, this.filter);
        this.meldOperationType          = "testMeldOperationType";
        this.meldOperation              = new MeldOperation(this.meldKey, this.meldOperationType, this.testPreviousOperationUuid);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(!!this.meldOperation.uuid,
            "Assert meldOperation uuid is defined and not null");
        test.assertEqual(this.meldOperation.meldKey, this.meldKey,
            "Assert meldOperation.meldKey is the meldKey passed in at construction");
        test.assertEqual(this.meldOperation.type, this.meldOperationType,
            "Assert meldOperation.type is the type passed in at construction");
        test.assertEqual(this.meldOperation.previousOperationUuid, this.testPreviousOperationUuid,
            "Assert meldOperation.previousOperationUuid is the previousOperationUuid passed in at construction");
    }
};
bugmeta.annotate(meldOperationInstantiationTest).with(
    test().name("MeldOperation - instantiation Test")
);

var meldOperationGetMeldKeyTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id                     = "testId";
        this.meldType               = "TestType";
        this.filter                 = "basic";
        this.meldKey                = new MeldKey(this.meldType, this.id, this.filter);
        this.previousOperationUuid  = null;
        this.meldOperationType      = "";
        this.meldOperation          = new MeldOperation(this.meldKey, this.meldOperationType, this.previousOperationUuid);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.meldKey, this.meldOperation.getMeldKey(),
            "Assert meldOperation#getMeldKey retrieves correct meldKey");
    }
};
bugmeta.annotate(meldOperationGetMeldKeyTest).with(
    test().name("MeldOperation - #getMeldKey Test")
);

var meldOperationGetPreviousOperationUuidTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id                     = "testId";
        this.meldType               = "TestType";
        this.filter                 = "basic";
        this.meldKey                = new MeldKey(this.meldType, this.id, this.filter);
        this.previousOperationUuid  = null;
        this.meldOperationType      = "";
        this.meldOperation          = new MeldOperation(this.meldKey, this.meldOperationType, this.previousOperationUuid);
        this.previousOperationUuidTwo = "nonNullOperationUuid";
        this.meldOperationTwo       = new MeldOperation(this.meldKey, this.meldOperationType, this.previousOperationUuidTwo);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.previousOperationUuid, this.meldOperation.getPreviousOperationUuid(),
            "Assert meldOperation#getPreviousOperationUuid retrieves correct previousOperationUuid");
        test.assertEqual(this.previousOperationUuidTwo, this.meldOperationTwo.getPreviousOperationUuid(),
            "Assert meldOperation#getPreviousOperationUuid retrieves correct previousOperationUuid");
    }
};
bugmeta.annotate(meldOperationGetPreviousOperationUuidTest).with(
    test().name("MeldOperation - #getPreviousOperationUuid Test")
);

var meldOperationGetUuidTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id                     = "testId";
        this.meldType               = "TestType";
        this.filter                 = "basic";
        this.testUuid               = "testUuid";
        this.meldKey                = new MeldKey(this.meldType, this.id, this.filter);
        this.meldOperationType      = "";
        this.meldOperation          = new MeldOperation(this.meldKey, this.meldOperationType, null);
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

var meldOperationSetPreviousOperationUuidTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id                     = "testId";
        this.meldType               = "TestType";
        this.filter                 = "basic";
        this.meldKey                = new MeldKey(this.meldType, this.id, this.filter);
        this.previousOperationUuid  = null;
        this.meldOperationType      = "";
        this.meldOperation          = new MeldOperation(this.meldKey, this.meldOperationType, this.previousOperationUuid);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.previousOperationUuidTwo = "newUuid";
        test.assertEqual(this.previousOperationUuid, this.meldOperation.getPreviousOperationUuid(),
            "Assert meldOperation previousOperationUuid is set as the previousOperationUuid given at construction time");
        this.meldOperation.setPreviousOperationUuid(this.previousOperationUuidTwo);
        test.assertEqual(this.previousOperationUuidTwo, this.meldOperation.getPreviousOperationUuid(),
            "Assert meldOperation#setPreviousOperationUuid is now set to the new previousOperationUuid");
        test.assertNotEqual(this.previousOperationUuid, this.getPreviousOperationUuidTwo,
            "Assert meldOperation previousOperationUuid is not equal to previous previousOperationUuid");
    }
};
bugmeta.annotate(meldOperationSetPreviousOperationUuidTest).with(
    test().name("MeldOperation - #setPreviousOperationUuid Test")
);

var meldOperationSetUuidTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id                     = "testId";
        this.meldType               = "TestType";
        this.filter                 = "basic";
        this.meldKey                = new MeldKey(this.meldType, this.id, this.filter);
        this.meldOperationType      = "";
        this.meldOperation          = new MeldOperation(this.meldKey, this.meldOperationType, this.previousOperationUuid);
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
        this.filter                 = "basic";
        this.meldKey                = new MeldKey(this.meldType, this.id, this.filter);
        this.meldBucket             = new MeldBucket();
        this.testData               = {
            "testPath": {
                "testPropertyName": this.testPropertyValue,
                "complexPath": {
                    "testPropertyNameTwo": 987654321
                }
            }
        };
        this.meldDocument       = new MeldDocument(this.meldKey, this.testData);
        this.meldBucket.addMeld(this.meldDocument);
        this.meldOperation      = new MeldOperation(this.meldKey, "testType", null);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.editedMeld         = this.meldOperation.apply(this.meldBucket);

        test.assertTrue(Class.doesExtend(this.editedMeld, Meld),
            "Assert meldOperation#apply returns a Meld object");
        test.assertTrue(Class.doesExtend(this.editedMeld, MeldDocument),
            "Assert meldOperation#apply returns a MeldDocument object");
    }
};
bugmeta.annotate(meldOperationApplyTest).with(
    test().name("MeldOperation - #apply Test")
);

var meldOperationCommitTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id                     = "testId";
        this.meldType               = "testType";
        this.filter                 = "basic";
        this.meldKey                = new MeldKey(this.meldType, this.id, this.filter);
        this.meldBucket             = new MeldBucket();
        this.testData               = {
            "testPath": {
                "testPropertyName": this.testPropertyValue,
                "complexPath": {
                    "testPropertyNameTwo": 987654321
                }
            }
        };
        this.meldDocument       = new MeldDocument(this.meldKey, this.testData);
        this.meldBucket.addMeld(this.meldDocument);
        this.meldOperation      = new MeldOperation(this.meldKey, "testType", null);
        this.meldOperationTwo   = new MeldOperation(this.meldKey, "testType", this.meldOperation.getUuid());

    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        this.editedMeld         = this.meldOperation.commit(this.meldBucket);
        this.editedMeldTwo      = this.meldOperationTwo.commit(this.meldBucket);
        var meldOperationList   = this.editedMeldTwo.getMeldOperationList();

        test.assertTrue((meldOperationList.indexOfLast(this.meldOperation) > -1),
            "Assert meldOperation is now in the meldOperationList");
        test.assertEqual(meldOperationList.getAt(meldOperationList.getCount() - 2), this.meldOperation,
            "Assert meldOperation is at the correct index of the meldOperationList");

        test.assertTrue((meldOperationList.indexOfLast(this.meldOperationTwo) > -1),
            "Assert second meldOperation is now in the meldOperationList");
        test.assertEqual(meldOperationList.getAt(meldOperationList.getCount() - 1), this.meldOperationTwo,
            "Assert second meldOperation is at the correct index of the meldOperationList");
    }
};
bugmeta.annotate(meldOperationCommitTest).with(
    test().name("MeldOperation - #commit Test")
);
