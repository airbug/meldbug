//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldClientKey')

//@Require('ArgumentBug')
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

var ArgumentBug         = bugpack.require('ArgumentBug');
var Class               = bugpack.require('Class');
var IObjectable         = bugpack.require('IObjectable');
var Obj                 = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldClientKey = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} callUuid
     */
    _constructor: function(callUuid) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.callUuid           = callUuid;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getCallUuid: function() {
        return this.callUuid;
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, MeldClientKey)) {
            return (value.getCallUuid() === this.getCallUuid());
        }
        return false;
    },

    /**
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[MeldClientKey]" +
                Obj.hashCode(this.callUuid));
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
            callUuid: this.callUuid
        };
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    toStringKey: function() {
        return "meldClient" + ":" + this.callUuid;
    }
});



//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {string} stringKey
 * @returns {MeldClientKey}
 */
MeldClientKey.fromStringKey = function(stringKey) {
    var keyParts = stringKey.split(":");
    if (keyParts.length === 2) {
        var meldClient = keyParts[0];
        var callUuid = keyParts[1];
        if (meldClient === "meldClient") {
            return new MeldClientKey(callUuid);
        } else {
            throw new ArgumentBug(ArgumentBug.ILLEGAL, "stringKey", stringKey, "parameter must in MeldClientKey string format");
        }
    } else {
        throw new ArgumentBug(ArgumentBug.ILLEGAL, "stringKey", stringKey, "parameter must in MeldClientKey string format");
    }
};


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(MeldClientKey, IObjectable);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldClientKey', MeldClientKey);