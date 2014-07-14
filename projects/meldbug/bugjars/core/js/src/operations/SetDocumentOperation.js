//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbug.SetDocumentOperation')

//@Require('Class')
//@Require('Obj')
//@Require('bugmarsh.MarshTag');
//@Require('bugmarsh.MarshPropertyTag');
//@Require('bugmeta.BugMeta')
//@Require('meldbug.MeldDocument')
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

    /**
     * @class
     * @extends {MeldOperation}
     */
    var SetDocumentOperation = Class.extend(MeldOperation, {

        _name: "meldbug.SetDocumentOperation",


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
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @const {string}
     */
    SetDocumentOperation.TYPE = "SetDocumentOperation";


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(SetDocumentOperation).with(
        marsh("SetDocumentOperation")
            .properties([
                property("data"),
                property("meldDocumentKey"),
                property("type"),
                property("uuid")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('meldbug.SetDocumentOperation', SetDocumentOperation);
});
