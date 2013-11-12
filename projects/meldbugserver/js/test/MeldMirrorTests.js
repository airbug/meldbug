//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('meldbugserver.MeldMirror')

//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var TestAnnotation                  = bugpack.require('bugunit-annotate.TestAnnotation');
var MeldMirror                      = bugpack.require('meldbugserver.MeldMirror');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                         = BugMeta.context();
var test                            = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

// var  meldMirrorInstantiation = {

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
// bugmeta.annotate(meldMirrorInstantiation).with(
//     test().name("MeldMirror - #instantiation Test");
// );

// var  meldMirrorGetCallManager = {

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
// bugmeta.annotate(meldMirrorGetCallManager).with(
//     test().name("MeldMirror - #getCallManager Test");
// );

// var  meldMirrorGetMeldbugClientConsumer = {

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
// bugmeta.annotate(meldMirrorGetMeldbugClientConsumer).with(
//     test().name("MeldMirror - #getMeldbugClientConsumer Test");
// );

// var  meldMirrorGetMeldMirrorDocument = {

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
// bugmeta.annotate(meldMirrorGetMeldMirrorDocument).with(
//     test().name("MeldMirror - #getMeldMirrorDocument Test");
// );

// var  meldMirrorAddReasonToMeldKey = {

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
// bugmeta.annotate(meldMirrorAddReasonToMeldKey).with(
//     test().name("MeldMirror - #addReasonToMeldKey Test");
// );

// var  meldMirrorCommitMeldTransaction = {

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
// bugmeta.annotate(meldMirrorCommitMeldTransaction).with(
//     test().name("MeldMirror - #commitMeldTransaction Test");
// );

// var  meldMirrorContainsMeldByKey = {

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
// bugmeta.annotate(meldMirrorContainsMeldByKey).with(
//     test().name("MeldMirror - #containsMeldByKey Test");
// );

// var  meldMirrorRemoveReasonFromMeldKey = {

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
// bugmeta.annotate(meldMirrorRemoveReasonFromMeldKey).with(
//     test().name("MeldMirror - #removeReasonFromMeldKey Test");
// );

// var  meldMirrorReasonSetForMeldKeyIsEmpty = {

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
// bugmeta.annotate(meldMirrorReasonSetForMeldKeyIsEmpty).with(
//     test().name("MeldMirror - #reasonSetForMeldKeyIsEmpty Test");
// );
