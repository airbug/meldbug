//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugserver')

//@Export('MeldMirrorManager')

//@Require('Class')
//@Require('Obj')
//@Require('meldbug.MeldBucket')
//@Require('meldbug.MeldEvent')
//@Require('meldbug.MeldTransaction')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var MeldBucket          = bugpack.require('meldbug.MeldBucket');
var MeldEvent           = bugpack.require('meldbug.MeldEvent');
var MeldTransaction     = bugpack.require('meldbug.MeldTransaction');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldMirrorManager = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function(meldMirror) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MeldMirror}
         */
        this.meldMirror                     = meldMirror;

        /**
         * @private
         * @type {MeldTransaction}
         */
        this.meldTransaction                = undefined;

        this.initialize();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {MeldOperation} meldOperation
     */
    addMeldOperation: function(meldOperation) {
        this.meldTransaction.addMeldOperation(meldOperation);
    },

    /**
     * @param {function(Error)} callback
     */
    commitTransaction: function(callback) {
        this.meldMirror.commitMeldTransaction(this.meldTransaction, callback);
    },

    /**
     * @param {MeldKey} meldKey
     */
    containsMeldByKey: function(meldKey) {
        this.meldMirror.containsMeldByKey(meldKey);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    generateTransaction: function() {
        this.meldTransaction = new MeldTransaction();
    },

    /**
     * @private
     */
    initialize: function() {
        this.generateTransaction();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbugserver.MeldMirrorManager', MeldMirrorManager);
