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

//@Export('meldbug.MeldTransactionGenerator')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugdelta.DeltaBuilder')
//@Require('bugdelta.DocumentChange')
//@Require('bugdelta.MapChange')
//@Require('bugdelta.ObjectChange')
//@Require('bugdelta.SetChange')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('meldbug.AddToSetOperation')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldTransaction')
//@Require('meldbug.MergeDocumentOperation')
//@Require('meldbug.PutMeldDocumentOperation')
//@Require('meldbug.RemoveFromSetOperation')
//@Require('meldbug.RemoveMeldDocumentOperation')
//@Require('meldbug.RemoveObjectPropertyOperation')
//@Require('meldbug.SetDocumentOperation')
//@Require('meldbug.SetObjectPropertyOperation')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                           = bugpack.require('Class');
    var Obj                             = bugpack.require('Obj');
    var DeltaBuilder                    = bugpack.require('bugdelta.DeltaBuilder');
    var DocumentChange                  = bugpack.require('bugdelta.DocumentChange');
    var MapChange                       = bugpack.require('bugdelta.MapChange');
    var ObjectChange                    = bugpack.require('bugdelta.ObjectChange');
    var SetChange                       = bugpack.require('bugdelta.SetChange');
    var ModuleTag                       = bugpack.require('bugioc.ModuleTag');
    var BugMeta                         = bugpack.require('bugmeta.BugMeta');
    var AddToSetOperation               = bugpack.require('meldbug.AddToSetOperation');
    var MeldDocument                    = bugpack.require('meldbug.MeldDocument');
    var MeldTransaction                 = bugpack.require('meldbug.MeldTransaction');
    var MergeDocumentOperation          = bugpack.require('meldbug.MergeDocumentOperation');
    var PutMeldDocumentOperation        = bugpack.require('meldbug.PutMeldDocumentOperation');
    var RemoveFromSetOperation          = bugpack.require('meldbug.RemoveFromSetOperation');
    var RemoveMeldDocumentOperation     = bugpack.require('meldbug.RemoveMeldDocumentOperation');
    var RemoveObjectPropertyOperation   = bugpack.require('meldbug.RemoveObjectPropertyOperation');
    var SetDocumentOperation            = bugpack.require('meldbug.SetDocumentOperation');
    var SetObjectPropertyOperation      = bugpack.require('meldbug.SetObjectPropertyOperation');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                         = BugMeta.context();
    var module                          = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var MeldTransactionGenerator = Class.extend(Obj, {

        _name: "meldbug.MeldTransactionGenerator",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {DeltaBuilder}
             */
            this.deltaBuilder           = new DeltaBuilder();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {DeltaBuilder}
         */
        getDeltaBuilder: function() {
            return this.deltaBuilder;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {MeldBucket} meldBucket
         * @param {MeldBucket} previousMeldBucket
         * @return {MeldTransaction}
         */
        generateMeldTransactionBetweenMeldBuckets: function(meldBucket, previousMeldBucket) {
            var meldTransaction = new MeldTransaction();
            this.processDiffBetweenBuckets(meldTransaction, meldBucket, previousMeldBucket);
            return meldTransaction;
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {MeldDocumentKey} meldDocumentKey
         * @param {string} path
         * @param {*} setValue
         * @return {AddToSetOperation}
         */
        factoryAddToSetOperation: function(meldDocumentKey, path, setValue) {
            return new AddToSetOperation(meldDocumentKey, path, setValue);
        },

        /**
         * @private
         * @param {MeldDocumentKey} meldDocumentKey
         * @param {*} data
         * @return {MergeDocumentOperation}
         */
        factoryMergeDocumentOperation: function(meldDocumentKey, data) {
            return new MergeDocumentOperation(meldDocumentKey, data);
        },

        /**
         * @private
         * @param {MeldDocumentKey} meldDocumentKey
         * @param {MeldDocument} meldDocument
         * @return {PutMeldDocumentOperation}
         */
        factoryPutMeldDocumentOperation: function(meldDocumentKey, meldDocument) {
            return new PutMeldDocumentOperation(meldDocumentKey, meldDocument);
        },

        /**
         * @private
         * @param {MeldDocumentKey} meldDocumentKey
         * @param {string} path
         * @param {*} setValue
         * @return {RemoveFromSetOperation}
         */
        factoryRemoveFromSetOperation: function(meldDocumentKey, path, setValue) {
            return new RemoveFromSetOperation(meldDocumentKey, path, setValue);
        },

        /**
         * @private
         * @param {MeldDocumentKey} meldDocumentKey
         * @return {RemoveMeldDocumentOperation}
         */
        factoryRemoveMeldDocumentOperation: function(meldDocumentKey) {
            return new RemoveMeldDocumentOperation(meldDocumentKey);
        },

        /**
         * @private
         * @param {MeldDocumentKey} meldDocumentKey
         * @param {string} path
         * @param {string} propertyName
         * @return {RemoveObjectPropertyOperation}
         */
        factoryRemoveObjectPropertyOperation: function(meldDocumentKey, path, propertyName) {
            return new RemoveObjectPropertyOperation(meldDocumentKey, path, propertyName);
        },

        /**
         * @private
         * @param {MeldDocumentKey} meldDocumentKey
         * @param {*} data
         * @return {SetDocumentOperation}
         */
        factorySetDocumentOperation: function(meldDocumentKey, data) {
            return new SetDocumentOperation(meldDocumentKey, data);
        },


        /**
         * @private
         * @param {MeldDocumentKey} meldDocumentKey
         * @param {string} path
         * @param {string} propertyName
         * @param {*} propertyValue
         * @return {SetObjectPropertyOperation}
         */
        factorySetObjectPropertyOperation: function(meldDocumentKey, path, propertyName, propertyValue) {
            return new SetObjectPropertyOperation(meldDocumentKey, path, propertyName, propertyValue);
        },


        /**
         * @private
         * @param {MeldTransaction} meldTransaction
         * @param {Delta} delta
         * @param {MeldDocumentKey} meldDocumentKey
         */
        processMeldDocumentDelta: function(meldTransaction, delta, meldDocumentKey) {
            var _this = this;
            delta.getDeltaChangeList().forEach(function(deltaChange) {
                _this.processDeltaChange(meldTransaction, deltaChange, meldDocumentKey);
            });
        },

        /**
         * @private
         * @param {MeldTransaction} meldTransaction
         * @param {DeltaChange} deltaChange
         * @param {MeldDocumentKey} meldDocumentKey
         */
        processDeltaChange: function(meldTransaction, deltaChange, meldDocumentKey) {
            switch (deltaChange.getChangeType()) {
                case DocumentChange.ChangeTypes.DATA_SET:
                    var setDocumentOperation = this.factorySetDocumentOperation(meldDocumentKey, deltaChange.getData())
                    meldTransaction.addMeldOperation(setDocumentOperation);
                    break;
                case ObjectChange.ChangeTypes.PROPERTY_REMOVED:
                    var removeObjectPropertyOperation = this.factoryRemoveObjectPropertyOperation(meldDocumentKey, deltaChange.getPath(), deltaChange.getPropertyName());
                    meldTransaction.addMeldOperation(removeObjectPropertyOperation);
                    break;
                case ObjectChange.ChangeTypes.PROPERTY_SET:
                    var setObjectPropertyOperation = this.factorySetObjectPropertyOperation(meldDocumentKey, deltaChange.getPath(), deltaChange.getPropertyName(), deltaChange.getPropertyValue());
                    meldTransaction.addMeldOperation(setObjectPropertyOperation);
                    break;
                case SetChange.ChangeTypes.ADDED_TO_SET:
                    var addToSetOperation = this.factoryAddToSetOperation(meldDocumentKey, deltaChange.getPath(), deltaChange.getSetValue());
                    meldTransaction.addMeldOperation(addToSetOperation);
                    break;
                case SetChange.ChangeTypes.REMOVED_FROM_SET:
                    var removeFromSetOperation = this.factoryRemoveFromSetOperation(meldDocumentKey, deltaChange.getPath(), deltaChange.getSetValue());
                    meldTransaction.addMeldOperation(removeFromSetOperation);
                    break;
            }
        },

        /**
         * @private
         * @param {MeldTransaction} meldTransaction
         * @param {MeldDocumentKey} meldDocumentKey
         * @param {MeldDocument} meldDocument
         */
        processMeldDocumentAdded: function(meldTransaction, meldDocumentKey, meldDocument) {
            var putMeldDocumentOperation = this.factoryPutMeldDocumentOperation(meldDocumentKey, meldDocument);
            meldTransaction.addMeldOperation(putMeldDocumentOperation);
        },

        /**
         * @private
         * @param {MeldTransaction} meldTransaction
         * @param {MeldDocumentKey} meldDocumentKey
         */
        processMeldDocumentRemoved: function(meldTransaction, meldDocumentKey) {
            var removeMeldDocumentOperation = this.factoryRemoveMeldDocumentOperation(meldDocumentKey);
            meldTransaction.addMeldOperation(removeMeldDocumentOperation);
        },

        /**
         * @private
         * @param {MeldTransaction} meldTransaction
         * @param {MeldBucket} currentMeldBucket
         * @param {MeldBucket} previousMeldBucket
         */
        processDiffBetweenBuckets: function(meldTransaction, currentMeldBucket, previousMeldBucket) {
            var _this = this;
            previousMeldBucket.getMeldDocumentKeyToMeldDocumentMap().forEach(function(meldDocument, meldDocumentKey) {
                if (!currentMeldBucket.getMeldDocumentKeyToMeldDocumentMap().containsKey(meldDocumentKey)) {
                    _this.processMeldDocumentRemoved(meldTransaction, meldDocumentKey);
                }
            });
            currentMeldBucket.getMeldDocumentKeyToMeldDocumentMap().forEach(function(currentMeldDocument, currentMeldDocumentKey) {
                if (previousMeldBucket.containsMeldDocumentByMeldDocumentKey(currentMeldDocumentKey)) {
                    var previousMeldDocument = previousMeldBucket.getMeldDocumentByMeldDocumentKey(currentMeldDocumentKey);
                    _this.processDiffBetweenDocuments(meldTransaction, currentMeldDocumentKey, currentMeldDocument, previousMeldDocument);
                } else {
                    _this.processMeldDocumentAdded(meldTransaction, currentMeldDocumentKey, currentMeldDocument);
                }
            });
        },

        /**
         * @private
         * @param {MeldTransaction} meldTransaction
         * @param {MeldDocumentKey} meldDocumentKey
         * @param {MeldDocument} currentMeldDocument
         * @param {MeldDocument} previousMeldDocument
         */
        processDiffBetweenDocuments: function(meldTransaction, meldDocumentKey, currentMeldDocument, previousMeldDocument) {
            var delta = this.deltaBuilder.buildDelta(currentMeldDocument, previousMeldDocument);
            this.processMeldDocumentDelta(meldTransaction, delta, meldDocumentKey);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(MeldTransactionGenerator).with(
        module("meldTransactionGenerator")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('meldbug.MeldTransactionGenerator', MeldTransactionGenerator);
});
