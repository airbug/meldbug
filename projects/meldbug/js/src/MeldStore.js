//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldStore')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('List')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var EventDispatcher     = bugpack.require('EventDispatcher');
var List                = bugpack.require('List');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldStore = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function(meldBucket) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MeldBucket}
         */
        this.meldBucket    = meldBucket;

        this.initialize();
    },



    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {MeldBucket}
     */
    getMeldBucket: function() {
        return this.meldBucket;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {MeldTransaction} meldTransaction
     * @param {function(Error)} callback
     */
    commitMeldTransaction: function(meldTransaction, callback) {
        var _this = this;
        var meldList = new List();

        meldTransaction.getMeldOperationList().forEach(function(meldOperation) {
            var meld = meldOperation.commit(_this.meldBucket);
            meldList.add(meld);
        });

        meldList.forEach(function(meld) {
            meld.commit();
        });

        callback();
    },

    /**
     * @param {MeldKey} meldKey
     * @return {boolean}
     */
    containsMeldByKey: function(meldKey) {
        return this.meldBucket.containsMeldByKey(meldKey);
    },

    /**
     * @param {MeldKey} meldKey
     * @return {Meld}
     */
    getMeld: function(meldKey) {
        return this.meldBucket.getMeld(meldKey);
    },

    /**
     * @param {(List.<MeldKey> | Array.<MeldKey>} meldKeys
     * @return {List.<Meld>}
     */
    getEachMeld: function(meldKeys) {
        var _this = this;
        var meldList = new List();
        meldKeys.forEach(function(meldKey) {
            meldList.add(_this.getMeld(meldKey));
        });
        return meldList;
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    initialize: function() {
        this.meldBucket.setParentPropagator(this);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldStore', MeldStore);
