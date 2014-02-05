//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldDocumentKey')

//@Require('ArgumentBug')
//@Require('Class')
//@Require('IObjectable')
//@Require('Obj')
//@Require('bugmarsh.MarshAnnotation');
//@Require('bugmarsh.MarshPropertyAnnotation');
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgumentBug                 = bugpack.require('ArgumentBug');
var Class                       = bugpack.require('Class');
var IObjectable                 = bugpack.require('IObjectable');
var Obj                         = bugpack.require('Obj');
var MarshAnnotation             = bugpack.require('bugmarsh.MarshAnnotation');
var MarshPropertyAnnotation     = bugpack.require('bugmarsh.MarshPropertyAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var marsh                       = MarshAnnotation.marsh;
var property                    = MarshPropertyAnnotation.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
var MeldDocumentKey = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} dataType
     * @param {string} id
     */
    _constructor: function(dataType, id) {

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
        if (Class.doesExtend(value, MeldDocumentKey)) {
            return (value.getId() === this.getId() && value.getDataType() === this.getDataType());
        }
        return false;
    },

    /**
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[MeldDocumentKey]" +
                Obj.hashCode(this.id) + "_" +
                Obj.hashCode(this.dataType));
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
            dataType: this.dataType
        };
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    toStringKey: function() {
        return this.dataType + ":" + this.id;
    }
});



//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {string} stringKey
 * @returns {MeldDocumentKey}
 */
MeldDocumentKey.fromStringKey = function(stringKey) {
    var keyParts = stringKey.split(":");
    if (keyParts.length === 2) {
        var dataType = keyParts[0];
        var id = keyParts[1];
        return new MeldDocumentKey(dataType, id);
    } else {
        throw new ArgumentBug(ArgumentBug.ILLEGAL, "stringKey", stringKey, "parameter must in MeldDocumentKey string format");
    }
};


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(MeldDocumentKey, IObjectable);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(MeldDocumentKey).with(
    marsh("MeldDocumentKey")
        .properties([
            property("dataType"),
            property("id")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldDocumentKey', MeldDocumentKey);
