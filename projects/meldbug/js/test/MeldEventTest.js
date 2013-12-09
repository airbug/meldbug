//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('meldbug.MeldEvent')
//@Require('meldbug.MeldKey')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var MeldEvent               = bugpack.require('meldbug.MeldEvent');
var MeldKey                 = bugpack.require('meldbug.MeldKey');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldEventGetMeldKeyTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id         = "testId";
        this.meldType   = "TestType";
        this.meldKey    = new MeldKey(this.meldType, this.id);
        this.data       = {testData: "testValue"};
        this.meldEvent  = new MeldEvent(this.eventType, this.meldKey, this.data);

    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.meldEvent.getMeldKey(), this.meldKey,
            "Assert meldEvent#getMeldKey returns the correct meldKey");
    }
};
bugmeta.annotate(meldEventGetMeldKeyTest).with(
    test().name("MeldEvent - #getMeldKey Test")
);
