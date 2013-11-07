//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldBucketOperation')

//@Require('Class')
//@Require('meldbug.MeldOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var MeldOperation   = bugpack.require('meldbug.MeldOperation');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldBucketOperation = Class.extend(MeldOperation, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function(meldKey, type) {

        this._super(meldKey, type);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    clone: function(deep) {
        var clone = new MeldBucketOperation(this.meldKey);
        clone.setUuid(this.uuid);
        clone.setPreviousOperationUuid(this.previousOperationUuid);
        return clone;
    },

    /**
     * @override
     * @param {MeldBucket} meldBucket
     * @return {Meld}
     */
    commit: function(meldBucket) {
        return this.apply(meldBucket);
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldBucketOperation', MeldBucketOperation);
