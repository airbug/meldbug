//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('PutMeldDocumentOperation')

//@Require('Class')
//@Require('meldbug.MeldBucketOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var MeldBucketOperation     = bugpack.require('meldbug.MeldBucketOperation');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var PutMeldDocumentOperation = Class.extend(MeldBucketOperation, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {MeldDocumentKey} meldDocumentKey
     * @param {MeldDocument} meldDocument
     */
    _constructor: function(meldDocumentKey, meldDocument) {

        this._super(meldDocumentKey, PutMeldDocumentOperation.TYPE);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MeldDocument}
         */
        this.meldDocument       = meldDocument;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {MeldDocument}
     */
    getMeldDocument: function() {
        return this.meldDocument;
    },


    //-------------------------------------------------------------------------------
    // IClone Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean} deep
     * @return {PutMeldDocumentOperation}
     */
    clone: function(deep) {
        var clone = new PutMeldDocumentOperation(this.getMeldDocumentKey(), this.getMeldDocument().clone(deep));
        clone.setUuid(this.getUuid());
        return clone;
    },


    //-------------------------------------------------------------------------------
    // MeldOperation Methods
    //-------------------------------------------------------------------------------

    /**
     * @override
     * @param {MeldBucket} meldBucket
     * @return {MeldDocument}
     */
    apply: function(meldBucket) {
        if (!meldBucket.containsMeldDocument(this.meldDocument)) {
            meldBucket.addMeldDocument(this.meldDocument);
        }
        return this.meldDocument;
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @const {string}
 */
PutMeldDocumentOperation.TYPE = "PutMeldDocumentOperation";


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.PutMeldDocumentOperation', PutMeldDocumentOperation);
