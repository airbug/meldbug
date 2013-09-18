//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldOperation')

//@Require('Class')
//@Require('IClone')
//@Require('IObjectable')
//@Require('Obj')
//@Require('UuidGenerator')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var IClone          = bugpack.require('IClone');
var IObjectable     = bugpack.require('IObjectable');
var Obj             = bugpack.require('Obj');
var UuidGenerator   = bugpack.require('UuidGenerator');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldOperation = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function(meldKey, type, previousOperationUuid) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MeldKey}
         */
        this.meldKey                = meldKey;

        /**
         * @private
         * @type {string}
         */
        this.previousOperationUuid  = previousOperationUuid;

        /**
         * @private
         * @type {string}
         */
        this.type                   = type;

        /**
         * @private
         * @type {string}
         */
        this.uuid                   = UuidGenerator.generateUuid();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {MeldKey}
     */
    getMeldKey: function() {
        return this.meldKey;
    },

    /**
     * @return {string}
     */
    getPreviousOperationUuid: function() {
        return this.previousOperationUuid;
    },

    /**
     * @param {string} previousOperationUuid
     */
    setPreviousOperationUuid: function(previousOperationUuid) {
        this.previousOperationUuid = previousOperationUuid;
    },

    /**
     * @return {string}
     */
    getType: function() {
        return this.type;
    },

    /**
     * @return {string}
     */
    getUuid: function() {
        return this.uuid;
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
        return {
            meldKey: this.meldKey.toObject(),
            type: this.type,
            uuid: this.uuid
        };
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {MeldDocument} meldDocument
     * @return {Meld}
     */
    commit: function(meldDocument) {
        var _this = this;
        var meld = meldDocument.getMeld(this.meldKey);
        var revisionIndex = meld.getRevisionIndex(this.previousOperationUuid);
        if (revisionIndex < 0 || revisionIndex > _this.operationList.getCount()) {
            throw new Error("operation revision not in history");
        }
        var concurrentOperationList = meld.getOperationList().subList(revisionIndex);
        concurrentOperationList.forEach(function(concurrentOperation) {
            _this.transform(concurrentOperation);
        });
        var modifiedMeld = this.apply(meldDocument);
        meld.getOperationList().add(this);
        return modifiedMeld;
    },


    //-------------------------------------------------------------------------------
    // Abstract Methods
    //-------------------------------------------------------------------------------

    /**
     * @abstract
     * @param {MeldDocument} meldDocument
     * @return {Meld}
     */
    apply: function(meldDocument) {

    },

    /**
     * @abstract
     * @param {MeldOperation} meldOperation
     */
    transform: function(meldOperation) {

    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(MeldOperation, IClone);
Class.implement(MeldOperation, IObjectable);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldOperation', MeldOperation);
