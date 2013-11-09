//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('Set')
//@Require('Map')
//@Require('EventDispatcher')
//@Require('meldbug.Meld')
//@Require('meldbug.MeldBuilder')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldKey')
//@Require('meldbug.MeldBucket')
//@Require('meldbug.MeldStore')
//@Require('bugcall.CallEvent')
//@Require('meldbugserver.MeldManager')
//@Require('meldbugserver.MeldManagerFactory')
//@Require('meldbugserver.MeldbugClientConsumerManager')
//@Require('meldbugserver.MeldMirrorService')
//@Require('meldbugserver.MeldMirrorStore')
//@Require('meldbugserver.DummyBugCallServer')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Set                             = bugpack.require('Set');
var Map                             = bugpack.require('Map');
var EventDispatcher                 = bugpack.require('EventDispatcher');
var Meld                            = bugpack.require('meldbug.Meld');
var MeldBuilder                     = bugpack.require('meldbug.MeldBuilder');
var MeldDocument                    = bugpack.require('meldbug.MeldDocument');
var MeldKey                         = bugpack.require('meldbug.MeldKey');
var MeldBucket                      = bugpack.require('meldbug.MeldBucket');
var MeldStore                       = bugpack.require('meldbug.MeldStore');
var CallEvent                       = bugpack.require('bugcall.CallEvent');
var MeldMirrorStore                 = bugpack.require('meldbugserver.MeldMirrorStore');
var MeldMirrorService               = bugpack.require('meldbugserver.MeldMirrorService');
var MeldManager                     = bugpack.require('meldbugserver.MeldManager');
var MeldManagerFactory              = bugpack.require('meldbugserver.MeldManagerFactory');
var MeldMirrorService               = bugpack.require('meldbugserver.MeldMirrorService');
var MeldbugClientConsumerManager    = bugpack.require('meldbugserver.MeldbugClientConsumerManager');
var DummyBugCallServer              = bugpack.require('meldbugserver.DummyBugCallServer');
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

var meldManagerTest = {
    
    async: true,

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.bugCallServer                  = new DummyBugCallServer();
        this.callManager                    = { };
        this.data                           = { testSet: new Set(['value1', 'value2']) };
        this.meldKey                        = new MeldKey("array", "basic", "id");
        this.meldDocument                   = new MeldDocument(this.meldKey, this.data);
        this.meldBucket                     = new MeldBucket();
        this.meldStore                      = new MeldStore(this.meldBucket);
        this.meldMirrorStore                = new MeldMirrorStore();
        this.meldBuilder                    = new MeldBuilder();
        this.meldbugClientConsumerManager   = new MeldbugClientConsumerManager(this.meldBuilder);
        this.meldMirrorService              = new MeldMirrorService(this.bugCallServer, this.meldMirrorStore, this.meldbugClientConsumerManager);
        this.meldManagerFactory             = new MeldManagerFactory(this.meldStore, this.meldMirrorStore);
        this.meldManager                    = this.meldManagerFactory.factoryManager();
    },

    test: function(test) {
        this.bugCallServer.connect(this.callManager);
        // TODO: check to make sure a meldMirrorStore was created

        this.meldManager.commitTransaction(function(throwable) {
            test.assertTrue(!throwable);
        });
        test.complete();
    }
};

bugmeta.annotate(meldManagerTest).with(
    test().name("Meld Manager Tests")
);

