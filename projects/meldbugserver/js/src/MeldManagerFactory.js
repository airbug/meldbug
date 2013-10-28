//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugserver')

//@Export('MeldManagerFactory')

//@Require('Class')
//@Require('Obj')
//@Require('meldbugserver.MeldManager')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');
var MeldManager     = bugpack.require('meldbugserver.MeldManager');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldManagerFactory = Class.extend(Obj, {

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
         * @type {MeldMirrorStore}
         */
        this.meldMirrorStore    = meldMirrorStore;

        /**
         * @private
         * @type {MeldStore}
         */
        this.meldStore          = meldStore;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {MeldManager}
     */
    factoryManager: function() {
        return new MeldManager(this.meldStore, this.meldMirrorStore);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbugserver.MeldManagerFactory', MeldManagerFactory);
