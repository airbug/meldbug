//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('meldbug.MeldDocumentKey')
//@Require('meldbug.RemoveMeldDocumentOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var TestTag                  = bugpack.require('bugunit.TestTag');
var MeldDocumentKey                         = bugpack.require('meldbug.MeldDocumentKey');
var RemoveMeldDocumentOperation     = bugpack.require('meldbug.RemoveMeldDocumentOperation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                         = BugMeta.context();
var test                            = TestTag.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var removeMeldDocumentOperationInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.id                             = "testId";
        this.type                           = "TestType";
        this.meldDocumentKey                        = new MeldDocumentKey(this.type, this.id);
        this.removeMeldDocumentOperation    = new RemoveMeldDocumentOperation(this.meldDocumentKey);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.removeMeldDocumentOperation.getMeldDocumentKey(), this.meldDocumentKey,
            "Assert removeMeldDocumentOperation's MeldDocumentKey is the test meldDocumentKey");
        test.assertEqual(this.removeMeldDocumentOperation.getType(), RemoveMeldDocumentOperation.TYPE,
            "Assert removeMeldDocumentOperation's type is RemoveMeldDocumentOperation.TYPE");
    }
};
bugmeta.tag(removeMeldDocumentOperationInstantiationTest).with(
    test().name("RemoveMeldDocumentOperation - instantiation Test")
);
