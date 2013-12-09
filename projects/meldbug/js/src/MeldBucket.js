//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldBucket')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Map')
//@Require('meldbug.MeldEvent')
//@Require('meldbug.MeldMeldOperation')
//@Require('meldbug.RemoveMeldOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var EventDispatcher         = bugpack.require('EventDispatcher');
var Map                     = bugpack.require('Map');
var MeldEvent               = bugpack.require('meldbug.MeldEvent');
var MeldMeldOperation       = bugpack.require('meldbug.MeldMeldOperation');
var RemoveMeldOperation     = bugpack.require('meldbug.RemoveMeldOperation');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldBucket = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<MeldKey, Meld>}
         */
        this.meldKeyToMeldMap    = new Map();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Meld} meld
     */
    addMeld: function(meld) {
        if (!this.meldKeyToMeldMap.containsKey(meld.getMeldKey())) {
            meld.setMeldBucket(this);
            meld.setParentPropagator(this);
            this.meldKeyToMeldMap.put(meld.getMeldKey(), meld);
        }
    },

    /**
     * @param {Meld} meld
     * @return {boolean}
     */
    containsMeld: function(meld) {
        return this.meldKeyToMeldMap.containsKey(meld.getMeldKey());
    },

    /**
     * @param {MeldKey} meldKey
     */
    containsMeldByKey: function(meldKey) {
        return this.meldKeyToMeldMap.containsKey(meldKey);
    },

    /**
     * @param {MeldKey} meldKey
     * @return {Meld}
     */
    getMeld: function(meldKey) {
        return this.meldKeyToMeldMap.get(meldKey);
    },

    /**
     * @param {Meld} meld
     */
    meldMeld: function(meld) {
        var operation = new MeldMeldOperation(meld.getMeldKey(), meld);
        this.meldOperation(operation);
    },

    /**
     * @param {MeldKey} meldKey
     * @return {Meld}
     */
    removeMeld: function(meldKey) {
        var meld = this.meldKeyToMeldMap.remove(meldKey);
        meld.setMeldBucket(undefined);
        meld.setParentPropagator(undefined);
        return meld;
    },

    /**
     * @param {Meld} meld
     */
    unmeldMeld: function(meld) {
        if (this.containsMeld(meld)) {
            var operation = new RemoveMeldOperation(meld.getMeldKey(), meld); //NOTE SUNG I believe this should be called UnmeldOperation for consistency.
            this.meldOperation(operation);
        }
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {MeldOperation} meldOperation
     */
    meldOperation: function(meldOperation) {
        meldOperation.commit(this);
        this.dispatchEvent(new MeldEvent(MeldEvent.EventTypes.OPERATION, meldOperation.getMeldKey(), {
            meldOperation: meldOperation
        }));
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldBucket', MeldBucket);
