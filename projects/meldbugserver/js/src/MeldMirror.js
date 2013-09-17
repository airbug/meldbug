//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugserver')

//@Export('MeldMirror')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('IClone')
//@Require('Set')
//@Require('meldbug.MirrorEvent')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Event               = bugpack.require('Event');
var EventDispatcher     = bugpack.require('EventDispatcher');
var IClone              = bugpack.require('IClone');
var Set                 = bugpack.require('Set');
var MirrorEvent         = bugpack.require('melbug.MirrorEvent');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldMirror = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function(callManager, meldbugClientConsumerManager) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CallManager}
         */
        this.callManager                    = callManager;

        /**
         * @private
         * @type {MeldbugClientConsumerManager}
         */
        this.meldbugClientConsumerManager   = meldbugClientConsumerManager;

        /**
         * @private
         * @type {Set.<MeldKey>}
         */
        this.meldKeySet                     = new Set();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {CallManager}
     */
    getCallManager: function() {
        return this.callManager;
    },

    /**
     * @return {MeldbugClientConsumerManager}
     */
    getMeldbugClientConsumerManager: function() {
        return this.meldbugClientConsumerManager;
    },

    /**
     * @return {Set.<MeldKey>}
     */
    getMeldKeySet: function() {
        return this.meldKeySet;
    },


    //-------------------------------------------------------------------------------
    // IClone Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean} deep
     * @return {*}
     */
    clone: function(deep) {

        //TODO BRN: Implement "deep" cloning

        var meldMirror = new MeldMirror();
        meldMirror.getMeldKeySet().addAll(this.meldKeySet);
        return meldMirror;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {(Array.<MeldKey> | Collection.<MeldKey>)} meldKeys
     * @return {Set.<MeldKey>}
     */
    addMeldKeys: function(meldKeys) {
        var _this = this;
        var addedMeldKeys = new Set();
        meldKeys.forEach(function(meldKey) {
            var result = _this.meldKeySet.add(meldKey);
            if (result) {
                addedMeldKeys.add(meldKey);
            }
        });
        return addedMeldKeys;
    },

    /**
     * @param {(Array.<MeldKey> | Collection.<MeldKey>)} meldKeys
     * @return {Set.<MeldKey>}
     */
    mirrorMeldKeys: function(meldKeys) {
        var returnedKeySet = this.addMeldKeys(meldKeys);
        if (!returnedKeySet.isEmpty()) {
            this.dispatchEvent(new MirrorEvent(MirrorEvent.EventTypes.MIRROR, returnedKeySet));
        }
        return returnedKeySet;
    },

    /**
     * @param {(Array.<MeldKey> | Collection.<MeldKey>)} meldKeys
     * @return {Set.<MeldKey>}
     */
    removeMeldKeys: function(meldKeys) {
        var _this = this;
        var removedMeldKeys = new Set();
        meldKeys.forEach(function(meldKey) {
            var result = _this.meldKeySet.remove(meldKey);
            if (result) {
                removedMeldKeys.add(meldKey);
            }
        });
        return removedMeldKeys;
    },

    /**
     * @param {(Array.<MeldKey> | Collection.<MeldKey>)} meldKeys
     * @return {Set.<MeldKey>}
     */
    unmirrorMeldKeys: function(meldKeys) {
        var returnedKeySet = this.removeMeldKeys(meldKeys);
        if (!returnedKeySet.isEmpty()) {
            this.dispatchEvent(new MirrorEvent(MirrorEvent.EventTypes.UNMIRROR, returnedKeySet));
        }
        return returnedKeySet;
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(MeldMirror, IClone);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbugserver.MeldMirror', MeldMirror);
