//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('IMeldEngine')

//@Require('Interface')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Interface = bugpack.require('Interface');


//-------------------------------------------------------------------------------
// Declare Interface
//-------------------------------------------------------------------------------

var IMeldEngine = Interface.declare({

    //-------------------------------------------------------------------------------
    // Interface Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} key
     * @param {
     * @param {function(Error, MeldObject)} callback
     */
    createObject: function(key, data, callback) {},

    /**
     * @private
     * @param {function(Error)} callback
     */
    initialize: function(callback) {},

    /**
     *
     * @param {string} key
     * @param {function(Error, MeldObject)} callback
     */
    loadObject: function(key, callback) {}
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.IMeldEngine', IMeldEngine);
