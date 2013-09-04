//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldObject')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('IObjectable')
//@Require('List')
//@Require('Map')
//@Require('meldbug.PropertyChange')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Event               = bugpack.require('Event');
var EventDispatcher     = bugpack.require('EventDispatcher');
var IObjectable         = bugpack.require('IObjectable');
var List                = bugpack.require('List');
var Map                 = bugpack.require('Map');
var PropertyChange      = bugpack.require('meldbug.PropertyChange');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldObject = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function(meldId) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.meldId                 = meldId;

        /**
         * @private
         * @type {List.<MeldOperation>}
         */
        this.operationList          = new List();

        /**
         * @private
         * @type {Map.<string, PropertyChange>}
         */
        this.propertyChangeMap      = new Map();

        /**
         * @private
         * @type {Map.<string, *>}
         */
        this.propertyMap            = new Map();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getMeldId: function() {
        return this.meldId;
    },


    //-------------------------------------------------------------------------------
    // IMeld Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {number} revision
     * @param {MeldOperation} operation
     */
    applyOperation: function(revision, operation) {
        var _this = this;
        if (revision < 0 || revision > _this.operationList.getCount()) {
            throw new Error("operation revision not in history");
        }
        var concurrentOperationList = _this.operationList.subList(revision);
        concurrentOperationList.forEach(function(concurrentOperation) {
            operation.transform(concurrentOperation);
        });
        operation.apply(this);
        _this.operationList.add(operation);
    },


    //-------------------------------------------------------------------------------
    // IObjectable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    toObject: function() {
        var operationList = [];
        this.operationList.forEach(function(operation) {
            operationList.push(operation.toObject());
        });
        return {
            meldId: this.meldId,
            operationList: operationList
        };
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    commitPropertyChanges: function() {
        var _this = this;
        this.dispatchEvent(new Event(MeldObject.EventTypes.PROPERTY_CHANGES, {
            changeMap: this.propertyChangeMap
        }));
        this.propertyChangeMap.forEach(function(propertyChange) {
            switch (propertyChange.getChangeType()) {
                case PropertyChange.ChangeTypes.PROPERTY_REMOVED:
                    _this.propertyMap.remove(propertyChange.getPropertyName());
                    break;
                case PropertyChange.ChangeTypes.PROPERTY_SET:
                    var propertyName    = propertyChange.getPropertyName();
                    var propertyValue   = propertyChange.getPropertyValue();
                    _this.propertyMap.put(propertyName, propertyValue);
                    break;
            }
        });
        this.propertyChangeMap.clear();
    },

    /**
     *
     */
    destroy: function() {
        this.dispatchEvent(new Event(MeldObject.DESTROYED));
    },

    /**
     * @return {Object}
     */
    generateObject: function() {
        var obj = {};
        this.propertyMap.forEach(function(value, key) {
            obj[key] = value;
        });
        return obj;
    },

    /**
     * @param {string} propertyName
     * @return {*}
     */
    getProperty: function(propertyName) {
        var propertyValue = undefined;
        if (this.propertyChangeMap.containsKey(propertyName)) {
            var propertyChange = this.propertyChangeMap.get(propertyName);
            switch (propertyChange.getChangeType()) {
                case PropertyChange.ChangeTypes.PROPERTY_REMOVED:
                    //do nothing
                    break;
                case PropertyChange.ChangeTypes.PROPERTY_SET:
                    propertyValue = propertyChange.getPropertyValue();
                    break;
            }
        } else {
            propertyValue = this.propertyMap.get(propertyName);
        }
        return propertyValue;
    },

    /**
     * @param {string} propertyName
     */
    removeProperty: function(propertyName) {
        var previousValue = this.propertyMap.get(propertyName);
        var propertyChange = new PropertyChange(PropertyChange.ChangeTypes.PROPERTY_REMOVED, propertyName,
            previousValue);
        this.propertyChangeMap.put(propertyName, propertyChange);
    },

    /**
     * @param {string} propertyName
     * @param {*} propertyValue
     */
    setProperty: function(propertyName, propertyValue) {
        var previousValue = this.propertyMap.get(propertyName);
        var propertyChange = new PropertyChange(PropertyChange.ChangeTypes.PROPERTY_SET, propertyName,
            previousValue, propertyValue);
        this.propertyChangeMap.put(propertyName, propertyChange);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(MeldObject, IObjectable);


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @static
 * @type {Object}
 */
MeldObject.EventTypes = {
    DESTROYED: "MeldObject:Destroyed",
    PROPERTY_CHANGES: "MeldObject:PropertyChanges"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldObject', MeldObject);
