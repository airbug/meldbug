//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbug.AddToSetOperation')

//@Require('Class')
//@Require('Obj')
//@Require('bugmarsh.MarshTag');
//@Require('bugmarsh.MarshPropertyTag');
//@Require('bugmeta.BugMeta')
//@Require('meldbug.MeldDocument')
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
var MarshTag             = bugpack.require('bugmarsh.MarshTag');
var MarshPropertyTag     = bugpack.require('bugmarsh.MarshPropertyTag');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var MeldDocument                = bugpack.require('meldbug.MeldDocument');
var MeldOperation               = bugpack.require('meldbug.MeldOperation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var marsh                       = MarshTag.marsh;
var property                    = MarshPropertyTag.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AddToSetOperation = Class.extend(MeldOperation, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {MeldDocumentKey} meldDocumentKey
     * @param {string} path
     * @param {*} setValue
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
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @const {string}
 */
AddToSetOperation.TYPE = "AddToSetOperation";


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(AddToSetOperation).with(
    marsh("AddToSetOperation")
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

bugpack.export('meldbug.AddToSetOperation', AddToSetOperation);
