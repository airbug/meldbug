//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('SetObjectPropertyOperation')

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

var SetObjectPropertyOperation = Class.extend(MeldOperation, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {MeldDocumentKey} meldDocumentKey
     * @param {string} path
     * @param {string} propertyName
     * @param {*} propertyValue
     */
    _constructor: function(meldDocumentKey, path, propertyName, propertyValue) {

        this._super(meldDocumentKey, SetObjectPropertyOperation.TYPE);


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
         * @type {string}
         */
        this.propertyName   = propertyName;

        /**
         * @private
         * @type {*}
         */
        this.propertyValue  = propertyValue;
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
     * @return {string}
     */
    getPropertyName: function() {
        return this.propertyName;
    },

    /**
     * @return {*}
     */
    getPropertyValue: function() {
        return this.propertyValue;
    },


    //-------------------------------------------------------------------------------
    // IClone Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean=} deep
     * @return {SetObjectPropertyOperation}
     */
    clone: function(deep) {
        var clone = new SetObjectPropertyOperation(this.getMeldDocumentKey(), this.path, this.propertyName, Obj.clone(this.propertyValue, deep));
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
        meldDocument.setObjectProperty(this.getPath(), this.getPropertyName(), this.getPropertyValue());
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
SetObjectPropertyOperation.TYPE = "SetObjectPropertyOperation";


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.SetObjectPropertyOperation', SetObjectPropertyOperation);