//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbug.RemoveObjectPropertyOperation')

//@Require('Class')
//@Require('bugmarsh.MarshAnnotation');
//@Require('bugmarsh.MarshPropertyAnnotation');
//@Require('bugmeta.BugMeta')
//@Require('meldbug.MeldOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var MarshAnnotation             = bugpack.require('bugmarsh.MarshAnnotation');
var MarshPropertyAnnotation     = bugpack.require('bugmarsh.MarshPropertyAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var MeldOperation               = bugpack.require('meldbug.MeldOperation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var marsh                       = MarshAnnotation.marsh;
var property                    = MarshPropertyAnnotation.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RemoveObjectPropertyOperation = Class.extend(MeldOperation, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {MeldDocumentKey} meldDocumentKey
     * @param {string} path
     * @param {string} propertyName
     */
    _constructor: function(meldDocumentKey, path, propertyName) {

        this._super(meldDocumentKey, RemoveObjectPropertyOperation.TYPE);


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


    //-------------------------------------------------------------------------------
    // IClone Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean=} deep
     * @return {*}
     */
    clone: function(deep) {
        var clone = new RemoveObjectPropertyOperation(this.getMeldDocumentKey(), this.getPath(), this.getPropertyName());
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
        if (meldDocument) {
            meldDocument.removeObjectProperty(this.getPath(), this.getPropertyName());
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
RemoveObjectPropertyOperation.TYPE = "RemoveObjectPropertyOperation";


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(RemoveObjectPropertyOperation).with(
    marsh("RemoveObjectPropertyOperation")
        .properties([
            property("meldDocumentKey"),
            property("path"),
            property("propertyName"),
            property("type"),
            property("uuid")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.RemoveObjectPropertyOperation', RemoveObjectPropertyOperation);
