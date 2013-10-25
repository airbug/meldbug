//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugserver')

//@Export('MeldMirrorStore')

//@Require('Class')
//@Require('DualMultiSetMap')
//@Require('Exception')
//@Require('Map')
//@Require('Obj')
//@Require('meldbug.MeldEvent')
//@Require('meldbug.MeldMeldOperation')
//@Require('meldbug.RemoveMeldOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var DualMultiSetMap             = bugpack.require('DualMultiSetMap');
var Exception                   = bugpack.require('Exception');
var Map                         = bugpack.require('Map');
var Obj                         = bugpack.require('Obj');
var MeldEvent                   = bugpack.require('meldbug.MeldEvent');
var MeldMeldOperation           = bugpack.require('meldbug.MeldMeldOperation');
var RemoveMeldOperation         = bugpack.require('meldbug.RemoveMeldOperation');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldMirrorStore = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Instance Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<CallManager, MeldMirror>}
         */
        this.callManagerToMeldMirrorMap     = new Map();

        /**
         * @private
         * @type {DualMultiSetMap.<MeldKey, MeldMirror>}
         */
        this.meldKeyToMeldMirror            = new DualMultiSetMap();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {MeldKey} meldKey
     * @param {string} reason
     * @param {CallManager} callManager
     */
    addMeldKeyAndReasonForCallManager: function(meldKey, reason, callManager) {
        console.log("Inside MeldMirrorStore#addMeldKeyAndReasonForCallManager");
        var meldMirror = this.getMeldMirrorForCallManager(callManager);
        if (meldMirror) {
            meldMirror.addReasonToMeldKey(reason, meldKey);
            this.addMeldKeyForMirror(meldKey, meldMirror);
        } else {
            throw new Error("Could not find MeldMirror for CallManager - callManager:", callManager);
        }
    },

    /**
     * @param {MeldKey} meldKey
     * @param {MeldMirror} meldMirror
     */
    addMeldKeyForMirror: function(meldKey, meldMirror) {
        this.meldKeyToMeldMirror.put(meldKey, meldMirror);
    },

    /**
     * @param {MeldMirror} meldMirror
     */
    addMeldMirror: function(meldMirror) {
        if (!this.hasCallManager(meldMirror.getCallManager())) {
            this.callManagerToMeldMirrorMap.put(meldMirror.getCallManager(), meldMirror);
        }
    },

    /**
     * @param {CallManager} callManager
     * @return {MeldMirror}
     */
    getMeldMirrorForCallManager: function(callManager) {
        return this.callManagerToMeldMirrorMap.get(callManager);
    },

    /**
     * @param {MeldKey} meldKey
     * @return {Set.<MeldMirror>}
     */
    getMeldMirrorSetForMeldKey: function(meldKey) {
        return this.meldKeyToMeldMirror.getValue(meldKey);
    },

    /**
     * @param {CallManager} callManager
     * @return {boolean}
     */
    hasCallManager: function(callManager) {
        return this.callManagerToMeldMirrorMap.containsKey(callManager);
    },

    /**
     * @param {CallManager} callManager
     */
    removeMeldMirrorForCallManager: function(callManager) {
        var meldMirror = this.callManagerToMeldMirrorMap.remove(callManager);
        if (meldMirror) {
            this.meldKeyToMeldMirror.removeByValue(meldMirror);
        }
    },

    /**
     * @param {MeldKey} meldKey
     * @param {string} reason
     * @param {CallManager} callManager
     */
    removeMeldKeyAndReasonForCallManager: function(meldKey, reason, callManager) {
        var meldMirror = this.getMeldMirrorForCallManager(callManager);
        if (meldMirror) {
            meldMirror.removeReasonFromMeldKey(reason, meldKey);
            if(meldMirror.reasonSetForMeldKeyIsEmpty(meldKey)) {
                this.removeMeldKeyFromMirror(meldKey, meldMirror);
            }
        } else {
            throw new Error("Could not find MeldMirror for CallManager - callManager:", callManager);
        }
    },

    /**
     * @param {MeldKey} meldKey
     * @param {string} reason
     * @param {MeldMirror} meldMirror
     */
    removeMeldKeyForMirror: function(meldKey, meldMirror) {
        this.meldKeyToMeldMirror.removeKeyValuePair(meldKey, meldMirror);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbugserver.MeldMirrorStore', MeldMirrorStore);
