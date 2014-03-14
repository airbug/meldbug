//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldStore')

//@Require('Class')
//@Require('List')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var List                = bugpack.require('List');
var Obj                 = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldStore = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {MeldBucket} meldBucket
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
     * @returns {List}
     */
    applyMeldTransaction: function(meldTransaction) {
        var _this               = this;
        var meldDocumentList    = new List();
        meldTransaction.getMeldOperationList().forEach(function(meldOperation) {
            var meldDocument = meldOperation.apply(_this.meldBucket);
            if (meldDocument) {
                meldDocumentList.add(meldDocument);
            }
        });
        return meldDocumentList;
    },

    /**
     * @param {MeldTransaction} meldTransaction
     * @param {function(Throwable=)} callback
     */
    commitMeldTransaction: function(meldTransaction, callback) {
        var meldDocumentList = this.applyMeldTransaction(meldTransaction);
        meldDocumentList.forEach(function(meldDocument) {
            meldDocument.commit();
        });

        if (callback) {
            callback();
        }
    },

    /**
     * @param {MeldDocumentKey} meldDocumentKey
     * @return {boolean}
     */
    containsMeldDocumentByMeldDocumentKey: function(meldDocumentKey) {
        return this.meldBucket.containsMeldDocumentByMeldDocumentKey(meldDocumentKey);
    },

    /**
     * @param {MeldDocumentKey} meldDocumentKey
     * @return {MeldDocument}
     */
    getMeldDocumentByMeldDocumentKey: function(meldDocumentKey) {
        return this.meldBucket.getMeldDocumentByMeldDocumentKey(meldDocumentKey);
    },

    /**
     * @param {(List.<MeldDocumentKey> | Array.<MeldDocumentKey>)} meldDocumentKeys
     * @return {List.<MeldDocument>}
     */
    getEachMeldDocumentByMeldDocumentKey: function(meldDocumentKeys) {
        var _this = this;
        var meldList = new List();
        meldDocumentKeys.forEach(function(meldDocumentKey) {
            meldList.add(_this.getMeldDocumentByMeldDocumentKey(meldDocumentKey));
        });
        return meldList;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldStore', MeldStore);
