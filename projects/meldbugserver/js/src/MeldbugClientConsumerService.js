//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugserver')

//@Export('MeldbugClientConsumerService')

//@Require('Class')
//@Require('Obj')
//@Require('bugcall.CallEvent')


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


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldbugClientConsumerService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {BugCallServer} bugCallServer
     * @param {MeldbugClientConsumerManager} meldbugClientConsumerManager
     */
    _constructor: function(bugCallServer, meldbugClientConsumerManager) {

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

        this.initialize();
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {CallManager} callManager
     */
    createConsumer: function(callManager) {
        if (!this.meldbugClientConsumerManager.hasConsumerForCallUuid(callManager.getCallUuid())) {
            var consumer = this.meldbugClientConsumerManager.factoryConsumer(this.bugCallServer, callManager);
            this.meldbugClientConsumerManager.addConsumer(consumer);
        } else {
            throw new Error("CallManager is already contained in the MeldbugClientConsumerManager:", callManager);
        }
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
     * @param {string} callUuid
     */
    removeConsumerForCallUuid: function(callUuid) {
        this.meldbugClientConsumerManager.removeConsumerForCallUuid(callUuid);
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
        this.removeConsumerForCallUuid(callManager.getCallUuid());
    },

    /**
     * @private
     * @param {CallEvent} event
     */
    hearBugCallServerCallOpened: function(event) {
        var data            = event.getData();
        var callManager     = data.callManager;
        this.createConsumer(callManager);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbugserver.MeldbugClientConsumerService', MeldbugClientConsumerService);
