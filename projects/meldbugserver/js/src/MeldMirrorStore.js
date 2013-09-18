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
//@Require('meldbug.AddMeldOperation')
//@Require('meldbug.MeldEvent')
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
var AddMeldOperation            = bugpack.require('meldbug.AddMeldOperation');
var MeldEvent                   = bugpack.require('meldbug.MeldEvent');
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
            meldMirror.addEventListener(MeldEvent.EventTypes.OPERATION, this.handleMeldOperation, this);
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
            meldMirror.removeEventListener(MeldEvent.EventTypes.OPERATION, this.handleMeldOperation, this);
        }
    },

    /**
     * @param {MeldKey} meldKey
     * @param {MeldMirror} meldMirror
     */
    removeMeldKeyForMirror: function(meldKey, meldMirror) {
        this.meldKeyToMeldMirror.removeKeyValuePair(meldKey, meldMirror);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {MeldEvent} meldEvent
     */
    handleMeldOperation: function(meldEvent) {
        var meldMirror      = meldEvent.getCurrentTarget();
        var meldOperation   = meldEvent.getData().meldOperation;
        var meldKey         = meldOperation.getMeldKey();
        switch (meldOperation.getType()) {
            case AddMeldOperation.TYPE:
                this.addMeldKeyForMirror(meldKey, meldMirror);
                break;
            case RemoveMeldOperation.TYPE:
                this.removeMeldKeyForMirror(meldKey, meldMirror);
                break;
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbugserver.MeldMirrorStore', MeldMirrorStore);
