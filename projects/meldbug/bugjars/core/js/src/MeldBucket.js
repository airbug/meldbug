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

//@Export('meldbug.MeldBucket')
//@Autoload

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('bugmarsh.MarshTag');
//@Require('bugmarsh.MarshPropertyTag');
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Map                 = bugpack.require('Map');
    var Obj                 = bugpack.require('Obj');
    var MarshPropertyTag    = bugpack.require('bugmarsh.MarshPropertyTag');
    var MarshTag            = bugpack.require('bugmarsh.MarshTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');


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
     * @extends {Obj}
     */
    var MeldBucket = Class.extend(Obj, {

        _name: "meldbug.MeldBucket",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {Map.<MeldDocumentKey, MeldDocument>}
             */
            this.meldDocumentKeyToMeldDocumentMap   = new Map();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Map.<MeldDocumentKey, MeldDocument>}
         */
        getMeldDocumentKeyToMeldDocumentMap: function() {
            return this.meldDocumentKeyToMeldDocumentMap;
        },


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {boolean} deep
         * @return {*}
         */
        clone: function(deep) {
            var meldBucket = new MeldBucket();
            this.meldDocumentKeyToMeldDocumentMap.forEach(function(meldDocument) {
                if (deep) {
                    meldBucket.addMeldDocument(Obj.clone(meldDocument, deep));
                } else {
                    meldBucket.addMeldDocument(meldDocument);
                }
            });
            return meldBucket;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {MeldDocument} meldDocument
         */
        addMeldDocument: function(meldDocument) {
            if (!this.meldDocumentKeyToMeldDocumentMap.containsKey(meldDocument.getMeldDocumentKey())) {
                meldDocument.setMeldBucket(this);
                this.meldDocumentKeyToMeldDocumentMap.put(meldDocument.getMeldDocumentKey(), meldDocument);
            }
        },

        /**
         * @param {MeldDocument} meldDocument
         * @return {boolean}
         */
        containsMeldDocument: function(meldDocument) {
            return this.meldDocumentKeyToMeldDocumentMap.containsKey(meldDocument.getMeldDocumentKey());
        },

        /**
         * @param {MeldDocumentKey} meldDocumentKey
         */
        containsMeldDocumentByMeldDocumentKey: function(meldDocumentKey) {
            return this.meldDocumentKeyToMeldDocumentMap.containsKey(meldDocumentKey);
        },

        /**
         * @param {MeldDocumentKey} meldDocumentKey
         * @return {MeldDocument}
         */
        getMeldDocumentByMeldDocumentKey: function(meldDocumentKey) {
            return this.meldDocumentKeyToMeldDocumentMap.get(meldDocumentKey);
        },

        /**
         * @param {MeldDocumentKey} meldDocumentKey
         * @return {MeldDocument}
         */
        removeMeldDocumentByMeldDocumentKey: function(meldDocumentKey) {
            if (this.containsMeldDocumentByMeldDocumentKey(meldDocumentKey)) {
                var meldDocument = this.meldDocumentKeyToMeldDocumentMap.remove(meldDocumentKey);
                meldDocument.setMeldBucket(null);
                return meldDocument;
            }
            return null;
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(MeldBucket).with(
        marsh("MeldBucket")
            .properties([
                property("meldDocumentKeyToMeldDocumentMap")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('meldbug.MeldBucket', MeldBucket);
});
