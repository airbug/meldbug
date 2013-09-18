//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugserver')

//@Export('MeldMirrorDelegate')

//@Require('Class')
//@Require('Map')
//@Require('Set')
//@Require('Obj')
//@Require('meldbug.MeldDocument')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Map                     = bugpack.require('Map');
var Set                     = bugpack.require('Set');
var Obj                     = bugpack.require('Obj');
var MeldDocument            = bugpack.require('meldbug.MeldDocument');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldMirrorDelegate = Class.extend(Obj, {

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
         * @type {MeldDocument}
         */
        this.meldDocument           = new MeldDocument();

        /**
         * @private
         * @type {Set.<MeldKey>}
         */
        this.meldKeyRetrievedSet    = new Set();

        /**
         * @private
         * @type {MeldMirror}
         */
        this.meldMirror             = meldMirror;

        this.initialize();
    },



    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Meld} meld
     */
    addMeld: function(meld) {
        this.ensureMeldKeyRetrieved(meld.getMeldKey());
        if (!this.meldDocument.containsMeldByKey(meld.getMeldKey())) {
            this.meldDocument.meldMeld(meld);
        } else {
            throw new Error("MeldStore already has Meld by key '" + meld.getMeldKey() + "'");
        }
    },

    /**
     * @param {MeldKey} meldKey
     * @return {boolean}
     */
    containsMeldByKey: function(meldKey) {
        this.ensureMeldKeyRetrieved(meldKey);
        return this.meldDocument.containsMeldByKey(meldKey);
    },

    /**
     * @param {MeldKey} meldKey
     * @return {Meld}
     */
    getMeld: function(meldKey) {
        this.ensureMeldKeyRetrieved(meldKey);
        return this.meldDocument.getMeld(meldKey);
    },

    /**
     * @param {MeldKey} meldKey
     */
    removeMeldObject: function(meldKey) {
        this.ensureMeldKeyRetrieved(meldKey);
        var meld = this.getMeld(meldKey);
        if (meld) {
            this.meldDocument.unmeldMeld(meld);
        }
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {MeldKey} meldKey
     */
    ensureMeldKeyRetrieved: function(meldKey) {

        // TODO BRN: This doesn't quite work since the meldStore could change out from under us...
        // TODO BRN: Instead, the delegate should only interact with the store at a specific revision so that it does not interact with any new changes

        if (!this.meldKeyRetrievedSet.contains(meldKey)) {
            if (this.meldMirror.containsMeldByKey(meldKey)) {
                var meld = this.meldMirror.getMeld(meldKey).clone();
                this.meldDocument.addMeld(meld);
            }
            this.meldKeyRetrievedSet.add(meldKey);
        }
    },

    /**
     * @private
     */
    initialize: function() {
        this.meldDocument.setParentPropagator(this);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbugserver.MeldMirrorDelegate', MeldMirrorDelegate);
