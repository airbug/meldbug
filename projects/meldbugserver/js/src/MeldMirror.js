//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugserver')

//@Export('MeldMirror')

//@Require('Class')
//@Require('List')
//@Require('Map')
//@Require('Obj')
//@Require('Set')
//@Require('meldbugserver.MeldMirrorDocument')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var List                = bugpack.require('List');
var Map                 = bugpack.require('Map');
var Obj                 = bugpack.require('Obj');
var Set                 = bugpack.require('Set');
var MeldMirrorDocument  = bugpack.require('meldbugserver.MeldMirrorDocument');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldMirror = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function(callManager, meldbugClientConsumer) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CallManager}
         */
        this.callManager                    = callManager;

        /**
         * @private
         * @type {MeldbugClientConsumer}
         */
        this.meldbugClientConsumer          = meldbugClientConsumer;

        /**
         * @private
         * @type {Map.<MeldKey, Set.<string>>}
         */
        this.meldKeyToReasonSetMap          = new Map();

        /**
         * @private
         * @type {MeldMirrorDocument}
         */
        this.meldMirrorDocument             = new MeldMirrorDocument();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {CallManager}
     */
    getCallManager: function() {
        return this.callManager;
    },

    /**
     * @return {MeldbugClientConsumer}
     */
    getMeldbugClientConsumer: function() {
        return this.meldbugClientConsumer;
    },

    /**
     * @return {MeldMirrorDocument}
     */
    getMeldMirrorDocument: function() {
        return this.meldMirrorDocument;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} reason
     * @param {MeldKey} meldKey
     */
    addReasonToMeldKey: function(reason, meldKey){
        var reasonSet = this.meldKeyToReasonSetMap.get(meldKey);
        if (reasonSet) {
            reasonSet.add(reason);
        } else {
            reasonSet = new Set([reason]);
            this.meldKeyToReasonSetMap.put(meldKey, reasonSet);
        }
    },

    /**
     * @param {MeldTransaction} meldTransaction
     * @param {function(Error)} callback
     */
    commitMeldTransaction: function(meldTransaction, callback) {
        var _this = this;
        meldTransaction.getMeldOperationList().forEach(function(meldOperation) {
            meldOperation.commit(_this.meldMirrorDocument);
        });
        this.meldbugClientConsumer.commitMeldTransaction(meldTransaction, callback);
    },

    /**
     * @param {MeldKey} meldKey
     * @return {boolean}
     */
    containsMeldByKey: function(meldKey) {
        return this.meldMirrorDocument.containsMeldByKey(meldKey);
    },

    /**
     * @param {string} reason
     * @param {MeldKey} meldKey
     */
    removeReasonFromMeldKey: function(reason, meldKey){
        var reasonSet = this.meldKeyToReasonSetMap.get(meldKey);
        if(reasonSet){
            reasonSet.remove(reason);
        }
    },

    reasonSetForMeldKeyIsEmpty: function(meldKey){
        var reasonSet = this.meldKeyToReasonSetMap.get(meldKey);
        if(reasonSet){
            return reasonSet.isEmpty();
        } else {
            return true;
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbugserver.MeldMirror', MeldMirror);
