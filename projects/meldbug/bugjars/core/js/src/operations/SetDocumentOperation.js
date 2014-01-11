//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('SetDocumentOperation')

//@Require('Class')
//@Require('Obj')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var MeldDocument        = bugpack.require('meldbug.MeldDocument');
var MeldOperation       = bugpack.require('meldbug.MeldOperation');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SetDocumentOperation = Class.extend(MeldOperation, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {MeldDocumentKey} meldDocumentKey
     * @param {*} data
     */
    _constructor: function(meldDocumentKey, data) {

        this._super(meldDocumentKey, SetDocumentOperation.TYPE);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {*}
         */
        this.data = data;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {*}
     */
    getData: function() {
        return this.data;
    },


    //-------------------------------------------------------------------------------
    // IClone Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean} deep
     * @return {SetDocumentOperation}
     */
    clone: function(deep) {
        var clone = new SetDocumentOperation(this.getMeldDocumentKey, Obj.clone(this.data, deep));
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
        var meldDocument = meldBucket.getMeldDocumentByMeldDocumentKey(this.getMeldDocumentKey());
        if (!meldDocument) {
            meldDocument = new MeldDocument(this.getMeldDocumentKey());
            meldBucket.addMeldDocument(meldDocument);
        }
        meldDocument.setData(this.data);
        return meldDocument;
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @static
 * @const {string}
 */
SetDocumentOperation.TYPE = "SetDocumentOperation";


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.SetDocumentOperation', SetDocumentOperation);