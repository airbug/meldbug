//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugserver')

//@Export('MeldManager')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('Set')
//@Require('bugflow.BugFlow')
//@Require('meldbug.MeldEvent')
//@Require('meldbug.MeldKey')
//@Require('meldbug.MeldMeldOperation')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldStoreDelegate')
//@Require('meldbug.MeldTransaction')
//@Require('meldbug.RemoveObjectPropertyOperation')
//@Require('meldbug.SetObjectPropertyOperation')
//@Require('meldbug.RemoveMeldOperation')
//@Require('meldbugserver.MeldMirrorManager')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var Map                                 = bugpack.require('Map');
var Obj                                 = bugpack.require('Obj');
var Set                                 = bugpack.require('Set');
var BugFlow                             = bugpack.require('bugflow.BugFlow');
var MeldEvent                           = bugpack.require('meldbug.MeldEvent');
var MeldKey                             = bugpack.require('meldbug.MeldKey');
var MeldMeldOperation                   = bugpack.require('meldbug.MeldMeldOperation');
var MeldDocument                          = bugpack.require('meldbug.MeldDocument');
var MeldStoreDelegate                   = bugpack.require('meldbug.MeldStoreDelegate');
var MeldTransaction                     = bugpack.require('meldbug.MeldTransaction');
var RemoveObjectPropertyOperation       = bugpack.require('meldbug.RemoveObjectPropertyOperation');
var SetObjectPropertyOperation          = bugpack.require('meldbug.SetObjectPropertyOperation');
var RemoveMeldOperation                 = bugpack.require('meldbug.RemoveMeldOperation');
var MeldMirrorManager                   = bugpack.require('meldbugserver.MeldMirrorManager');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $forEachParallel            = BugFlow.$forEachParallel;


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
         * @type {Map.<MeldMirror, MeldMirrorManager>}
         */
        this.meldMirrorToMeldMirrorManagerMap  = new Map();

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
     * @param {function(Error)} callback
     */
    commitTransaction: function(callback) {

        // Setup listeners on meldStore that listen for operations. When an operation occurs,
        // perform the same changes against meldMirrorManagers that need to know about this changes

        this.meldStore.addEventListener(MeldEvent.EventTypes.OPERATION, this.handleMeldStoreOperation, this);
        this.meldStore.commitMeldTransaction(this.meldTransaction);
        this.meldStore.removeEventListener(MeldEvent.EventTypes.OPERATION, this.handleMeldStoreOperation, this);
        this.commitMeldMirrorTransactions(callback);
    },

    /**
     * @param {MeldKey} meldKey
     */
    containsMeldByKey: function(meldKey) {
        this.meldStoreDelegate.containsMeldByKey(meldKey);
    },

    /**
     * @param {MeldKey} meldKey
     * @return {MeldDocument}
     */
    getMeld: function(meldKey) {
        return this.meldStoreDelegate.get(meldKey);
    },

    /**
     * @param {CallManager} callManager
     * @param {MeldKey} meldKey
     * @param {string} reason
     */
    meldCallManagerWithKeyAndReason: function(callManager, meldKey, reason) {
        this.meldMirrorStore.addMeldKeyAndReasonForCallManager(meldKey, reason, callManager);
    },

    /**
     * @param {Meld} meld
     */
    meldMeld: function(meld) {
        this.meldStoreDelegate.meldMeld(meld);
    },

    /**
     * @param {MeldKey} meldKey
     */
    removeMeld: function(meldKey) {
        this.meldStoreDelegate.removeMeld(meldKey);
    },

    /**
     * @param {CallManager} callManager
     * @param {MeldKey} meldKey
     */
    unmeldCallManagerWithKeyAndReason: function(callManager, meldKey, reason) {
        this.meldMirrorStore.removeMeldKeyAndReasonForCallManager(meldKey, reason, callManager);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {function(Error)} callback
     */
    commitMeldMirrorTransactions: function(callback) {
        $forEachParallel(this.meldMirrorToMeldMirrorManagerMap.getValueArray(), function(flow, meldMirrorManager) {
            meldMirrorManager.commitTransaction(function(error) {
                flow.complete(error);
            });
        }).execute(callback);
    },

    /**
     * @param {MeldMirror} meldMirror
     * @return {MeldMirrorManager}
     */
    factoryMeldMirrorManager: function(meldMirror) {
        return new MeldMirrorManager(meldMirror);
    },

    /**
     * @private
     * @param {MeldKey} meldKey
     * @return {Set.<MeldMirrorManager>}
     */
    generateMeldMirrorManagersForMeldKey: function(meldKey) {
        var _this = this;
        var meldMirrorManagerSet = new Set();
        var meldMirrorSet = this.meldMirrorStore.getMeldMirrorSetForMeldKey(meldKey);
        meldMirrorSet.forEach(function(meldMirror) {
            meldMirrorManagerSet.add(_this.generateMeldMirrorManager(meldMirror));
        });
        return meldMirrorManagerSet;
    },

    /**
     * @private
     * @param {MeldMirror} meldMirror
     * @return {MeldMirrorManager}
     */
    generateMeldMirrorManager: function(meldMirror) {
        var meldMirrorManager = this.meldMirrorToMeldMirrorManagerMap.get(meldMirror);
        if (!meldMirrorManager) {
            meldMirrorManager = this.factoryMeldMirrorManager(meldMirror);
            this.meldMirrorToMeldMirrorManagerMap.put(meldMirror, meldMirrorManager);
        }
        return meldMirrorManager;
    },

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

    /**
     * @private
     */
    initialize: function() {
        this.generateTransaction();
        this.meldStoreDelegate.addEventListener(MeldEvent.EventTypes.OPERATION, this.handleMeldOperation, this);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {MeldEvent} meldEvent
     */
    handleMeldOperation: function(meldEvent) {

        //NOTE BRN: We clone the transaction here so that we can freeze the changes to the data in the operation

        var meldOperation = meldEvent.getData().meldOperation.clone(true);
        this.meldTransaction.addMeldOperation(meldOperation);
    },

    /**
     * @private
     * @param {MeldEvent} meldEvent
     */
    handleMeldStoreOperation: function(meldEvent) {
        /** @type {MeldOperation} */
        var meldOperation           = meldEvent.getData().meldOperation.clone(true);
        var meldMirrorManagerSet    = this.generateMeldMirrorManagersForMeldKey(meldOperation.getMeldKey());

        meldMirrorManagerSet.forEach(function(meldMirrorManager) {
            if (meldOperation.getType() === MeldMeldOperation.TYPE) {
                if (!meldMirrorManager.containsMeldByKey(meldOperation.getMeldKey())) {
                    meldMirrorManager.addMeldOperation(meldOperation);
                }
            } else {
                meldMirrorManager.addMeldOperation(meldOperation);
            }
        });
    }
});



//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbugserver.MeldManager', MeldManager);
