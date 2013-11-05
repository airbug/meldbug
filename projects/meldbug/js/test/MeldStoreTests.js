//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('meldbug.Meld')
//@Require('meldbug.MeldKey')
//@Require('meldbug.MeldStore')
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
var MeldStore               = bugpack.require('meldbug.MeldStore');
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

var meldStoreTest = {

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
        // test commitMeldTransaction
        // test containsMeldByKey
        // test getMeld
        // test getEachMeld
        test.complete();
    }
};
bugmeta.annotate(meldStoreTest).with(
    test().name("Meld Store Tests")
);
