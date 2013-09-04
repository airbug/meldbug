//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugclient')

//@Export('MeldbugClientService')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var EventDispatcher     = bugpack.require('Obj');
var BugFlow             = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $series         = BugFlow.$series;
var $task           = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldbugClientService = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @param {MeldObjectManager} meldObjectManager
     */
    _constructor: function(meldObjectManager) {

        this._super();

        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MeldObjectManager}
         */
        this.meldObjectManager = meldObjectManager;
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {MeldObject} meldObject
     * @param {function(Exception)} callback
     */
    addMeldObject: function(meldObject, callback) {
        var _this = this;
        $task(function(flow) {
            _this.meldObjectManager.addMeldObject(meldObject);
            flow.complete();
        }).execute(function(error) {
            if (!error) {
                callback(undefined);
            } else {
                callback(error);
            }
        });
    },

    /**
     * @private
     * @param {string} meldId
     * @param {number} revision
     * @param {List.<MeldOperation>} operationList
     */
    applyOperationList: function(meldId, revision, operationList) {
        var _this = this;
        $task(function(flow) {
            _this.meldObjectManager.applyOperations(meldId, revision, operationList);
            flow.complete();
        }).execute(function(error) {
            if (!error) {
                callback(undefined);
            } else {
                callback(error);
            }
        });
    },

    /**
     * @param {string} meldId
     * @param {function(Exception} callback
     */
    removeMeldObject: function(meldId, callback) {
        var _this = this;
        $task(function(flow) {
            _this.meldObjectManager.removeMeldObject(meldId);
        }).execute(function(error) {
            if (!error) {
                callback(undefined);
            } else {
                callback(error);
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbugclient.MeldbugClientService', MeldbugClientService);
