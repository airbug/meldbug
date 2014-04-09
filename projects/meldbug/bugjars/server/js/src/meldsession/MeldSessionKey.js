//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbug.MeldSessionKey')

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

var MeldSessionKey = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function(sessionId) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.sessionId          = sessionId;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getSessionId: function() {
        return this.sessionId;
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, MeldSessionKey)) {
            return (value.getSessionId() === this.getSessionId());
        }
        return false;
    },

    /**
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[MeldSessionKey]" +
                Obj.hashCode(this.getSessionId));
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
            sessionId: this.id
        };
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    toStringKey: function() {
        return "session:" + this.sessionId;
    }
});



//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {string} stringKey
 * @returns {MeldSessionKey}
 */
MeldSessionKey.fromStringKey = function(stringKey) {
    var keyParts = stringKey.split(":");
    if (keyParts.length === 2) {
        var id = keyParts[1];
        return new MeldSessionKey(id);
    } else {
        throw new ArgumentBug(ArgumentBug.ILLEGAL, "stringKey", stringKey, "parameter must in MeldSessionKey string format");
    }
};


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(MeldSessionKey, IObjectable);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldSessionKey', MeldSessionKey);
