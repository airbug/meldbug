//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugserver')

//@Export('MeldMirrorService')

//@Require('Class')
//@Require('Obj')
//@Require('bugcall.CallEvent')
//@Require('meldbugserver.MeldMirror')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var CallEvent               = bugpack.require('bugcall.CallEvent');
var MeldMirror              = bugpack.require('meldbugserver.MeldMirror');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldMirrorService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {BugCallServer} bugCallServer
     * @param {MeldMirrorStore} meldMirrorStore
     */
    _constructor: function(bugCallServer, meldMirrorStore, meldbugClientConsumerManager) {

        this._super();


        //-------------------------------------------------------------------------------
        // Instance Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BugCallServer}
         */
        this.bugCallServer                  = bugCallServer;

        /**
         * @private
         * @type {MeldbugClientConsumerManager}
         */
        this.meldbugClientConsumerManager   = meldbugClientConsumerManager;

        /**
         * @private
         * @type {MeldMirrorStore}
         */
        this.meldMirrorStore                = meldMirrorStore;

        this.initialize();
    },


    //-------------------------------------------------------------------------------
    // Private Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {CallManager} callManager
     */
    createConsumer: function(callManager) {
        if (!this.meldbugClientConsumerManager.hasConsumerForCallManager(callManager)) {
            var consumer = this.meldbugClientConsumerManager.factoryConsumer(this.bugCallServer, callManager);
            this.meldbugClientConsumerManager.addConsumer(consumer);
        } else {
            throw new Error("CallManager is already contained in the MeldbugClientConsumerManager:", callManager);
        }
    },

    /**
     * @private
     * @param {CallManager} callManager
     */
    createMeldMirror: function(callManager) {
        if (!this.meldMirrorStore.hasCallManager(callManager)) {
            var meldMirror = this.factoryMeldMirror(callManager, this.meldbugClientConsumerManager.getConsumerForCallManager(callManager));
            this.meldMirrorStore.addMeldMirror(meldMirror);
        } else {
            throw new Error("CallManager is already contained in the MeldMirrorManager:", callManager);
        }
    },

    /**
     * @param {CallManager} callManager
     * @param {MeldbugClientConsumerManager} meldbugClientConsumerManager
     * @return {MeldMirror}
     */
    factoryMeldMirror: function(callManager, meldbugClientConsumerManager) {
        return new MeldMirror(callManager, meldbugClientConsumerManager);
    },

    /**
     * @private
     */
    initialize: function() {
        this.bugCallServer.on(CallEvent.OPENED, this.hearBugCallServerCallOpened, this);
        this.bugCallServer.on(CallEvent.CLOSED, this.hearBugCallServerCallClosed, this);
    },

    /**
     * @private
     * @param {CallManager} callManager
     */
    removeConsumerForCallManager: function(callManager) {
        this.meldbugClientConsumerManager.removeConsumerForCallManager(callManager);
    },

    /**
     * @private
     * @param {CallManager} callManager
     */
    removeMeldMirrorForCallManager: function(callManager) {
        this.meldMirrorStore.removeMeldMirrorForCallManager(callManager);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {CallEvent} event
     */
    hearBugCallServerCallClosed: function(event) {
        var data            = event.getData();
        var callManager     = data.callManager;
        this.removeConsumerForCallManager(callManager);
        this.removeMeldMirrorForCallManager(callManager);
    },

    /**
     * @private
     * @param {CallEvent} event
     */
    hearBugCallServerCallOpened: function(event) {
        var data            = event.getData();
        var callManager     = data.callManager;
        this.createConsumer(callManager);
        this.createMeldMirror(callManager);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbugserver.MeldMirrorService', MeldMirrorService);
