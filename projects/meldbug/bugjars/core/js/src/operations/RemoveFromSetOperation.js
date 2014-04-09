//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbug.RemoveFromSetOperation')

//@Require('Class')
//@Require('Obj')
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
var Obj                         = bugpack.require('Obj');
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
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(RemoveFromSetOperation).with(
    marsh("RemoveFromSetOperation")
        .properties([
            property("meldDocumentKey"),
            property("path"),
            property("setValue"),
            property("type"),
            property("uuid")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.RemoveFromSetOperation', RemoveFromSetOperation);
