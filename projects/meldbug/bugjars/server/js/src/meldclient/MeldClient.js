//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldClient')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var TypeUtil                = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldClient = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {MeldClientKey} meldClientKey
     * @param {boolean=} active
     * @param {Date=} lastActive
     */
    _constructor: function(meldClientKey, active, lastActive) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {boolean}
         */
        this.active                     = TypeUtil.isBoolean(active) ? active : true;

        /**
         * @private
         * @type {Date}
         */
        this.lastActive                 = TypeUtil.isDate(lastActive) ? lastActive : new Date();

        /**
         * @private
         * @type {MeldClientKey}
         */
        this.meldClientKey              = meldClientKey;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    getActive: function() {
        return this.active;
    },

    /**
     * @returns {boolean}
     */
    isActive: function() {
        return this.getActive();
    },

    /**
     * @param {boolean} active
     */
    setActive: function(active) {
        this.active = active;
    },

    /**
     * @return {Date}
     */
    getLastActive: function() {
        return this.lastActive;
    },

    /**
     * @param {Date} lastActive
     */
    setLastActive: function(lastActive) {
        this.lastActive = lastActive;
    },

    /**
     * @return {MeldClientKey}
     */
    getMeldClientKey: function() {
        return this.meldClientKey;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldClient', MeldClient);