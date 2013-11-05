//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('meldbug.Meld')
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

var meldTest = {

    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var _this = this;
        var meldKey = new MeldKey("array", "basic", "id");
        this.meld = new Meld(meldKey, "type");
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var _this = this;
        // test getMeldBucket
        // test setMeldBucket
        // test getMeldKey
        // test getMeldOperationList
        // test setMeldOperationList
        // test getMeldType
        // test toObject
        // test commit
        // test findOperationIndex
        // test getLastMeldOperation
        // test getLastRevisionIndex
        // test getRevisionIndex
        // test meldOperation
        test.complete();
    }
};
bugmeta.annotate(meldTest).with(
    test().name("Meld Tests")
);
