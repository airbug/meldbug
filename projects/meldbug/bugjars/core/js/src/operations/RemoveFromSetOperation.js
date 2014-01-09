//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('RemoveFromSetOperation')

//@Require('Class')
//@Require('Obj')
//@Require('meldbug.MeldOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');
var MeldOperation   = bugpack.require('meldbug.MeldOperation');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RemoveFromSetOperation = Class.extend(MeldOperation, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function(meldDocumentKey, path, setValue) {

        this._super(meldDocumentKey, RemoveFromSetOperation.TYPE);


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
     * @param {boolean=} deep
     * @return {*}
     */
    clone: function(deep) {
        var clone = new RemoveFromSetOperation(this.getMeldDocumentKey(), this.getPath(), Obj.clone(this.getSetValue(), deep));
        clone.setUuid(this.getUuid());
        return clone;
    },


    //-------------------------------------------------------------------------------
    // MeldOperation Implementation
    //-------------------------------------------------------------------------------

    /**
     * @override
     * @param {MeldBucket} meldBucket
     * @return {MeldDocument}
     */
    apply: function(meldBucket) {
        var meldDocument = meldBucket.getMeldDocumentByMeldDocumentKey(this.getMeldDocumentKey());
        if (meldDocument) {
            meldDocument.removeFromSet(this.getPath(), this.getSetValue());
        }
        return meldDocument;
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @const {string}
 */
RemoveFromSetOperation.TYPE = "RemoveFromSetOperation";


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.RemoveFromSetOperation', RemoveFromSetOperation);
