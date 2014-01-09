//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('RemoveMeldDocumentOperation')

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

var RemoveMeldDocumentOperation = Class.extend(MeldBucketOperation, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {MeldDocumentKey} meldDocumentKey
     */
    _constructor: function(meldDocumentKey) {

        this._super(meldDocumentKey, RemoveMeldDocumentOperation.TYPE);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------
    },


    //-------------------------------------------------------------------------------
    // IClone Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean} deep
     * @return {RemoveMeldDocumentOperation}
     */
    clone: function(deep) {
        var clone = new RemoveMeldDocumentOperation(this.getMeldDocumentKey());
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
        return meldBucket.removeMeldDocumentByMeldDocumentKey(this.getMeldDocumentKey());
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @static
 * @const {string}
 */
RemoveMeldDocumentOperation.TYPE = "RemoveMeldDocumentOperation";


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.RemoveMeldDocumentOperation', RemoveMeldDocumentOperation);
