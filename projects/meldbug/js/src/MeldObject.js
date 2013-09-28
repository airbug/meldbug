//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldObject')

//@Require('Class')
//@Require('Event')
//@Require('bugdelta.DeltaObject')
//@Require('meldbug.Meld')
//@Require('meldbug.PropertyRemoveOperation')
//@Require('meldbug.PropertySetOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Event                       = bugpack.require('Event');
var IClone                      = bugpack.require('IClone');
var DeltaObject                 = bugpack.require('bugdelta.DeltaObject');
var Meld                        = bugpack.require('meldbug.Meld');
var PropertyRemoveOperation     = bugpack.require('meldbug.PropertyRemoveOperation');
var PropertySetOperation        = bugpack.require('meldbug.PropertySetOperation');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldObject = Class.extend(Meld, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function(meldKey) {

        this._super(meldKey, MeldObject.TYPE);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {DeltaObject}
         */
        this.deltaObject            = new DeltaObject();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {DeltaObject}
     */
    getDeltaObject: function() {
        return this.deltaObject;
    },


    //-------------------------------------------------------------------------------
    // IClone Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean} deep
     * @return {*}
     */
    clone: function(deep) {
        var meldObject = new MeldObject(this.meldKey, this.meldType);
        meldObject.getMeldOperationList().addAll(this.meldOperationList);
        meldObject.deltaObject = this.deltaObject.clone();
        return meldObject;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    commit: function() {
        var _this = this;
        this.dispatchEvent(new Event(MeldObject.EventTypes.PROPERTY_CHANGES, {
            changeMap: this.deltaObject.getPropertyChangeMap()
        }));
        this.deltaObject.commitChanges();
    },

    /**
     * @return {Object}
     */
    generateObject: function() {
        return this.deltaObject.toObject();
    },

    /**
     * @param {string} propertyName
     * @return {*}
     */
    getProperty: function(propertyName) {
        return this.deltaObject.getProperty(propertyName);
    },

    /**
     * @param {string} propertyName
     * @param {*} propertyValue
     */
    meldProperty: function(propertyName, propertyValue) {
        var operation = new PropertySetOperation(propertyName, propertyValue);
        this.meldOperation(operation);
    },

    /**
     * @param {string} propertyName
     */
    removeProperty: function(propertyName) {
        this.deltaObject.removeProperty(this.propertyName);
    },

    /**
     * @param {string} propertyName
     * @param {*} propertyValue
     */
    setProperty: function(propertyName, propertyValue) {
        this.deltaObject.setProperty(propertyName, propertyValue);
    },

    /**
     * @param {string} propertyName
     */
    unmeldProperty: function(propertyName) {
        var operation = new PropertyRemoveOperation(this.meldKey, propertyName);
        this.meldOperation(operation);
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @static
 * @type {Object}
 */
MeldObject.EventTypes = {
    PROPERTY_CHANGES: "MeldObject:PropertyChanges"
};

/**
 * @static
 * @const {string}
 */
MeldObject.TYPE = "MeldObject";


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldObject', MeldObject);
