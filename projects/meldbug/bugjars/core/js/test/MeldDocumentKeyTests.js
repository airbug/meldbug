//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('TypeUtil')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')
//@Require('bugyarn.BugYarn')
//@Require('meldbug.MeldDocumentKey')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var TypeUtil                    = bugpack.require('TypeUtil');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var TestAnnotation              = bugpack.require('bugunit.TestAnnotation');
var BugYarn                     = bugpack.require('bugyarn.BugYarn');
var MeldDocumentKey             = bugpack.require('meldbug.MeldDocumentKey');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var bugyarn                     = BugYarn.context();
var test                        = TestAnnotation.test;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWeaver("testMeldDocumentKey", function(yarn, args) {
    return new MeldDocumentKey(args[0], args[1]);
});

bugyarn.registerWinder("setupTestMeldDocumentKey", function(yarn) {
    yarn.wind({
        meldDocumentKey: new MeldDocumentKey("testDataType", "testId")
    });
});


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldDocumentKeyInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testDataType           = "testDataType";
        this.testId                 = "testId";
        this.testMeldDocumentKey    = new MeldDocumentKey(this.testDataType, this.testId);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testMeldDocumentKey, MeldDocumentKey),
            "Assert instance of MeldDocumentKey");
        test.assertEqual(this.testMeldDocumentKey.getDataType(), this.testDataType,
            "Assert .dataType was set correctly");
        test.assertEqual(this.testMeldDocumentKey.getId(), this.testId,
            "Assert .id was set correctly");
    }
};


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(meldDocumentKeyInstantiationTest).with(
    test().name("MeldDocumentKey - instantiation test")
);
