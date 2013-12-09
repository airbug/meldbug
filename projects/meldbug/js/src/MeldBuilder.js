//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldBuilder')

//@Require('Class')
//@Require('List')
//@Require('Obj')
//@Require('Pair')
//@Require('Set')
//@Require('TypeUtil')
//@Require('meldbug.AddToSetOperation')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldKey')
//@Require('meldbug.MeldMeldOperation')
//@Require('meldbug.MeldTransaction')
//@Require('meldbug.RemoveFromSetOperation')
//@Require('meldbug.RemoveMeldOperation')
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
var Obj                                 = bugpack.require('Obj');
var Pair                                = bugpack.require('Pair');
var Set                                 = bugpack.require('Set');
var TypeUtil                            = bugpack.require('TypeUtil');
var AddToSetOperation                   = bugpack.require('meldbug.AddToSetOperation');
var MeldDocument                        = bugpack.require('meldbug.MeldDocument');
var MeldKey                             = bugpack.require('meldbug.MeldKey');
var MeldMeldOperation                   = bugpack.require('meldbug.MeldMeldOperation');
var MeldTransaction                     = bugpack.require('meldbug.MeldTransaction');
var RemoveFromSetOperation              = bugpack.require('meldbug.RemoveFromSetOperation');
var RemoveMeldOperation                 = bugpack.require('meldbug.RemoveMeldOperation');
var RemoveObjectPropertyOperation       = bugpack.require('meldbug.RemoveObjectPropertyOperation');
var SetDocumentOperation                = bugpack.require('meldbug.SetDocumentOperation');
var SetObjectPropertyOperation          = bugpack.require('meldbug.SetObjectPropertyOperation');



//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldBuilder = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} type
     * @param {string} id
     * @return {MeldKey}
     */
    generateMeldKey: function(type, id) {
        return new MeldKey(type, id);
    },

    /**
     * @param {MeldKey} meldKey
     * @return {MeldDocument}
     */
    generateMeldDocument: function(meldKey) {
        return new MeldDocument(meldKey);
    },


    //-------------------------------------------------------------------------------
    // Build Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {*} meldData
     * @return {Meld}
     */
    buildMeld: function(meldData) {
        switch (meldData.meldType) {
            case MeldDocument.TYPE:
                return this.buildMeldDocument(meldData);
                break;
        }
    },

    /**
     * @param {Meld} meld
     * @return {*}
     */
    unbuildMeld: function(meld) {
        switch (meld.getMeldType()) {
            case MeldDocument.TYPE:
                return this.unbuildMeldDocument(meld);
                break;
        }
    },

    /**
     * @param {*} meldDocumentData
     * @return {MeldDocument}
     */
    buildMeldDocument: function(meldDocumentData) {
        var meldKey                 = this.buildMeldKey(meldDocumentData.meldKey);
        var meldData                = this.unmarshalData(meldDocumentData.data);
        var meldDocument            = new MeldDocument(meldKey, meldData);
        var meldOperationList       = this.buildMeldOperationList(meldDocumentData.meldOperationList);
        meldDocument.setMeldOperationList(meldOperationList);
        return meldDocument;
    },

    /**
     * @param {MeldDocument} meldDocument
     * @return {*}
     */
    unbuildMeldDocument: function(meldDocument) {
        return {
            meldKey: meldDocument.getMeldKey(),
            meldType: MeldDocument.TYPE,
            data: this.marshalData(meldDocument.getData()),
            meldOperationList: this.unbuildMeldOperationList(meldDocument.getMeldOperationList())
        };
    },

    /**
     * @param {*} meldKeyData
     * @return {MeldKey}
     */
    buildMeldKey: function(meldKeyData) {
        return new MeldKey(meldKeyData.dataType, meldKeyData.id);
    },

    /**
     * @param {MeldKey} meldKey
     * @return {*}
     */
    unbuildMeldKey: function(meldKey) {
        return {
            dataType: meldKey.getDataType(),
            id: meldKey.getId()
        };
    },

    /**
     * @param {*} meldOperationData
     * @return {MeldOperation}
     */
    buildMeldOperation: function(meldOperationData) {
        var meldOperation = undefined;
        var meldKey = this.buildMeldKey(meldOperationData.meldKey);
        switch (meldOperationData.type) {
            case AddToSetOperation.TYPE:
                meldOperation = new AddToSetOperation(meldKey, meldOperationData.path,
                    this.unmarshalData(meldOperationData.setValue));
                break;
            case MeldMeldOperation.TYPE:
                var meld      = this.buildMeld(meldOperationData.meld);
                meldOperation = new MeldMeldOperation(meldKey, meld);
                break;
            case RemoveFromSetOperation.TYPE:
                meldOperation = new RemoveFromSetOperation(meldKey, meldOperationData.path,
                    this.unmarshalData(meldOperationData.setValue));
                break;
            case RemoveMeldOperation.TYPE:
                meldOperation = new RemoveMeldOperation(meldKey);
                break;
            case RemoveObjectPropertyOperation.TYPE:
                meldOperation = new RemoveObjectPropertyOperation(meldKey, meldOperationData.path,
                    meldOperationData.propertyName);
                break;
            case SetDocumentOperation.TYPE:
                meldOperation = new SetDocumentOperation(meldKey, this.unmarshalData(meldOperationData.data));
                break;
            case SetObjectPropertyOperation.TYPE:
                meldOperation = new SetObjectPropertyOperation(meldKey, meldOperationData.path,
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
            meldKey: this.unbuildMeldKey(meldOperation.getMeldKey()),
            type: meldOperation.getType()
        };
        switch (meldOperation.getType()) {
            case AddToSetOperation.TYPE:
                meldOperationData.path = meldOperation.getPath();
                meldOperationData.setValue = this.marshalData(meldOperation.getSetValue());
                break;
            case MeldMeldOperation.TYPE:
                meldOperationData.meld = this.unbuildMeld(meldOperation.getMeld());
                break;
            case RemoveFromSetOperation.TYPE:
                meldOperationData.path = meldOperation.getPath();
                meldOperationData.setValue = this.marshalData(meldOperation.getSetValue());
                break;
            case RemoveMeldOperation.TYPE:
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
        var _this = this;
        var marshalled = undefined;
        if (TypeUtil.isObject(data)) {
            if (Class.doesExtend(data, Set)) {
                var marshalledSet = [];
                data.forEach(function(value) {
                    marshalledSet.push(_this.marshalData(value));
                });
                marshalled = {
                    type: "Set",
                    value: marshalledSet
                };
            } else if (Class.doesExtend(data, Pair)) {
                var marshalledPair = {
                    a: this.marshalData(data.getA()),
                    b: this.marshalData(data.getB())
                };
                marshalled = {
                    type: "Pair",
                    value: marshalledPair
                };
            } else {
                var marshalledObject = {};
                Obj.forIn(data, function(key, value) {
                    marshalledObject[key] = _this.marshalData(value);
                });
                marshalled = {
                    type: MeldBuilder.TYPES.OBJECT,
                    value: marshalledObject
                };
            }
        } else if (TypeUtil.isArray(data)) {
            var marshalledArray = [];
            data.forEach(function(value) {
                marshalledArray.push(_this.marshalData(value));
            });
            marshalled = {
                type: MeldBuilder.TYPES.ARRAY,
                value: marshalledArray
            };
        } else if (TypeUtil.isBoolean(data)) {
            marshalled = {
                type: MeldBuilder.TYPES.BOOLEAN,
                value: data
            };
        } else if (TypeUtil.isDate(data)) {
            marshalled = {
                type: MeldBuilder.TYPES.DATE,
                value: data.toString()
            };
        } else if (TypeUtil.isNull(data)) {
            marshalled = {
                type: MeldBuilder.TYPES.NULL,
                value: data
            };
        } else if (TypeUtil.isNumber(data)) {
            marshalled = {
                type: MeldBuilder.TYPES.NUMBER,
                value: data
            };
        } else if (TypeUtil.isString(data)) {
            marshalled = {
                type: MeldBuilder.TYPES.STRING,
                value: data
            };
        } else if (TypeUtil.isUndefined(data)) {
            marshalled = {
                type: MeldBuilder.TYPES.UNDEFINED,
                value: data
            };
        } else {
            throw new Error("Unsupported data type cannot be marshalled. data:", data);
        }
        return marshalled;
    },

    /**
     * @private
     * @param {Object} marshalledData
     * @return {*}
     */
    unmarshalData: function(marshalledData) {
        var _this = this;
        var unmarshalled = undefined;
        switch (marshalledData.type) {
            case MeldBuilder.TYPES.ARRAY:
                unmarshalled = [];
                marshalledData.value.forEach(function(value) {
                    unmarshalled.push(_this.unmarshalData(value));
                });
                break;
            case MeldBuilder.TYPES.BOOLEAN:
                unmarshalled = marshalledData.value;
                break;
            case MeldBuilder.TYPES.DATE:
                unmarshalled = new Date(marshalledData.value);
                break;
            case MeldBuilder.TYPES.NULL:
                unmarshalled = marshalledData.value;
                break;
            case MeldBuilder.TYPES.NUMBER:
                unmarshalled = marshalledData.value;
                break;
            case MeldBuilder.TYPES.OBJECT:
                unmarshalled = {};
                Obj.forIn(marshalledData.value, function(key, value) {
                    unmarshalled[key] = _this.unmarshalData(value);
                });
                break;
            case MeldBuilder.TYPES.STRING:
                unmarshalled = marshalledData.value;
                break;
            case MeldBuilder.TYPES.UNDEFINED:
                unmarshalled = marshalledData.value;
                break;
            case "Pair":
                unmarshalled = new Pair(marshalledData.value.a, marshalledData.value.b);
                break;
            case "Set":
                unmarshalled = new Set();
                marshalledData.value.forEach(function(value) {
                    unmarshalled.add(_this.unmarshalData(value));
                });
                break;
        }
        return unmarshalled;
    }
});


//-------------------------------------------------------------------------------
// Static Properties
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
MeldBuilder.TYPES = {
    ARRAY: "array",
    BOOLEAN: "boolean",
    DATE: "date",
    NULL: "null",
    NUMBER: "number",
    OBJECT: "object",
    STRING: "string",
    UNDEFINED: "undefined"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldBuilder', MeldBuilder);
