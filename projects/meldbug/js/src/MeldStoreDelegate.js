//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldStoreDelegate')

//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldObject')
//@Require('meldbug.PropertyRemoveOperation')
//@Require('meldbug.PropertySetOperation')


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
var MeldDocument                = bugpack.require('meldbug.MeldDocument');
var MeldObject                  = bugpack.require('meldbug.MeldObject');
var PropertyRemoveOperation     = bugpack.require('meldbug.PropertyRemoveOperation');
var PropertySetOperation        = bugpack.require('meldbug.PropertySetOperation');


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
         * @type {MeldDocument}
         */
        this.meldDocument           = new MeldDocument();

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
     * @param {Meld} meld
     */
    addMeld: function(meld) {
        this.ensureMeldKeyRetrieved(meld.getMeldKey());
        if (!this.meldDocument.containsMeldByKey(meld.getMeldKey())) {
            this.meldDocument.meldMeld(meld);
        } else {
            throw new Error("MeldStore already has Meld by key '" + meld.getMeldKey() + "'");
        }
    },

    /**
     * @param {MeldKey} meldKey
     * @return {boolean}
     */
    containsMeldByKey: function(meldKey) {
        this.ensureMeldKeyRetrieved(meldKey);
        return this.meldDocument.containsMeldByKey(meldKey);
    },

    /**
     * @param {MeldKey} meldKey
     * @return {Meld}
     */
    getMeld: function(meldKey) {
        this.ensureMeldKeyRetrieved(meldKey);
        return this.meldDocument.getMeld(meldKey);
    },

    /**
     * @param {MeldKey} meldKey
     */
    removeMeldObject: function(meldKey) {
        this.ensureMeldKeyRetrieved(meldKey);
        var meld = this.getMeld(meldKey);
        if (meld) {
            this.meldDocument.unmeldMeld(meld);
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
                this.meldDocument.addMeld(meld);
            }
            this.meldKeyRetrievedSet.add(meldKey);
        }
    },

    /**
     * @private
     */
    initialize: function() {
        this.meldDocument.setParentPropagator(this);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldStoreDelegate', MeldStoreDelegate);
