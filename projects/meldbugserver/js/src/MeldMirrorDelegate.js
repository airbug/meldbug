//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugserver')

//@Export('MeldMirrorStoreDelegate')

//@Require('Class')
//@Require('Map')
//@Require('Set')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Map                     = bugpack.require('Map');
var Set                     = bugpack.require('Set');
var Obj                     = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldMirrorStoreDelegate = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function(meldMirrorStore) {

        this._super();


        //-------------------------------------------------------------------------------
        // Instance Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Set.<CallManager>}
         */
        this.callManagerRetrievedSet        = new Set();

        /**
         * @private
         * @type {Map.<CallManager, MeldMirror>}
         */
        this.callManagerToMeldMirrorMap     = new Map();

        /**
         * @private
         * @type {MeldMirrorStore}
         */
        this.meldMirrorStore                = meldMirrorStore;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {CallManager} callManager
     * @return {MeldMirror}
     */
    getMeldMirrorForCallManager: function(callManager) {
        this.ensureCallManagerRetrieved(callManager);
        return this.callManagerToMeldMirrorMap.get(callManager);
    },

    /**
     * @param {CallManager} callManager
     * @return {boolean}
     */
    hasCallManager: function(callManager) {
        this.ensureCallManagerRetrieved(callManager);
        return this.callManagerToMeldMirrorMap.containsKey(callManager);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {CallManager} callManager
     */
    ensureCallManagerRetrieved: function(callManager) {

        // TODO BRN: This doesn't quite work since the meldStore could change out from under us...
        // TODO BRN: Instead, the delegate should only interact with the store at a specific revision so that it does not interact with any new changes

        if (!this.callManagerRetrievedSet.contains(callManager)) {
            if (this.meldMirrorStore.hasCallManager(callManager)) {
                var meldMirror = this.meldMirrorStore.getMeldMirrorForCallManager(callManager).clone();
                this.callManagerToMeldMirrorMap.put(callManager, meldMirror);
            }
            this.callManagerRetrievedSet.add(callManager);
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbugserver.MeldMirrorStoreDelegate', MeldMirrorStoreDelegate);
