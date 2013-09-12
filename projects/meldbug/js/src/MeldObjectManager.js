//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldObjectManager')

//@Require('Class')
//@Require('List')
//@Require('Map')
//@Require('Obj')
//@Require('meldbug.MeldObject')
//@Require('meldbug.PropertyRemoveOperation')
//@Require('meldbug.PropertySetOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var List                        = bugpack.require('List')
var Map                         = bugpack.require('Map');
var Obj                         = bugpack.require('Obj');
var MeldObject                  = bugpack.require('meldbug.MeldObject');
var PropertyRemoveOperation     = bugpack.require('meldbug.PropertyRemoveOperation');
var PropertySetOperation        = bugpack.require('meldbug.PropertySetOperation');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldObjectManager = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<string, MeldObject>}
         */
        this.meldIdToMeldObjectMap  = new Map;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {MeldObject} meldObject
     */
    addMeldObject: function(meldObject) {
        if (!this.meldIdToMeldObjectMap.containsKey(meldObject.getMeldId())) {
            this.meldIdToMeldObjectMap.put(meldObject.getMeldId(), meldObject);
        } else {
            throw new Error("MeldObjectManager already has MeldObject by id '" + meldObject.getMeldId() + "'");
        }
    },

    /**
     * @param {string} meldId
     * @param {number} revision
     * @param {List.<MeldOperation>} operationList
     */
    applyOperations: function(meldId, revision, operationList) {
        var meldObject = this.meldIdToMeldObjectMap.get(meldId);
        operationList.forEach(function(meldOperation) {
            meldObject.applyOperation(revision, meldOperation);
        });
        meldObject.commitPropertyChanges();
    },

    /**
     *
     */
    clearCache: function() {
        this.meldIdToMeldObjectMap = new Map();
    },

    /**
     * @param meldId
     * @param meldObjectData
     */
    generateMeldObject: function(meldId, meldObjectData) {
        var _this = this;
        var meldObject = new MeldObject(meldId);
        var operationListData = meldObjectData.operationList;
        var revision = 0;
        operationListData.forEach(function(operationData) {
            var operation = _this.generateOperation(operationData);
            meldObject.applyOperation(revision, operation);
            revision++;
        });
        meldObject.commitPropertyChanges();
    },

    /**
     * @param operationData
     * @return {MeldOperation}
     */
    generateOperation: function(operationData) {
        var operation = undefined;
        switch (operationData.type) {
            case "PropertyRemoveOperation":
                operation = new PropertyRemoveOperation(operationData.propertyName);
                break;
            case "propertySetOperation":
                operation = new PropertySetOperation(operationData.propertyName, operationData.propertyValue);
                break;
        }
        return operation;
    },

    /**
     * @param operationListData
     * @return {MeldOperation}
     */
    generateOperationList: function(operationListData) {
        var _this = this;
        var operationList = new List();
        operationListData.forEach(function(operationData) {
            var operation = _this.generateMeldObject(operationData);
            operationList.add(operation);
        });
        return operationList;
    },

    /**
     * @param {string} meldId
     * @return {MeldObject}
     */
    getMeldObject: function(meldId) {
        return this.meldIdToMeldObjectMap.get(meldId);
    },

    /**
     * @param {Array.<string>} meldIds
     * @return {Array.<Array.<MeldObject>, Array.<string>>}
     */
    getMeldObjects: function(meldIds) {
        var _this = this;
        var meldObjects = [];
        meldIds.forEach(function(meldId){
            meldObjects.push(this.getMeldObject(meldId));
        });
        return meldObjects;
    },

    /**
     * @param {string} meldId
     */
    removeMeldObject: function(meldId) {
        var meldObject = this.meldIdToMeldObjectMap.remove(meldId);
        if (meldObject) {
            meldObject.destroy();
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldObjectManager', MeldObjectManager);
