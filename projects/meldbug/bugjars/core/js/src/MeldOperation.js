//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldOperation')

//@Require('Class')
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
     * @constructs
     * @param {MeldDocumentKey} meldDocumentKey
     * @param {string} type
     */
    _constructor: function(meldDocumentKey, type) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MeldDocumentKey}
         */
        this.meldDocumentKey        = meldDocumentKey;

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
     * @return {MeldDocumentKey}
     */
    getMeldDocumentKey: function() {
        return this.meldDocumentKey;
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

    /**
     * @protected
     */
    setUuid: function(uuid) {
        this.uuid = uuid;
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
    // Abstract Methods
    //-------------------------------------------------------------------------------

    /**
     * @abstract
     * @param {MeldBucket} meldBucket
     * @return {MeldDocument}
     */
    apply: function(meldBucket) {
        return meldBucket.getMeldDocumentByMeldDocumentKey(this.meldDocumentKey);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldOperation', MeldOperation);
