//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Map')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('meldbug.MeldBuilder')
//@Require('meldbugserver.MeldbugClientConsumer')
//@Require('meldbugserver.MeldbugClientConsumerManager')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Map                             = bugpack.require('Map');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var TestAnnotation                  = bugpack.require('bugunit-annotate.TestAnnotation');
var MeldBuilder                     = bugpack.require('meldbug.MeldBuilder');
var MeldbugClientConsumer           = bugpack.require('meldbugserver.MeldbugClientConsumer');
var MeldbugClientConsumerManager    = bugpack.require('meldbugserver.MeldbugClientConsumerManager');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                         = BugMeta.context();
var test                            = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldbugClientConsumerManagerInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.meldBuilder = {};
        this.meldbugClientConsumerManager = new MeldbugClientConsumerManager(this.meldBuilder);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.meldbugClientConsumerManager.getCallUuidToConsumerMap(), Map),
            "Assert getCallUuidToConsumerMap() is set at construction and is a Map");
        test.assertEqual(this.meldbugClientConsumerManager.getMeldBuilder(), this.meldBuilder,
            "Assert meldBuilder is set at construction");
    }
};
bugmeta.annotate(meldbugClientConsumerManagerInstantiationTest).with(
    test().name("MeldbugClientConsumerManager - instantiation Test")
);

// var meldbugClientConsumerManagerAddConsumerTest = {

//     //-------------------------------------------------------------------------------
//     // Setup Test
//     //-------------------------------------------------------------------------------

//     setup: function(test) {
//         this.meldbugClientConsumerManager = new MeldbugClientConsumerManager();
//     },

//     //-------------------------------------------------------------------------------
//     // Run Test
//     //-------------------------------------------------------------------------------

//     test: function(test) {

//     }
// };
// bugmeta.annotate(meldbugClientConsumerManagerAddConsumerTest).with(
//     test().name("MeldbugClientConsumerManager - #addConsumer Test");
// );

// var  meldbugClientConsumerManagerFactoryConsumerTest = {

//     //-------------------------------------------------------------------------------
//     // Setup Test
//     //-------------------------------------------------------------------------------

//     setup: function(test) {

//     },

//     //-------------------------------------------------------------------------------
//     // Run Test
//     //-------------------------------------------------------------------------------

//     test: function(test) {

//     }
// };
// bugmeta.annotate(meldbugClientConsumerManagerFactoryConsumerTest).with(
//     test().name("MeldbugClientConsumerManager - #factoryConsumer Test");
// );

// var  meldbugClientConsumerManagerGetConsumerForCallManagerTest= {

//     //-------------------------------------------------------------------------------
//     // Setup Test
//     //-------------------------------------------------------------------------------

//     setup: function(test) {

//     },

//     //-------------------------------------------------------------------------------
//     // Run Test
//     //-------------------------------------------------------------------------------

//     test: function(test) {

//     }
// };
// bugmeta.annotate(meldbugClientConsumerManagerGetConsumerForCallManagerTest).with(
//     test().name("MeldbugClientConsumerManager - #getConsumerForCallManager Test");
// );

// var  meldbugClientConsumerManagerHasConsumerForCallManagerTest= {

//     //-------------------------------------------------------------------------------
//     // Setup Test
//     //-------------------------------------------------------------------------------

//     setup: function(test) {

//     },

//     //-------------------------------------------------------------------------------
//     // Run Test
//     //-------------------------------------------------------------------------------

//     test: function(test) {

//     }
// };
// bugmeta.annotate(meldbugClientConsumerManagerHasConsumerForCallManagerTest).with(
//     test().name("MeldbugClientConsumerManager - #hasConsumerForCallManager Test");
// );

// var  meldbugClientConsumerManagerRemoveConsumerForCallManagerTest= {

//     //-------------------------------------------------------------------------------
//     // Setup Test
//     //-------------------------------------------------------------------------------

//     setup: function(test) {

//     },

//     //-------------------------------------------------------------------------------
//     // Run Test
//     //-------------------------------------------------------------------------------

//     test: function(test) {

//     }
// };
// bugmeta.annotate(meldbugClientConsumerManagerRemoveConsumerForCallManagerTest).with(
//     test().name("MeldbugClientConsumerManager - #removeConsumerForCallManager Test");
// );
