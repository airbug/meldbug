//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var TestAnnotation                  = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                         = BugMeta.context();
var test                            = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

// var  meldMirrorStoreAddMeldKeyAndReasonForCallManagerTest = {

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
// bugmeta.annotate(meldMirrorStoreAddMeldKeyAndReasonForCallManagerTest).with(
//     test().name("MeldMirrorStore - #addMeldKeyAndReasonForCallManager Test");
// );

// var  meldMirrorStoreAddMeldKeyForMirrorTest = {

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
// bugmeta.annotate(meldMirrorStoreAddMeldKeyForMirrorTest).with(
//     test().name("MeldMirrorStore - #addMeldKeyForMirror Test");
// );

// var  meldMirrorStoreAddMeldMirrorTest = {

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
// bugmeta.annotate(meldMirrorStoreAddMeldMirrorTest).with(
//     test().name("MeldMirrorStore - #addMeldMirror Test");
// );

// var  meldMirrorStoreGetMeldMirrorForCallManagerTest = {

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
// bugmeta.annotate(meldMirrorStoreGetMeldMirrorForCallManagerTest).with(
//     test().name("MeldMirrorStore - #getMeldMirrorForCallManager Test");
// );

// var  meldMirrorStoreGetMeldMirrorSetForMeldKeyTest = {

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
// bugmeta.annotate(meldMirrorStoreGetMeldMirrorSetForMeldKeyTest).with(
//     test().name("MeldMirrorStore - #getMeldMirrorSetForMeldKey Test");
// );

// var  meldMirrorStoreHasCallManagerTest = {

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
// bugmeta.annotate(meldMirrorStoreHasCallManagerTest).with(
//     test().name("MeldMirrorStore - #hasCallManager Test");
// );

// var  meldMirrorStoreRemoveMeldMirrorForCallManagerTest = {

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
// bugmeta.annotate(meldMirrorStoreRemoveMeldMirrorForCallManagerTest).with(
//     test().name("MeldMirrorStore - #removeMeldMirrorForCallManager Test");
// );

// var  meldMirrorStoreRemoveMeldKeyAndReasonForCallManagerTest = {

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
// bugmeta.annotate(meldMirrorStoreRemoveMeldKeyAndReasonForCallManagerTest).with(
//     test().name("MeldMirrorStore - #removeMeldKeyAndReasonForCallManager Test");
// );

// var  meldMirrorStoreRemoveMeldKeyFromMirrorTest = {

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
// bugmeta.annotate(meldMirrorStoreRemoveMeldKeyFromMirrorTest).with(
//     test().name("MeldMirrorStore - #removeMeldKeyFromMirror Test");
// );
