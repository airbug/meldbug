//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldStoreDelegate')

//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('meldbug.MeldBucket')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.RemoveObjectPropertyOperation')
//@Require('meldbug.SetObjectPropertyOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Obj                         = bugpack.require('Obj');
var Set                         = bugpack.require('Set');
var MeldBucket                = bugpack.require('meldbug.MeldBucket');
var MeldDocument                  = bugpack.require('meldbug.MeldDocument');
var RemoveObjectPropertyOperation     = bugpack.require('meldbug.RemoveObjectPropertyOperation');
var SetObjectPropertyOperation        = bugpack.require('meldbug.SetObjectPropertyOperation');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldStoreDelegate = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function(meldStore) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MeldBucket}
         */
        this.meldBucket           = new MeldBucket();

        /**
         * @private
         * @type {Set.<MeldKey>}
         */
        this.meldKeyRetrievedSet    = new Set();

        /**
         * @private
         * @type {MeldStore}
         */
        this.meldStore              = meldStore;

        this.initialize();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {MeldKey} meldKey
     * @return {boolean}
     */
    containsMeldByKey: function(meldKey) {
        this.ensureMeldKeyRetrieved(meldKey);
        return this.meldBucket.containsMeldByKey(meldKey);
    },

    /**
     * @param {MeldKey} meldKey
     * @return {Meld}
     */
    getMeld: function(meldKey) {
        this.ensureMeldKeyRetrieved(meldKey);
        return this.meldBucket.getMeld(meldKey);
    },

    /**
     * @param {Meld} meld
     */
    meldMeld: function(meld) {
        this.ensureMeldKeyRetrieved(meld.getMeldKey());
        this.meldBucket.meldMeld(meld);
    },

    /**
     * @param {MeldKey} meldKey
     */
    removeMeld: function(meldKey) {
        this.ensureMeldKeyRetrieved(meldKey);
        var meld = this.getMeld(meldKey);
        if (meld) {
            this.meldBucket.unmeldMeld(meld);
        }
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {MeldKey} meldKey
     */
    ensureMeldKeyRetrieved: function(meldKey) {

        // TODO BRN: This doesn't quite work since the meldStore could change out from under us...
        // TODO BRN: Instead, the delegate should only interact with the store at a specific revision so that it does not interact with any new changes

        if (!this.meldKeyRetrievedSet.contains(meldKey)) {
            if (this.meldStore.containsMeldByKey(meldKey)) {
                var meld = this.meldStore.getMeld(meldKey).clone();
                this.meldBucket.addMeld(meld);
            }
            this.meldKeyRetrievedSet.add(meldKey);
        }
    },

    /**
     * @private
     */
    initialize: function() {
        this.meldBucket.setParentPropagator(this);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldStoreDelegate', MeldStoreDelegate);
