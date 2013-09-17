//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldTransaction')

//@Require('Class')
//@Require('IObjectable')
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
var IObjectable     = bugpack.require('IObjectable');
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
     * @return {Object}
     */
    toObject: function() {
        var meldOperationList = [];
        this.meldOperationList.forEach(function(meldOperation) {
            meldOperationList.push(meldOperation.toObject());
        });
        return {
            meldOperationList: meldOperationList
        };
    },


    //-------------------------------------------------------------------------------
    // IObjectable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {MeldOperation} meldOperation
     */
    addMeldOperation: function(meldOperation) {
        this.meldOperationList.add(meldOperation);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(MeldTransaction, IObjectable);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldTransaction', MeldTransaction);
