//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldTransaction')

//@Require('Class')
//@Require('List')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var List            = bugpack.require('List');
var Obj             = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldTransaction = Class.extend(Obj, {

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
         * @type {List.<MeldOperation>}
         */
        this.meldOperationList          = new List();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {List.<MeldOperation>}
     */
    getMeldOperationList: function() {
        return this.meldOperationList;
    },

    /**
     * @param {List.<MeldOperation>} meldOperationList
     */
    setMeldOperationList: function(meldOperationList) {
        this.meldOperationList = meldOperationList;
    },


    //-------------------------------------------------------------------------------
    // IObjectable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {MeldOperation} meldOperation
     */
    addMeldOperation: function(meldOperation) {
        this.meldOperationList.add(meldOperation);
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    isEmpty: function() {
        return this.meldOperationList.isEmpty();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldTransaction', MeldTransaction);
