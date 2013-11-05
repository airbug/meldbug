//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('meldbug.Meld')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldKey')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();
var mongoose                = require('mongoose');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Meld                    = bugpack.require('meldbug.Meld');
var MeldDocument            = bugpack.require('meldbug.MeldDocument');
var MeldKey                 = bugpack.require('meldbug.MeldKey');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldDocumentTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        var data = {};
        var meldKey = new MeldKey("array", "basic", "id");
        this.meldDocument = new MeldDocument(meldKey, data);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        // test getDeltaDocument
        // test clone
        // test addToSet
        // test commit
        // test generateObject
        // test getData
        // test meldData
        // test meldObjectProperty
        // test meldToSet
        // test removeFromSet
        // test removeObjectProperty
        // test setData
        // test setObjectProperty
        // test unmeldFromSet
        // test unmeldObjectProperty
        test.complete();
    }
};
bugmeta.annotate(meldDocumentTest).with(
    test().name("Meld Document Tests")
);
