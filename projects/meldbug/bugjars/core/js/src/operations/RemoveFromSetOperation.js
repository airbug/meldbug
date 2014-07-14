//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbug.RemoveFromSetOperation')

//@Require('Class')
//@Require('Obj')
//@Require('bugmarsh.MarshTag');
//@Require('bugmarsh.MarshPropertyTag');
//@Require('bugmeta.BugMeta')
//@Require('meldbug.MeldOperation')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var Obj                         = bugpack.require('Obj');
    var MarshTag             = bugpack.require('bugmarsh.MarshTag');
    var MarshPropertyTag     = bugpack.require('bugmarsh.MarshPropertyTag');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');
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

    /**
     * @class
     * @extends {MeldOperation}
     */
    var RemoveFromSetOperation = Class.extend(MeldOperation, {

        _name: "meldbug.RemoveFromSetOperation",


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

    bugmeta.tag(RemoveFromSetOperation).with(
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
});
