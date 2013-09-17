//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldKey')

//@Require('Class')
//@Require('IObjectable')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var IObjectable         = bugpack.require('IObjectable');
var Obj                 = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldKey = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function(dataType, id, filterType) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.dataType           = dataType;

        /**
         * @private
         * @type {string}
         */
        this.filterType         = filterType;

        /**
         * @private
         * @type {string}
         */
        this.id                 = id;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getDataType: function() {
        return this.dataType;
    },

    /**
     * @return {string}
     */
    getFilterType: function() {
        return this.filterType;
    },

    /**
     * @return {string}
     */
    getId: function() {
        return this.id;
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, MeldKey)) {
            return (value.getId() === this.getId() && value.getDataType() === this.getDataType() && value.getFilterType() === this.getFilterType());
        }
        return false;
    },

    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[MeldKey]" +
                Obj.hashCode(this.id) + "_" +
                Obj.hashCode(this.dataType) + "_" +
                Obj.hashCode(this.filterType));
        }
        return this._hashCode;
    },


    //-------------------------------------------------------------------------------
    // IObjectable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    toObject: function() {
        return {
            id: this.id,
            dataType: this.dataType,
            filterType: this.filterType
        };
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    toKey: function() {
        return this.id + "_" + this.dataType + "_" + this.filterType;
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(MeldKey, IObjectable);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldKey', MeldKey);
