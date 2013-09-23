//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldBuilder')

//@Require('Class')
//@Require('List')
//@Require('Obj')
//@Require('meldbug.AddMeldOperation')
//@Require('meldbug.MeldKey')
//@Require('meldbug.MeldObject')
//@Require('meldbug.MeldTransaction')
//@Require('meldbug.PropertyRemoveOperation')
//@Require('meldbug.PropertySetOperation')
//@Require('meldbug.RemoveMeldOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var List                        = bugpack.require('List');
var Obj                         = bugpack.require('Obj');
var AddMeldOperation            = bugpack.require('meldbug.AddMeldOperation');
var MeldKey                     = bugpack.require('meldbug.MeldKey');
var MeldObject                  = bugpack.require('meldbug.MeldObject');
var MeldTransaction             = bugpack.require('meldbug.MeldTransaction');
var PropertyRemoveOperation     = bugpack.require('meldbug.PropertyRemoveOperation');
var PropertySetOperation        = bugpack.require('meldbug.PropertySetOperation');
var RemoveMeldOperation         = bugpack.require('meldbug.RemoveMeldOperation');


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
     * @param {string} filter
     * @return {MeldKey}
     */
    generateMeldKey: function(type, id, filter) {
        return new MeldKey(type, id, filter);
    },

    /**
     * @param meldKeyData
     * @return {MeldKey}
     */
    generateMeldKeyFromObject: function(meldKeyData) {
        return new MeldKey(meldKeyData.dataType, meldKeyData.id, meldKeyData.filterType);
    },

    /**
     * @param {} meldData
     * @return {Meld}
     */
    generateMeld: function(meldData) {
        switch (meldData.meldType) {
            case MeldObject.TYPE:
                return this.generateMeldObject(meldData);
                break;
        }
    },

    /**
     * @param meldObjectData
     * @return {MeldObject}
     */
    generateMeldObject: function(meldObjectData) {
        var meldKey                 = this.generateMeldKeyFromObject(meldObjectData.meldKey);
        var meldObject              = new MeldObject(meldKey);
        var meldOperationListData   = meldObjectData.meldOperationList;
        var meldOperationList       = this.generateMeldOperationList(meldOperationListData);
        meldObject.setMeldOperationList(meldOperationList);
        return meldObject;
    },

    /**
     * @param {MeldKey} meldKey
     * @param {Object} object
     * @return {MeldObject}
     */
    generateMeldObjectFromObject: function(meldKey, object) {
        var meldObject = new MeldObject(meldKey);
        var operationList = new List();
        for (var key in object) {
            var value = object[key];
            var operation = new PropertySetOperation(meldKey, key, value);
            operationList.add(operation);
            meldObject.setProperty(key, value);
            meldObject.commit();
        }
        meldObject.setMeldOperationList(operationList);
        return meldObject;
    },

    /**
     * @param meldOperationData
     * @return {MeldOperation}
     */
    generateMeldOperation: function(meldOperationData) {
        var meldOperation = undefined;
        var meldKey = this.generateMeldKey(meldOperationData.meldKey);
        switch (meldOperationData.type) {
            case PropertyRemoveOperation.TYPE:
                meldOperation = new PropertyRemoveOperation(meldKey, meldOperationData.propertyName);
                break;
            case PropertySetOperation.TYPE:
                meldOperation = new PropertySetOperation(meldKey, meldOperationData.propertyName, meldOperationData.propertyValue);
                break;
            case AddMeldOperation.TYPE:
                var meld    = this.generateMeld(meldOperationData.meld);
                meldOperation = new AddMeldOperation(meldKey, meld);
                break;
            case RemoveMeldOperation.TYPE:
                meldOperation = new RemoveMeldOperation(meldKey);
                break;
        }
        return meldOperation;
    },

    /**
     * @param meldOperationListData
     * @return {List.<MeldOperation>}
     */
    generateMeldOperationList: function(meldOperationListData) {
        var _this = this;
        var meldOperationList = new List();
        meldOperationListData.forEach(function(meldOperationData) {
            var meldOperation = _this.generateMeldOperation(meldOperationData);
            meldOperationList.add(meldOperation);
        });
        return meldOperationList;
    },

    /**
     * @param meldTransactionData
     * @return {MeldTransaction}
     */
    generateMeldTransaction: function(meldTransactionData) {
        var meldTransaction = new MeldTransaction();
        meldTransaction.setMeldOperationList(this.generateMeldOperationList(meldTransactionData.meldOperationList));
        return meldTransaction;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldBuilder', MeldBuilder);
