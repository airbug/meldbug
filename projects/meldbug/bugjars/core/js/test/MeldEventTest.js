//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
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
var TestTag          = bugpack.require('bugunit.TestTag');
var MeldEvent               = bugpack.require('meldbug.MeldEvent');
var MeldDocumentKey                 = bugpack.require('meldbug.MeldDocumentKey');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestTag.test;


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
bugmeta.tag(meldEventGetMeldDocumentKeyTest).with(
    test().name("MeldEvent - #getMeldDocumentKey Test")
);
