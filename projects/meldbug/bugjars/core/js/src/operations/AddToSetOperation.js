//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('AddToSetOperation')

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

var AddToSetOperation = Class.extend(MeldOperation, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function(meldDocumentKey, path, setValue) {

        this._super(meldDocumentKey, AddToSetOperation.TYPE);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.path           = path;

        /**
         * @private
         * @type {*}
         */
        this.setValue       = setValue;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getPath: function() {
        return this.path;
    },

    /**
     * @return {*}
     */
    getSetValue: function() {
        return this.setValue;
    },


    //-------------------------------------------------------------------------------
    // IClone Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean} deep
     * @return {AddToSetOperation}
     */
    clone: function(deep) {
        var clone = new AddToSetOperation(this.getMeldDocumentKey(), this.getPath(), Obj.clone(this.getSetValue(), deep));
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
        meldDocument.addToSet(this.getPath(), this.getSetValue());
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
AddToSetOperation.TYPE = "AddToSetOperation";


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.AddToSetOperation', AddToSetOperation);
