//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('RemoveMeldOperation')

//@Require('Class')
//@Require('meldbug.MeldDocumentOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var MeldDocumentOperation   = bugpack.require('meldbug.MeldDocumentOperation');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var RemoveMeldOperation = Class.extend(MeldDocumentOperation, {

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
    // MeldOperation Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {MeldDocument} meldDocument
     * @return {Meld}
     */
    apply: function(meldDocument) {
        return meldDocument.removeMeld(this.getMeldKey());
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
