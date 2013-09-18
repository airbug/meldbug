//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugserver')

//@Export('MeldMirrorDocument')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Set')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var EventDispatcher         = bugpack.require('EventDispatcher');
var Set                     = bugpack.require('Set');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldMirrorDocument = Class.extend(EventDispatcher, {

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

        //TODO BRN: This is where we can add MeldMirrorObjects that should track the hash of an object so that we can detect when an object is out of sync
        //NOTE: For now, we're just keeping a list of the keys

        /**
         * @private
         * @type {Set.<MeldKey>}
         */
        this.meldKeySet     = new Set();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Meld} meld
     */
    addMeld: function(meld) {
        this.meldKeySet.add(meld.getMeldKey());
    },

    /**
     * @param {Meld} meld
     * @return {boolean}
     */
    containsMeld: function(meld) {
        return this.meldKeySet.contains(meld.getMeldKey());
    },

    /**
     * @param {MeldKey} meldKey
     */
    containsMeldByKey: function(meldKey) {
        return this.meldKeySet.contains(meldKey);
    },

    /**
     * @param {MeldKey} meldKey
     * @return {Meld}
     */
    getMeld: function(meldKey) {
        return undefined;
    },

    /**
     * @param {MeldKey} meldKey
     */
    removeMeld: function(meldKey) {
        this.meldKeySet.remove(meldKey);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbugserver.MeldMirrorDocument', MeldMirrorDocument);
