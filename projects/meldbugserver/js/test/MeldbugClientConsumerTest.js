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


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                         = BugMeta.context();
var test                            = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

// 
// 

// var  meldbugClientConsumerInstantiationTest = {

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
// bugmeta.annotate(meldbugClientConsumerInstantiationTest).with(
//     test().name("MeldbugClientConsumer - instantiation Test");
// );

// var  meldbugClientConsumerGetCallManagerTest = {

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
// bugmeta.annotate(meldbugClientConsumerGetCallManagerTest).with(
//     test().name("MeldbugClientConsumer - #getCallManager Test");
// );

// var  meldbugClientConsumerCommitMeldTransactionTest = {

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
// bugmeta.annotate(meldbugClientConsumerCommitMeldTransactionTest).with(
//     test().name("MeldbugClientConsumer - #commitMeldTransaction Test");
// );
