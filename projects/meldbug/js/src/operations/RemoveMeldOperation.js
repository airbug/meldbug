//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('RemoveMeldOperation')

//@Require('Class')
//@Require('meldbug.MeldBucketOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var MeldBucketOperation     = bugpack.require('meldbug.MeldBucketOperation');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RemoveMeldOperation = Class.extend(MeldBucketOperation, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function(meldKey) {

        this._super(meldKey, RemoveMeldOperation.TYPE);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------
    },


    //-------------------------------------------------------------------------------
    // IClone Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean} deep
     * @return {*}
     */
    clone: function(deep) {
        var clone = new RemoveMeldOperation(this.meldKey);
        clone.setUuid(this.uuid);
        clone.setPreviousOperationUuid(this.previousOperationUuid);
        return clone;
    },


    //-------------------------------------------------------------------------------
    // MeldOperation Implementation
    //-------------------------------------------------------------------------------

    /**
     * @override
     * @param {MeldBucket} meldBucket
     * @return {Meld}
     */
    apply: function(meldBucket) {
        return meldBucket.removeMeld(this.getMeldKey());
    },

    /**
     * @param {MeldOperation} meldOperation
     */
    transform: function(meldOperation) {
        //TODO
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @static
 * @const {string}
 */
RemoveMeldOperation.TYPE = "RemoveMeldOperation";


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.RemoveMeldOperation', RemoveMeldOperation);
