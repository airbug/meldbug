//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('SetDocumentOperation')

//@Require('Class')
//@Require('Obj')
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
var MeldOperation       = bugpack.require('meldbug.MeldOperation');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SetDocumentOperation = Class.extend(MeldOperation, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function(meldKey, data) {

        this._super(meldKey, SetDocumentOperation.TYPE);


        //-------------------------------------------------------------------------------
        // Properties
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
     * @return {*}
     */
    clone: function(deep) {
        var clone = new SetDocumentOperation(this.meldKey, Obj.clone(this.data, deep));
        clone.setUuid(this.uuid);
        clone.setPreviousOperationUuid(this.previousOperationUuid);
        return clone;
    },


    //-------------------------------------------------------------------------------
    // MeldOperation Implementation
    //-------------------------------------------------------------------------------

    /**
     * @override
     * @param {MeldBucket} meldBucket
     * @return {Meld}
     */
    apply: function(meldBucket) {
        var meldDocument = meldBucket.getMeld(this.meldKey);
        if (meldDocument) {
            meldDocument.setData(this.data);
        }
        return meldDocument;
    },

    /**
     * @param {MeldOperation} meldOperation
     */
    transform: function(meldOperation) {
        //TODO
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
