//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('Meld')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('IClone')
//@Require('IObjectable')
//@Require('List')
//@Require('meldbug.MeldEvent')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Event               = bugpack.require('Event');
var EventDispatcher     = bugpack.require('EventDispatcher');
var IClone              = bugpack.require('IClone');
var IObjectable         = bugpack.require('IObjectable');
var List                = bugpack.require('List');
var MeldEvent           = bugpack.require('meldbug.MeldEvent');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Meld = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function(meldKey, meldType) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MeldBucket}
         */
        this.meldBucket             = undefined;

        /**
         * @private
         * @type {MeldKey}
         */
        this.meldKey                = meldKey;

        /**
         * @private
         * @type {List.<MeldOperation>}
         */
        this.meldOperationList      = new List();

        /**
         * @private
         * @type {string}
         */
        this.meldType               = meldType;
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

    /**
     * @param {MeldBucket} meldBucket
     */
    setMeldBucket: function(meldBucket) {
        this.meldBucket = meldBucket;
    },

    /**
     * @return {MeldKey}
     */
    getMeldKey: function() {
        return this.meldKey;
    },

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

    /**
     * @return {string}
     */
    getMeldType: function() {
        return this.meldType;
    },


    //-------------------------------------------------------------------------------
    // IClone Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean} deep
     * @return {*}
     */
    clone: function(deep) {
        //abstract
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
            meldKey: this.meldKey.toObject(),
            meldType: this.meldType,
            meldOperationList: meldOperationList
        };
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    commit: function() {
         //implement if needed
    },

    /**
     * @param {string} operationUuid
     * @return {number}
     */
    findOperationIndex: function(operationUuid) {
        for (var i = this.meldOperationList.getCount() - 1; i >= 0; i--) {
            /** @type {MeldOperation} */
            var operation = this.meldOperationList.getAt(i);
            if (operation.getUuid() === operationUuid) {
                return i;
            }
        }
        return -1;
    },

    /**
     * @return {MeldOperation}
     */
    getLastMeldOperation: function() {
        if (!this.meldOperationList.isEmpty()) {
            this.meldOperationList.getAt(this.meldOperationList.getCount() - 1);
        } else {
            return undefined;
        }
    },

    /**
     * @return {number}
     */
    getLastRevisionIndex: function() {
        return this.meldOperationList.getCount() - 1;
    },

    /**
     * @param {string} operationUuid
     * @return {number}
     */
    getRevisionIndex: function(operationUuid) {
        var revisionIndex = 0;
        if (operationUuid) {
            revisionIndex = this.findOperationIndex(operationUuid);
        }
        return revisionIndex;
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {MeldOperation} meldOperation
     */
    meldOperation: function(meldOperation) {
        meldOperation.setPreviousOperationUuid(this.getLastMeldOperation().getUuid());
        meldOperation.commit(this.meldBucket);
        this.dispatchEvent(new MeldEvent(MeldEvent.EventTypes.OPERATION, this.meldKey, {
            meldOperation: meldOperation
        }));
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(Meld, IClone);
Class.implement(Meld, IObjectable);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.Meld', Meld);
