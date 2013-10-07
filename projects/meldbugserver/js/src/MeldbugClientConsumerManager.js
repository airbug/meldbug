//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugserver')

//@Export('MeldbugClientConsumerManager')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('meldbugserver.MeldbugClientConsumer')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Map                     = bugpack.require('Map');
var Obj                     = bugpack.require('Obj');
var MeldbugClientConsumer   = bugpack.require('meldbugserver.MeldbugClientConsumer');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldbugClientConsumerManager = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {MeldBuilder} meldBuilder
     */
    _constructor: function(meldBuilder) {

        this._super();


        //-------------------------------------------------------------------------------
        // Instance Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<CallManager, MeldbugClientConsumer>}
         */
        this.callManagerToConsumerMap   = new Map();

        /**
         * @private
         * @type {MeldBuilder}
         */
        this.meldBuilder                = meldBuilder;
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {MeldbugClientConsumer} consumer
     */
    addConsumer: function(consumer) {
        this.callManagerToConsumerMap.put(consumer.getCallManager(), consumer);
    },

    /**
     * @param {BugCallServer} bugCallServer
     * @param {CallManager} callManager
     * @return {MeldbugClientConsumer}
     */
    factoryConsumer: function(bugCallServer, callManager) {
        return new MeldbugClientConsumer(bugCallServer, callManager);
    },

    /**
     * @param {CallManager} callManager
     * @return {ClientCacheConsumer}
     */
    getConsumerForCallManager: function(callManager) {
        return this.callManagerToConsumerMap.get(callManager);
    },

    /**
     * @param {CallManager} callManager
     * @return {boolean}
     */
    hasConsumerForCallManager: function(callManager) {
        return this.callManagerToConsumerMap.containsKey(callManager);
    },

    /**
     * @param {CallManager} callManager
     */
    removeConsumerForCallManager: function(callManager) {
         this.callManagerToConsumerMap.remove(callManager);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbugserver.MeldbugClientConsumerManager', MeldbugClientConsumerManager);
