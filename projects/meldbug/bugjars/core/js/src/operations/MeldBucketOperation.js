//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbug.MeldBucketOperation')

//@Require('Class')
//@Require('meldbug.MeldOperation')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var MeldOperation   = bugpack.require('meldbug.MeldOperation');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {MeldOperation}
     */
    var MeldBucketOperation = Class.extend(MeldOperation, {

        _name: "meldbug.MeldBucketOperation",


        //-------------------------------------------------------------------------------
        // IClone Implementation
        //-------------------------------------------------------------------------------

        /**
         * @override
         * @param {boolean} deep
         * @returns {MeldBucketOperation}
         */
        clone: function(deep) {
            var clone = new MeldBucketOperation(this.getMeldDocumentKey());
            clone.setUuid(this.getUuid());
            return clone;
        }
    });

    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('meldbug.MeldBucketOperation', MeldBucketOperation);
});
