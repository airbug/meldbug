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

//@Export('meldbug.SetObjectPropertyOperation')

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

    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var MarshPropertyTag    = bugpack.require('bugmarsh.MarshPropertyTag');
    var MarshTag            = bugpack.require('bugmarsh.MarshTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var MeldDocument        = bugpack.require('meldbug.MeldDocument');
    var MeldOperation       = bugpack.require('meldbug.MeldOperation');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var marsh               = MarshTag.marsh;
    var property            = MarshPropertyTag.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MeldOperation}
     */
    var SetObjectPropertyOperation = Class.extend(MeldOperation, {

        _name: "meldbug.SetObjectPropertyOperation",


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
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @const {string}
     */
    SetObjectPropertyOperation.TYPE = "SetObjectPropertyOperation";


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(SetObjectPropertyOperation).with(
        marsh("SetObjectPropertyOperation")
            .properties([
                property("meldDocumentKey"),
                property("path"),
                property("propertyName"),
                property("propertyValue"),
                property("type"),
                property("uuid")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('meldbug.SetObjectPropertyOperation', SetObjectPropertyOperation);
});
