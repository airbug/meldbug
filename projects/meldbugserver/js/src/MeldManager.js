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
//@Require('meldbug.AddMeldOperation')
//@Require('meldbug.MeldEvent')
//@Require('meldbug.MeldKey')
//@Require('meldbug.MeldObject')
//@Require('meldbug.MeldStoreDelegate')
//@Require('meldbug.MeldTransaction')
//@Require('meldbug.PropertyRemoveOperation')
//@Require('meldbug.PropertySetOperation')
//@Require('meldbug.RemoveMeldOperation')
//@Require('meldbugserver.MeldMirrorManager')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Map                         = bugpack.require('Map');
var Obj                         = bugpack.require('Obj');
var Set                         = bugpack.require('Set');
var BugFlow                     = bugpack.require('bugflow.BugFlow');
var AddMeldOperation            = bugpack.require('meldbug.AddMeldOperation');
var MeldEvent                   = bugpack.require('meldbug.MeldEvent');
var MeldKey                     = bugpack.require('meldbug.MeldKey');
var MeldObject                  = bugpack.require('meldbug.MeldObject');
var MeldStoreDelegate           = bugpack.require('meldbug.MeldStoreDelegate');
var MeldTransaction             = bugpack.require('meldbug.MeldTransaction');
var PropertyRemoveOperation     = bugpack.require('meldbug.PropertyRemoveOperation');
var PropertySetOperation        = bugpack.require('meldbug.PropertySetOperation');
var RemoveMeldOperation         = bugpack.require('meldbug.RemoveMeldOperation');
var MeldMirrorManager           = bugpack.require('meldbugserver.MeldMirrorManager');


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
     * @param {Meld} meld
     */
    addMeld: function(meld) {
        this.meldStoreDelegate.addMeld(meld);
    },

    /**
     * @param {function(Error)} callback
     */
    commitTransaction: function(callback) {
        //Setup listeners on meldStore that listen for operations. When an operation occurs, perform the same changes against meldMirrorManagers that need to know about this changes
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
     * @return {MeldObject}
     */
    getMeld: function(meldKey) {
        return this.meldStoreDelegate.get(meldKey);
    },

    /**
     * @param {CallManager} callManager
     * @param {MeldKey} meldKey
     */
    meldCallManagerWithKey: function(callManager, meldKey) {
        var meldMirror = this.meldMirrorStore.getMeldMirrorForCallManager(callManager);
        if (meldMirror) {
            this.meldMirrorStore.addMeldKeyForMirror(meldKey, meldMirror);
        } else {
            throw new Error("Could not find MeldMirror for CallManager - callManager:", callManager);
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
        var _this = this;
        /** @type {MeldOperation} */
        var meldOperation           = meldEvent.getData().meldOperation.clone(true);
        var meldMirrorManagerSet    = this.generateMeldMirrorManagersForMeldKey(meldOperation.getMeldKey());

        meldMirrorManagerSet.forEach(function(meldMirrorManager) {
            switch (meldOperation.getType()) {
                case PropertyRemoveOperation.TYPE:
                case PropertySetOperation.TYPE:
                    if (!meldMirrorManager.containsMeldByKey(meldOperation.getMeldKey())) {
                        var meld = _this.meldStore.getMeld(meldOperation.getMeldKey());
                        var addOperation = new AddMeldOperation(meldOperation.getMeldKey(), meld.clone());
                        meldMirrorManager.addMeldOperation(addOperation);
                    }
                    break;
            }
            meldMirrorManager.addMeldOperation(meldOperation);
        });
    }
});



//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbugserver.MeldManager', MeldManager);
