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

//@Export('meldbug.MeldBuilder')
//@Autoload

//@Require('Class')
//@Require('List')
//@Require('Map')
//@Require('Obj')
//@Require('Pair')
//@Require('Set')
//@Require('TypeUtil')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('meldbug.MeldBucket')
//@Require('meldbug.MeldBucketKey')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldDocumentKey')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var List                = bugpack.require('List');
    var Map                 = bugpack.require('Map');
    var Obj                 = bugpack.require('Obj');
    var Pair                = bugpack.require('Pair');
    var Set                 = bugpack.require('Set');
    var TypeUtil            = bugpack.require('TypeUtil');
    var ArgTag              = bugpack.require('bugioc.ArgTag');
    var ModuleTag           = bugpack.require('bugioc.ModuleTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var MeldBucket          = bugpack.require('meldbug.MeldBucket');
    var MeldBucketKey       = bugpack.require('meldbug.MeldBucketKey');
    var MeldDocument        = bugpack.require('meldbug.MeldDocument');
    var MeldDocumentKey     = bugpack.require('meldbug.MeldDocumentKey');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                 = ArgTag.arg;
    var bugmeta             = BugMeta.context();
    var module              = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var MeldBuilder = Class.extend(Obj, {

        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Marshaller} marshaller
         */
        _constructor: function(marshaller) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Marshaller}
             */
            this.marshaller     = marshaller;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Marshaller}
         */
        getMarshaller: function() {
            return this.marshaller;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {string} type
         * @param {string} callUuid
         * @returns {MeldBucketKey}
         */
        generateMeldBucketKey: function(type, callUuid) {
            return new MeldBucketKey(type, callUuid);
        },

        /**
         * @return {MeldBucket}
         */
        generateMeldBucket: function() {
            return new MeldBucket();
        },

        /**
         * @param {MeldDocumentKey} meldDocumentKey
         * @return {MeldDocument}
         */
        generateMeldDocument: function(meldDocumentKey) {
            return new MeldDocument(meldDocumentKey);
        },

        /**
         * @param {string} type
         * @param {string} id
         * @return {MeldDocumentKey}
         */
        generateMeldDocumentKey: function(type, id) {
            return new MeldDocumentKey(type, id);
        },

        /**
         * @param {*} data
         * @return {string}
         */
        marshalData: function(data) {
            return this.marshaller.marshalData(data);
        },

        /**
         * @param {string} marshalledData
         * @return {*}
         */
        unmarshalData: function(marshalledData) {
            return this.marshaller.unmarshalData(marshalledData);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(MeldBuilder).with(
        module("meldBuilder")
            .args([
                arg().ref("marshaller")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('meldbug.MeldBuilder', MeldBuilder);
});
