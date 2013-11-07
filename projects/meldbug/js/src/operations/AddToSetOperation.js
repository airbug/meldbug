//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('AddToSetOperation')

//@Require('Class')
//@Require('Obj')
//@Require('meldbug.MeldOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');
var MeldOperation   = bugpack.require('meldbug.MeldOperation');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AddToSetOperation = Class.extend(MeldOperation, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function(meldKey, path, setValue) {

        this._super(meldKey, AddToSetOperation.TYPE);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.path           = path;

        /**
         * @private
         * @type {*}
         */
        this.setValue       = setValue;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getPath: function() {
        return this.path;
    },

    /**
     * @return {*}
     */
    getSetValue: function() {
        return this.setValue;
    },


    //-------------------------------------------------------------------------------
    // IClone Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean} deep
     * @return {*}
     */
    clone: function(deep) {
        var clone = new AddToSetOperation(this.getMeldKey(), this.getPath(), Obj.clone(this.getSetValue(), deep));
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
        var meldDocument = meldBucket.getMeld(this.getMeldKey());
        if (meldDocument) {
            meldDocument.addToSet(this.getPath(), this.getSetValue());
        }
        return meldDocument;
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
AddToSetOperation.TYPE = "AddToSetOperation";


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.AddToSetOperation', AddToSetOperation);
