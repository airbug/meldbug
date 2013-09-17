//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugserver')

//@Export('MeldMirrorStore')

//@Require('Class')
//@Require('DualMultiSetMap')
//@Require('Exception')
//@Require('Map')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var DualMultiSetMap         = bugpack.require('DualMultiSetMap');
var Exception               = bugpack.require('Exception');
var Map                     = bugpack.require('Map');
var Obj                     = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldMirrorStore = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Instance Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<CallManager, MeldMirror>}
         */
        this.callManagerToMeldMirrorMap     = new Map();
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {MeldMirror} meldMirror
     */
    addMeldMirror: function(meldMirror) {
        this.callManagerToMeldMirrorMap.put(meldMirror.getCallManager(), meldMirror);
    },

    /**
     * @param {CallManager} callManager
     * @return {MeldMirror}
     */
    getMeldMirrorForCallManager: function(callManager) {
        return this.callManagerToMeldMirrorMap.get(callManager);
    },

    /**
     * @param {CallManager} callManager
     * @return {boolean}
     */
    hasCallManager: function(callManager) {
        return this.callManagerToMeldMirrorMap.containsKey(callManager);
    },

    /**
     * @param {CallManager} callManager
     */
    removeMeldMirrorForCallManager: function(callManager) {
        this.callManagerToMeldMirrorMap.remove(callManager);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbugserver.MeldMirrorStore', MeldMirrorStore);
