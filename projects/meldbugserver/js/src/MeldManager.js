//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugserver')

//@Export('MeldManager')

//@Require('Class')
//@Require('List')
//@Require('Map')
//@Require('Obj')
//@Require('meldbug.MeldEvent')
//@Require('meldbug.MeldKey')
//@Require('meldbug.MeldObject')
//@Require('meldbug.MeldStoreDelegate')
//@Require('meldbug.MeldTransaction')
//@Require('meldbug.PropertyRemoveOperation')
//@Require('meldbug.PropertySetOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var List                        = bugpack.require('List');
var Map                         = bugpack.require('Map');
var Obj                         = bugpack.require('Obj');
var MeldEvent                   = bugpack.require('MeldEvent');
var MeldKey                     = bugpack.require('meldbug.MeldKey');
var MeldObject                  = bugpack.require('meldbug.MeldObject');
var MeldStoreDelegate           = bugpack.require('meldbug.MeldStoreDelegate');
var MeldTransaction             = bugpack.require('meldbug.MeldTransaction');
var PropertyRemoveOperation     = bugpack.require('meldbug.PropertyRemoveOperation');
var PropertySetOperation        = bugpack.require('meldbug.PropertySetOperation');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldManager = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function(meldStore, meldMirrorStore) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<CallManager, MeldMirrorManager>}
         */
        this.callManagerToMeldMirrorManagerMap  = new Map();

        /**
         * @private
         * @type {MeldMirrorStore}
         */
        this.meldMirrorStore                    = meldMirrorStore;

        /**
         * @private
         * @type {MeldStore}
         */
        this.meldStore                          = meldStore;

        /**
         * @private
         * @type {MeldStoreDelegate}
         */
        this.meldStoreDelegate                  = new MeldStoreDelegate(meldStore);

        /**
         * @private
         * @type {MeldTransaction}
         */
        this.meldTransaction                    = undefined;

        this.initialize();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Meld} meld
     */
    addMeld: function(meld) {
        this.meldStoreDelegate.addMeld(meld);
    },

    /**
     * @param {function(Error)} callback
     */
    commitTransaction: function(callback) {

    },

    /**
     * @param {MeldKey} meldKey
     */
    containsMeldByKey: function(meldKey) {
        this.meldStoreDelegate.containsMeldByKey(meldKey);
    },

    /**
     * @param {MeldKey} meldKey
     * @return {MeldObject}
     */
    getMeld: function(meldKey) {
        return this.meldStoreDelegate.get(meldKey);
    },

    /**
     * @param {CallManager} callManager
     * @return {Boolean}
     */
    hasMirrorForCallManager: function(callManager) {
        return this.meldMirrorStore.hasCallManager(callManager);
    },

    /**
     * @param {CallManager} callManager
     */
    mirrorCallManager: function(callManager) {
        if (!this.hasMirrorForCallManager(callManager)) {
            var meldMirror = new MeldMirror
        }
    },

    /**
     * @param {MeldKey} meldKey
     */
    removeMeld: function(meldKey) {
        this.meldStoreDelegate.removeMeld(meldKey);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    generateTransaction: function() {
        this.meldTransaction = new MeldTransaction();
        /*if (!this.meldTransaction) {
            var lastMeldOperation               = this.getLastMeldOperation();
            var startingMeldTransactionUuid     = "";
            if (lastMeldOperation) {
                startingMeldTransactionUuid = lastMeldOperation.getUuid();
            }
            this.meldTransaction = new MeldTransaction(this.meldId, startingMeldTransactionUuid);
            this.dispatchEvent(new Event(Meld.EventTypes.TRANSACTION, {
                transaction: this.meldTransaction
            }))
        }
        return this.meldTransaction;*/
    },

    initialize: function() {
        this.generateTransaction();
        this.meldStoreDelegate.addEventListener(MeldEvent.EventTypes.OPERATION, this.handleMeldOperation, this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    handleMeldOperation: function(meldEvent) {

    }
});



//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbugserver.MeldManager', MeldManager);
