//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Map')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('meldbug.Meld')
//@Require('meldbug.MeldBucket')
//@Require('meldbug.MeldEvent')
//@Require('meldbug.MeldKey')
//@Require('meldbug.MeldOperation')
//@Require('meldbug.RemoveMeldOperation')


//@Require('Class')
//@Require('Obj')
//@Require('UuidGenerator')
//@Requre('meldbug.MeldOperation')



//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var Meld                    = bugpack.require('meldbug.Meld');
var MeldBucket              = bugpack.require('meldbug.MeldBucket');
var MeldEvent               = bugpack.require('meldbug.MeldEvent');
var MeldKey                 = bugpack.require('meldbug.MeldKey');
var MeldOperation           = bugpack.require('meldbug.MeldOperation');
var RemoveMeldOperation     = bugpack.require('meldbug.RemoveMeldOperation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldOperationGetMeldKeyTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id                     = "testId";
        this.meldType               = "TestType";
        this.filter                 = "basic";
        this.meldBucket             = new MeldBucket();
        this.meldKey                = new MeldKey(this.meldType, this.id, this.filter);
        this.meld                   = new Meld(this.meldKey, this.meldType);
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
        this.meldBucket             = new MeldBucket();
        this.meldKey                = new MeldKey(this.meldType, this.id, this.filter);
        this.meld                   = new Meld(this.meldKey, this.meldType);
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

var meldOperationSetPreviousOperationUuidTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id                     = "testId";
        this.meldType               = "TestType";
        this.filter                 = "basic";
        this.meldBucket             = new MeldBucket();
        this.meldKey                = new MeldKey(this.meldType, this.id, this.filter);
        this.meld                   = new Meld(this.meldKey, this.meldType);
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

// var meldOperationCommitTest = {

//     //-------------------------------------------------------------------------------
//     // Setup Test
//     //-------------------------------------------------------------------------------

//     setup: function(test) {
//         this.id                     = "testId";
//         this.meldType               = "TestType";
//         this.filter                 = "basic";
//         this.meldBucket             = new MeldBucket();
//         this.meldKey                = new MeldKey(this.meldType, this.id, this.filter);
//         this.meld                   = new Meld(this.meldKey, this.meldType);
//         this.previousOperationUuid  = null;
//         this.meldOperationType      = "";
//         this.meldOperation          = new MeldOperation(this.meldKey, this.meldOperationType, this.previousOperationUuid);
//         this.modifiedMeld           = this.meldOperation.commit(this.meldBucket);
//     },


//     //-------------------------------------------------------------------------------
//     // Run Test
//     //-------------------------------------------------------------------------------

//     test: function(test) {

//     }
// };
// bugmeta.annotate(meldOperationCommitTest).with(
//     test().name("MeldOperation - #commit Test")
// );
