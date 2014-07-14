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

//@Export('meldbug.RemoveMeldDocumentOperation')

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
    var RemoveMeldDocumentOperation = Class.extend(MeldBucketOperation, {

        _name: "meldbug.RemoveMeldDocumentOperation",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {MeldDocumentKey} meldDocumentKey
         */
        _constructor: function(meldDocumentKey) {

            this._super(meldDocumentKey, RemoveMeldDocumentOperation.TYPE);


            //-------------------------------------------------------------------------------
            // Properties
            //-------------------------------------------------------------------------------
        },


        //-------------------------------------------------------------------------------
        // IClone Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {boolean} deep
         * @return {RemoveMeldDocumentOperation}
         */
        clone: function(deep) {
            var clone = new RemoveMeldDocumentOperation(this.getMeldDocumentKey());
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
            return meldBucket.removeMeldDocumentByMeldDocumentKey(this.getMeldDocumentKey());
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @const {string}
     */
    RemoveMeldDocumentOperation.TYPE = "RemoveMeldDocumentOperation";


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(RemoveMeldDocumentOperation).with(
        marsh("RemoveMeldDocumentOperation")
            .properties([
                property("meldDocumentKey"),
                property("type"),
                property("uuid")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('meldbug.RemoveMeldDocumentOperation', RemoveMeldDocumentOperation);
});
