/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbug.PutMeldDocumentOperation')

//@Require('Class')
//@Require('bugmarsh.MarshTag');
//@Require('bugmarsh.MarshPropertyTag');
//@Require('bugmeta.BugMeta')
//@Require('meldbug.MeldBucketOperation')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var MarshPropertyTag        = bugpack.require('bugmarsh.MarshPropertyTag');
    var MarshTag                = bugpack.require('bugmarsh.MarshTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');
    var MeldBucketOperation     = bugpack.require('meldbug.MeldBucketOperation');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                 = BugMeta.context();
    var marsh                   = MarshTag.marsh;
    var property                = MarshPropertyTag.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MeldBucketOperation}
     */
    var PutMeldDocumentOperation = Class.extend(MeldBucketOperation, {

        _name: "meldbug.PutMeldDocumentOperation",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {MeldDocumentKey} meldDocumentKey
         * @param {MeldDocument} meldDocument
         */
        _constructor: function(meldDocumentKey, meldDocument) {

            this._super(meldDocumentKey, PutMeldDocumentOperation.TYPE);


            //-------------------------------------------------------------------------------
            // Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {MeldDocument}
             */
            this.meldDocument       = meldDocument;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {MeldDocument}
         */
        getMeldDocument: function() {
            return this.meldDocument;
        },


        //-------------------------------------------------------------------------------
        // IClone Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {boolean} deep
         * @return {PutMeldDocumentOperation}
         */
        clone: function(deep) {
            var clone = new PutMeldDocumentOperation(this.getMeldDocumentKey(), this.getMeldDocument().clone(deep));
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
            if (!meldBucket.containsMeldDocument(this.meldDocument)) {
                meldBucket.addMeldDocument(this.meldDocument);
            }
            return this.meldDocument;
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @const {string}
     */
    PutMeldDocumentOperation.TYPE = "PutMeldDocumentOperation";


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(PutMeldDocumentOperation).with(
        marsh("PutMeldDocumentOperation")
            .properties([
                property("meldDocument"),
                property("meldDocumentKey"),
                property("type"),
                property("uuid")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('meldbug.PutMeldDocumentOperation', PutMeldDocumentOperation);
});
