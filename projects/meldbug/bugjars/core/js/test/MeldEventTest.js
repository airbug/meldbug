//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')
//@Require('meldbug.MeldEvent')
//@Require('meldbug.MeldDocumentKey')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit.TestAnnotation');
var MeldEvent               = bugpack.require('meldbug.MeldEvent');
var MeldDocumentKey                 = bugpack.require('meldbug.MeldDocumentKey');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldEventGetMeldDocumentKeyTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id         = "testId";
        this.meldType   = "TestType";
        this.meldDocumentKey    = new MeldDocumentKey(this.meldType, this.id);
        this.data       = {testData: "testValue"};
        this.meldEvent  = new MeldEvent(this.eventType, this.meldDocumentKey, this.data);

    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.meldEvent.getMeldDocumentKey(), this.meldDocumentKey,
            "Assert meldEvent#getMeldDocumentKey returns the correct meldDocumentKey");
    }
};
bugmeta.annotate(meldEventGetMeldDocumentKeyTest).with(
    test().name("MeldEvent - #getMeldDocumentKey Test")
);
