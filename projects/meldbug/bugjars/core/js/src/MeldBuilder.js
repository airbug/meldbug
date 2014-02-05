//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldBuilder')
//@Autoload

//@Require('Class')
//@Require('List')
//@Require('Map')
//@Require('Obj')
//@Require('Pair')
//@Require('Set')
//@Require('TypeUtil')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('meldbug.PutMeldDocumentOperation')
//@Require('meldbug.AddToSetOperation')
//@Require('meldbug.MeldBucketKey')
//@Require('meldbug.MeldBucket')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldDocumentKey')
//@Require('meldbug.MeldTransaction')
//@Require('meldbug.MergeDocumentOperation')
//@Require('meldbug.RemoveFromSetOperation')
//@Require('meldbug.RemoveMeldDocumentOperation')
//@Require('meldbug.RemoveObjectPropertyOperation')
//@Require('meldbug.SetDocumentOperation')
//@Require('meldbug.SetObjectPropertyOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var List                                = bugpack.require('List');
var Map                                 = bugpack.require('Map');
var Obj                                 = bugpack.require('Obj');
var Pair                                = bugpack.require('Pair');
var Set                                 = bugpack.require('Set');
var TypeUtil                            = bugpack.require('TypeUtil');
var ArgAnnotation                       = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation                    = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                             = bugpack.require('bugmeta.BugMeta');
var PutMeldDocumentOperation            = bugpack.require('meldbug.PutMeldDocumentOperation');
var AddToSetOperation                   = bugpack.require('meldbug.AddToSetOperation');
var MeldBucketKey                       = bugpack.require('meldbug.MeldBucketKey');
var MeldBucket                          = bugpack.require('meldbug.MeldBucket');
var MeldDocument                        = bugpack.require('meldbug.MeldDocument');
var MeldDocumentKey                     = bugpack.require('meldbug.MeldDocumentKey');
var MeldTransaction                     = bugpack.require('meldbug.MeldTransaction');
var MergeDocumentOperation              = bugpack.require('meldbug.MergeDocumentOperation');
var RemoveFromSetOperation              = bugpack.require('meldbug.RemoveFromSetOperation');
var RemoveMeldDocumentOperation         = bugpack.require('meldbug.RemoveMeldDocumentOperation');
var RemoveObjectPropertyOperation       = bugpack.require('meldbug.RemoveObjectPropertyOperation');
var SetDocumentOperation                = bugpack.require('meldbug.SetDocumentOperation');
var SetObjectPropertyOperation          = bugpack.require('meldbug.SetObjectPropertyOperation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                                 = ArgAnnotation.arg;
var bugmeta                             = BugMeta.context();
var module                              = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

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
        // Properties
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


    //-------------------------------------------------------------------------------
    // Build Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {{callUuid: string, type: string}} meldBucketKeyData
     * @return {MeldBucketKey}
     */
    buildMeldBucketKey: function(meldBucketKeyData) {
        return new MeldBucketKey(meldBucketKeyData.type, meldBucketKeyData.callUuid);
    },

    /**
     * @param {MeldBucketKey} meldBucketKey
     * @return {{callUuid: string, type: string}}
     */
    unbuildMeldBucketKey: function(meldBucketKey) {
        return {
            callUuid: meldBucketKey.getCallUuid(),
            type: meldBucketKey.getType()
        };
    },

    /**
     * @param {{ meldDocumentKeyToMeldDocumentMap: Object}} meldBucketData
     * @return {MeldBucket}
     */
    buildMeldBucket: function(meldBucketData) {
        var meldBucket  = this.generateMeldBucket();
        meldBucket.meldDocumentKeyToMeldDocumentMap = this.buildMeldDocumentKeyToMeldDocumentMap(meldBucketData.meldDocumentKeyToMeldDocumentMap);
        return meldBucket;
    },

    /**
     * @param {MeldBucket} meldBucket
     * @return {{meldDocumentKeyToMeldDocumentMap: Object}}
     */
    unbuildMeldBucket: function(meldBucket) {
        return {
            meldDocumentKeyToMeldDocumentMap: this.unbuildMeldDocumentKeyToMeldDocumentMap(meldBucket.getMeldDocumentKeyToMeldDocumentMap())
        };
    },

    /**
     * @param {*} meldDocumentData
     * @return {MeldDocument}
     */
    buildMeldDocument: function(meldDocumentData) {
        var meldDocumentKey         = this.buildMeldDocumentKey(meldDocumentData.meldDocumentKey);
        var meldData                = this.unmarshalData(meldDocumentData.data);
        return new MeldDocument(meldDocumentKey, meldData);
    },

    /**
     * @param {MeldDocument} meldDocument
     * @return {*}
     */
    unbuildMeldDocument: function(meldDocument) {
        return {
            meldDocumentKey: meldDocument.getMeldDocumentKey(),
            data: this.marshalData(meldDocument.getData())
        };
    },

    /**
     * @param {*} meldDocumentKeyData
     * @return {MeldDocumentKey}
     */
    buildMeldDocumentKey: function(meldDocumentKeyData) {
        return new MeldDocumentKey(meldDocumentKeyData.dataType, meldDocumentKeyData.id);
    },

    /**
     * @param {MeldDocumentKey} meldDocumentKey
     * @return {*}
     */
    unbuildMeldDocumentKey: function(meldDocumentKey) {
        return {
            dataType: meldDocumentKey.getDataType(),
            id: meldDocumentKey.getId()
        };
    },

    /**
     * @param {Object} meldDocumentKeyToMeldDocumentMapData
     * @return {Map.<MeldDocumentKey, MeldDocument>}
     */
    buildMeldDocumentKeyToMeldDocumentMap: function(meldDocumentKeyToMeldDocumentMapData) {
        var _this = this;
        var meldDocumentKeyToMeldDocumentMap = new Map();
        Obj.forIn(meldDocumentKeyToMeldDocumentMapData, function(propertyName, propertyValue) {
            var meldDocumentKey = MeldDocumentKey.fromStringKey(propertyName);
            meldDocumentKeyToMeldDocumentMap.put(meldDocumentKey, _this.buildMeldDocument(propertyValue));
        });
        return meldDocumentKeyToMeldDocumentMap;
    },

    /**
     * @param {Map.<MeldDocumentKey, MeldDocument>} meldDocumentKeyToMeldDocumentMap
     * @return {Object}
     */
    unbuildMeldDocumentKeyToMeldDocumentMap: function(meldDocumentKeyToMeldDocumentMap) {
        var _this = this;
        var meldDocumentKeyToMeldDocumentMapData = {};
        meldDocumentKeyToMeldDocumentMap.forEach(function(meldDocument, meldDocumentKey) {
            meldDocumentKeyToMeldDocumentMapData[meldDocumentKey.toStringKey()] = _this.unbuildMeldDocument(meldDocument);
        });
        return meldDocumentKeyToMeldDocumentMapData;
    },

    /**
     * @param {*} meldOperationData
     * @return {MeldOperation}
     */
    buildMeldOperation: function(meldOperationData) {
        var meldOperation = null;
        var meldDocumentKey = this.buildMeldDocumentKey(meldOperationData.meldDocumentKey);
        switch (meldOperationData.type) {
            case PutMeldDocumentOperation.TYPE:
                var meldDocument    = this.buildMeldDocument(meldOperationData.meldDocument);
                meldOperation       = new PutMeldDocumentOperation(meldDocumentKey, meldDocument);
                break;
            case AddToSetOperation.TYPE:
                meldOperation = new AddToSetOperation(meldDocumentKey, meldOperationData.path,
                    this.unmarshalData(meldOperationData.setValue));
                break;
            case MergeDocumentOperation.TYPE:
                meldOperation = new MergeDocumentOperation(meldDocumentKey, this.unmarshalData(meldOperationData.data));
                break;
            case RemoveFromSetOperation.TYPE:
                meldOperation = new RemoveFromSetOperation(meldDocumentKey, meldOperationData.path,
                    this.unmarshalData(meldOperationData.setValue));
                break;
            case RemoveMeldDocumentOperation.TYPE:
                meldOperation = new RemoveMeldDocumentOperation(meldDocumentKey);
                break;
            case RemoveObjectPropertyOperation.TYPE:
                meldOperation = new RemoveObjectPropertyOperation(meldDocumentKey, meldOperationData.path,
                    meldOperationData.propertyName);
                break;
            case SetDocumentOperation.TYPE:
                meldOperation = new SetDocumentOperation(meldDocumentKey, this.unmarshalData(meldOperationData.data));
                break;
            case SetObjectPropertyOperation.TYPE:
                meldOperation = new SetObjectPropertyOperation(meldDocumentKey, meldOperationData.path,
                    meldOperationData.propertyName, this.unmarshalData(meldOperationData.propertyValue));
                break;

        }
        return meldOperation;
    },

    /**
     * @param {MeldOperation} meldOperation
     * @return {*}
     */
    unbuildMeldOperation: function(meldOperation) {
        var meldOperationData = {
            meldDocumentKey: this.unbuildMeldDocumentKey(meldOperation.getMeldDocumentKey()),
            type: meldOperation.getType()
        };
        switch (meldOperation.getType()) {
            case PutMeldDocumentOperation.TYPE:
                meldOperationData.meldDocument = this.unbuildMeldDocument(meldOperation.getMeldDocument());
                break;
            case AddToSetOperation.TYPE:
                meldOperationData.path = meldOperation.getPath();
                meldOperationData.setValue = this.marshalData(meldOperation.getSetValue());
                break;
            case MergeDocumentOperation.TYPE:
                meldOperationData.data = this.marshalData(meldOperation.getData());
                break;
            case RemoveFromSetOperation.TYPE:
                meldOperationData.path = meldOperation.getPath();
                meldOperationData.setValue = this.marshalData(meldOperation.getSetValue());
                break;
            case RemoveMeldDocumentOperation.TYPE:
                //do nothing
                break;
            case RemoveObjectPropertyOperation.TYPE:
                meldOperationData.path = meldOperation.getPath();
                meldOperationData.propertyName = meldOperation.getPropertyName();
                break;
            case SetDocumentOperation.TYPE:
                meldOperationData.data = this.marshalData(meldOperation.getData());
                break;
            case SetObjectPropertyOperation.TYPE:
                meldOperationData.path = meldOperation.getPath();
                meldOperationData.propertyName = meldOperation.getPropertyName();
                meldOperationData.propertyValue = this.marshalData(meldOperation.getPropertyValue());
                break;

        }
        return meldOperationData;
    },

    /**
     * @param {Array.<*>} meldOperationListData
     * @return {List.<MeldOperation>}
     */
    buildMeldOperationList: function(meldOperationListData) {
        var _this = this;
        var meldOperationList = new List();
        meldOperationListData.forEach(function(meldOperationData) {
            var meldOperation = _this.buildMeldOperation(meldOperationData);
            meldOperationList.add(meldOperation);
        });
        return meldOperationList;
    },

    /**
     * @param {List.<MeldOperation>} meldOperationList
     * @return {Array.<*>}
     */
    unbuildMeldOperationList: function(meldOperationList) {
        var _this = this;
        var meldOperationListData = [];
        meldOperationList.forEach(function(meldOperation) {
            meldOperationListData.push(_this.unbuildMeldOperation(meldOperation));
        });
        return meldOperationListData;
    },

    /**
     * @param meldTransactionData
     * @return {MeldTransaction}
     */
    buildMeldTransaction: function(meldTransactionData) {
        var meldTransaction = new MeldTransaction();
        meldTransaction.setMeldOperationList(this.buildMeldOperationList(meldTransactionData.meldOperationList));
        return meldTransaction;
    },

    /**
     * @param {MeldTransaction} meldTransaction
     * @return {*}
     */
    unbuildMeldTransaction: function(meldTransaction) {
        var _this = this;
        var meldOperationList = [];
        meldTransaction.getMeldOperationList().forEach(function(meldOperation) {
            meldOperationList.push(_this.unbuildMeldOperation(meldOperation));
        });
        return {
            meldOperationList: meldOperationList
        };
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {*} data
     * @return {Object}
     */
    marshalData: function(data) {
        return this.marshaller.marshalData(data);
    },

    /**
     * @private
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

bugmeta.annotate(MeldBuilder).with(
    module("meldBuilder")
        .args([
            arg().ref("marshaller")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldBuilder', MeldBuilder);
