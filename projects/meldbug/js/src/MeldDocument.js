//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldDocument')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Map')
//@Require('meldbug.AddMeldOperation')
//@Require('meldbug.MeldEvent')
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
var AddMeldOperation        = bugpack.require('meldbug.AddMeldOperation');
var MeldEvent               = bugpack.require('meldbug.MeldEvent');
var RemoveMeldOperation     = bugpack.require('meldbug.RemoveMeldOperation');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldDocument = Class.extend(EventDispatcher, {

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
            meld.setMeldDocument(this);
            meld.setParentPropagator(this);
            this.meldKeyToMeldMap.put(meld.getMeldKey(), meld);
        } else {
            throw new Error("MeldStore already has MeldObject by key '" + meld.getMeldKey().toKey() + "'");
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
        if (!this.containsMeld(meld)) {
            var operation = new AddMeldOperation(meld.getMeldKey(), meld);
            this.meldOperation(operation);
        }
    },

    /**
     * @param {MeldKey} meldKey
     * @return {Meld}
     */
    removeMeld: function(meldKey) {
        var meld = this.meldKeyToMeldMap.remove(meldKey);
        meld.setMeldDocument(undefined);
        meld.setParentPropagator(undefined);
        return meld;
    },

    /**
     * @param {Meld} meld
     */
    unmeldMeld: function(meld) {
        if (this.containsMeld(meld)) {
            var operation = new RemoveMeldOperation(meld.getMeldKey(), meld);
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

bugpack.export('meldbug.MeldDocument', MeldDocument);
