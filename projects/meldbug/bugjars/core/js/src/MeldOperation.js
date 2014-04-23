//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbug.MeldOperation')

//@Require('Class')
//@Require('Obj')
//@Require('UuidGenerator')
//@Require('bugmarsh.MarshAnnotation');
//@Require('bugmarsh.MarshPropertyAnnotation');
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var Obj                         = bugpack.require('Obj');
    var UuidGenerator               = bugpack.require('UuidGenerator');
    var MarshAnnotation             = bugpack.require('bugmarsh.MarshAnnotation');
    var MarshPropertyAnnotation     = bugpack.require('bugmarsh.MarshPropertyAnnotation');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                     = BugMeta.context();
    var marsh                       = MarshAnnotation.marsh;
    var property                    = MarshPropertyAnnotation.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var MeldOperation = Class.extend(Obj, {

        _name: "meldbug.MeldOperation",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {MeldDocumentKey} meldDocumentKey
         * @param {string} type
         */
        _constructor: function(meldDocumentKey, type) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {MeldDocumentKey}
             */
            this.meldDocumentKey        = meldDocumentKey;

            /**
             * @private
             * @type {string}
             */
            this.type                   = type;

            /**
             * @private
             * @type {string}
             */
            this.uuid                   = UuidGenerator.generateUuid();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {MeldDocumentKey}
         */
        getMeldDocumentKey: function() {
            return this.meldDocumentKey;
        },

        /**
         * @return {string}
         */
        getType: function() {
            return this.type;
        },

        /**
         * @return {string}
         */
        getUuid: function() {
            return this.uuid;
        },

        /**
         * @protected
         */
        setUuid: function(uuid) {
            this.uuid = uuid;
        },


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {boolean} deep
         * @return {*}
         */
        clone: function(deep) {
            //abstract
        },


        //-------------------------------------------------------------------------------
        // Abstract Methods
        //-------------------------------------------------------------------------------

        /**
         * @abstract
         * @param {MeldBucket} meldBucket
         * @return {MeldDocument}
         */
        apply: function(meldBucket) {
            return meldBucket.getMeldDocumentByMeldDocumentKey(this.meldDocumentKey);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.annotate(MeldOperation).with(
        marsh("MeldOperation")
            .properties([
                property("meldDocumentKey"),
                property("type"),
                property("uuid")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('meldbug.MeldOperation', MeldOperation);
});
