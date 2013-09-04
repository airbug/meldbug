//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('PropertySetOperation')

//@Require('Class')
//@Require('meldbug.MeldOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var MeldOperation   = bugpack.require('meldbug.MeldOperation');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var PropertySetOperation = Class.extend(MeldOperation, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function(propertyName, propertyValue) {

        this._super(PropertySetOperation.TYPE);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

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
    // IObjectable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    toObject: function() {
        var obj = this._super();
        obj.propertyName = this.propertyName;
        return obj;
    },


    //-------------------------------------------------------------------------------
    // MeldOperation Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {IMeld} meld
     */
    apply: function(meld) {
        meld.setProperty(this.propertyName, this.propertyValue);
    },

    transform: function(operation) {
        //TODO
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @static
 * @const {string}
 */
PropertySetOperation.TYPE = "PropertySetOperation";


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.PropertySetOperation', PropertySetOperation);
