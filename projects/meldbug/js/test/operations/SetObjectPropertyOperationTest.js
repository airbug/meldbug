//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Set')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('meldbug.Meld')
//@Require('meldbug.MeldBucket')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldKey')
//@Require('meldbug.SetObjectPropertyOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Set                             = bugpack.require('Set');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var TestAnnotation                  = bugpack.require('bugunit-annotate.TestAnnotation');
var Meld                            = bugpack.require('meldbug.Meld');
var MeldBucket                      = bugpack.require('meldbug.MeldBucket');
var MeldDocument                    = bugpack.require('meldbug.MeldDocument');
var MeldKey                         = bugpack.require('meldbug.MeldKey');
var SetObjectPropertyOperation      = bugpack.require('meldbug.SetObjectPropertyOperation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var setObjectPropertyOperationInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.meldKey                = new MeldKey("TestType", "testId", "basic");
        this.testPath               = "testPath";
        this.testPropertyName       = "testPropertyName";
        this.testPropertyValue      = "testPropertyValue";
        this.setObjectPropertyOperation      = new SetObjectPropertyOperation(this.meldKey, this.testPath, this.testPropertyName, this.testPropertyValue);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.setObjectPropertyOperation.meldKey, this.meldKey,
            "Assert setObjectPropertyOperation's meldKey property is set to the meldKey given at construction");
        test.assertEqual(this.setObjectPropertyOperation.path, this.testPath,
            "Assert setObjectPropertyOperation's path property is set to the path given at construction");
        test.assertEqual(this.setObjectPropertyOperation.propertyName, this.testPropertyName,
            "Assert setObjectPropertyOperation's propertyName property is set to the propertyName given at construction");
        test.assertEqual(this.setObjectPropertyOperation.propertyValue, this.testPropertyValue,
            "Assert setObjectPropertyOperation's propertyValue property is set to the propertyValue given at construction");
    }
};
bugmeta.annotate(setObjectPropertyOperationInstantiationTest).with(
    test().name("SetObjectPropertyOperation - instantiation Test")
);

var setObjectPropertyOperationGetPathTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.meldKey                = new MeldKey("TestType", "testId", "basic");
        this.testPath               = "testPath";
        this.testPathTwo            = "testPathTwo";
        this.testPropertyName       = "testPropertyName";
        this.testPropertyNameTwo    = "testPropertyNameTwo";
        this.setObjectPropertyOperation      = new SetObjectPropertyOperation(this.meldKey, this.testPath, this.testPropertyName, "valueOne");
        this.setObjectPropertyOperationTwo   = new SetObjectPropertyOperation(this.meldKey, this.testPathTwo, this.testPropertyNameTwo, "valueTwo");
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertEqual(this.setObjectPropertyOperation.getPath(), this.testPath,
            "Assert setObjectPropertyOperation#getPath returns 'testPath'");
        test.assertEqual(this.setObjectPropertyOperationTwo.getPath(), this.testPathTwo,
            "Assert SetObjectPropertyOperation#getPath does not default to'testPath'");
    }
};
bugmeta.annotate(setObjectPropertyOperationGetPathTest).with(
    test().name("SetObjectPropertyOperation - #getPath Test")
);
