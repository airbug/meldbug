//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugserver')

//@Export('MeldbugClientConsumerManager')
//@Autoload

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')
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
var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation        = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var MeldbugClientConsumer   = bugpack.require('meldbugserver.MeldbugClientConsumer');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                     = ArgAnnotation.arg;
var bugmeta                 = BugMeta.context();
var module                  = ModuleAnnotation.module;


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
         * @type {Map.<string, MeldbugClientConsumer>}
         */
        this.callUuidToConsumerMap      = new Map();

        /**
         * @private
         * @type {MeldBuilder}
         */
        this.meldBuilder                = meldBuilder;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Map.<string, MeldbugClientConsumer>}
     */
    getCallUuidToConsumerMap: function() {
        return this.callUuidToConsumerMap;
    },

    /**
     * @return {MeldBuilder}
     */
    getMeldBuilder: function() {
        return this.meldBuilder;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {MeldbugClientConsumer} consumer
     */
    addConsumer: function(consumer) {
        this.callUuidToConsumerMap.put(consumer.getCallManager().getCallUuid(), consumer);
    },

    /**
     * @param {BugCallServer} bugCallServer
     * @param {CallManager} callManager
     * @return {MeldbugClientConsumer}
     */
    factoryConsumer: function(bugCallServer, callManager) {
        return new MeldbugClientConsumer(bugCallServer, callManager, this.meldBuilder);
    },

    /**
     * @param {string} callUuid
     * @return {MeldbugClientConsumer}
     */
    getConsumerForCallUuid: function(callUuid) {
        return this.callUuidToConsumerMap.get(callUuid);
    },

    /**
     * @param {string} callUuid
     * @return {boolean}
     */
    hasConsumerForCallUuid: function(callUuid) {
        return this.callUuidToConsumerMap.containsKey(callUuid);
    },

    /**
     * @param {string} callUuid
     */
    removeConsumerForCallUuid: function(callUuid) {
        this.callUuidToConsumerMap.remove(callUuid);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(MeldbugClientConsumerManager).with(
    module("meldbugClientConsumerManager")
        .args([
            arg().ref("meldBuilder")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbugserver.MeldbugClientConsumerManager', MeldbugClientConsumerManager);
