//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldBucket')

//@Require('Class')
//@Require('Map')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Map                     = bugpack.require('Map');
var Obj                     = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldBucket = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     */
    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<MeldDocumentKey, MeldDocument>}
         */
        this.meldDocumentKeyToMeldDocumentMap   = new Map();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Map.<MeldDocumentKey, MeldDocument>}
     */
    getMeldDocumentKeyToMeldDocumentMap: function() {
        return this.meldDocumentKeyToMeldDocumentMap;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {MeldDocument} meldDocument
     */
    addMeldDocument: function(meldDocument) {
        if (!this.meldDocumentKeyToMeldDocumentMap.containsKey(meldDocument.getMeldDocumentKey())) {
            meldDocument.setMeldBucket(this);
            this.meldDocumentKeyToMeldDocumentMap.put(meldDocument.getMeldDocumentKey(), meldDocument);
        }
    },

    /**
     * @param {MeldDocument} meldDocument
     * @return {boolean}
     */
    containsMeldDocument: function(meldDocument) {
        return this.meldDocumentKeyToMeldDocumentMap.containsKey(meldDocument.getMeldDocumentKey());
    },

    /**
     * @param {MeldDocumentKey} meldDocumentKey
     */
    containsMeldDocumentByMeldDocumentKey: function(meldDocumentKey) {
        return this.meldDocumentKeyToMeldDocumentMap.containsKey(meldDocumentKey);
    },

    /**
     * @param {MeldDocumentKey} meldDocumentKey
     * @return {MeldDocument}
     */
    getMeldDocumentByMeldDocumentKey: function(meldDocumentKey) {
        return this.meldDocumentKeyToMeldDocumentMap.get(meldDocumentKey);
    },

    /**
     * @param {MeldDocumentKey} meldDocumentKey
     * @return {MeldDocument}
     */
    removeMeldDocumentByMeldDocumentKey: function(meldDocumentKey) {
        if (this.containsMeldDocumentByMeldDocumentKey(meldDocumentKey)) {
            var meldDocument = this.meldDocumentKeyToMeldDocumentMap.remove(meldDocumentKey);
            meldDocument.setMeldBucket(null);
            return meldDocument;
        }
        return null;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldBucket', MeldBucket);
