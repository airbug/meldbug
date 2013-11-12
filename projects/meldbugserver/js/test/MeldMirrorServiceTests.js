//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('meldbugserver.MeldMirrorService')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var TestAnnotation                  = bugpack.require('bugunit-annotate.TestAnnotation');
var MeldMirrorService               = bugpack.require('meldbugserver.MeldMirrorService');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                         = BugMeta.context();
var test                            = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

// var  meldMirrorServiceInstantiationTest = {

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
// bugmeta.annotate(meldMirrorServiceInstantiationTest).with(
//     test().name("MeldMirrorService - instantiation Test");
// );

// var  meldMirrorServiceCreateConsumerTest = {

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
// bugmeta.annotate(meldMirrorServiceCreateConsumerTest).with(
//     test().name("MeldMirrorService - #createConsumer Test");
// );

// var  meldMirrorServiceCreateMeldMirrorTest = {

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
// bugmeta.annotate(meldMirrorServiceCreateMeldMirrorTest).with(
//     test().name("MeldMirrorService - #createMeldMirror Test");
// );

// var  meldMirrorServiceFactoryMeldMirrorTest = {

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
// bugmeta.annotate(meldMirrorServiceFactoryMeldMirrorTest).with(
//     test().name("MeldMirrorService - #factoryMeldMirror Test");
// );

// var  meldMirrorServiceInitializeTest = {

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
// bugmeta.annotate(meldMirrorServiceInitializeTest).with(
//     test().name("MeldMirrorService - #initialize Test");
// );

// var  meldMirrorServiceRemoveConsumerForCallManagerTest = {

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
// bugmeta.annotate(meldMirrorServiceRemoveConsumerForCallManagerTest).with(
//     test().name("MeldMirrorService - #removeConsumerForCallManager Test");
// );

// var  meldMirrorServiceRemoveMeldMirrorForCallManagerTest = {

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
// bugmeta.annotate(meldMirrorServiceRemoveMeldMirrorForCallManagerTest).with(
//     test().name("MeldMirrorService - #removeMeldMirrorForCallManager Test");
// );

// var  meldMirrorServiceHearBugCallServerCallClosedTest = {

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
// bugmeta.annotate(meldMirrorServiceHearBugCallServerCallClosedTest).with(
//     test().name("MeldMirrorService - #hearBugCallServerCallClosed Test");
// );

// var  meldMirrorServiceHearBugCallServerCallOpenedTest = {

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
// bugmeta.annotate(meldMirrorServiceHearBugCallServerCallOpenedTest).with(
//     test().name("MeldMirrorService - #hearBugCallServerCallOpened Test");
// );
