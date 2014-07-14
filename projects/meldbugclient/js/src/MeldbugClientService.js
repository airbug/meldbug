//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbugclient.MeldbugClientService')

//@Require('Class')
//@Require('Obj')
//@Require('Flows')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var Flows             = bugpack.require('Flows');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $task               = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var MeldbugClientService = Class.extend(Obj, {

        _name: "meldbugclient.MeldbugClientService",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {MeldStore} meldStore
         */
        _constructor: function(meldStore) {

            this._super();

            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {MeldStore}
             */
            this.meldStore = meldStore;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {MeldStore}
         */
        getMeldStore: function() {
            return this.meldStore;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {MeldTransaction} meldTransaction
         * @param {function(Throwable)} callback
         */
        commitMeldTransaction: function(meldTransaction, callback) {
            var _this = this;
            $task(function(flow) {
                _this.meldStore.commitMeldTransaction(meldTransaction, function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(function(throwable) {
                if (!throwable) {
                    callback(null);
                } else {
                    callback(throwable);
                }
            });
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('meldbugclient.MeldbugClientService', MeldbugClientService);
});
