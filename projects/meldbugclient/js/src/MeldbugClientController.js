//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugclient')

//@Export('MeldbugClientController')

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('meldbug.MeldDefines')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Exception           = bugpack.require('Exception');
var Obj                 = bugpack.require('Obj');
var MeldDefines         = bugpack.require('meldbug.MeldDefines');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldbugClientController = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {BugCallRouter} bugCallRouter
     * @param {MeldbugClientService} meldbugClientService
     * @param {MeldBuilder} meldBuilder
     */
    _constructor: function(bugCallRouter, meldbugClientService, meldBuilder) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BugCallRouter}
         */
        this.bugCallRouter          = bugCallRouter;

        /**
         * @private
         * @type {MeldbugClientService}
         */
        this.meldbugClientService   = meldbugClientService;

        /**
         * @private
         * @type {MeldBuilder}
         */
        this.meldBuilder            = meldBuilder;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {BugCallRouter}
     */
    getBugCallRouter: function() {
        return this.bugCallRouter;
    },

    /**
     * @return {MeldbugClientService}
     */
    getMeldbugClientService: function() {
        return this.meldbugClientService;
    },

    /**
     * @return {MeldBuilder}
     */
    getMeldBuilder: function() {
        return this.meldBuilder;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable)} callback
     */
    configure: function(callback) {
        var _this = this;
        this.bugCallRouter.addAll({
            
            /**
             * @param {IncomingRequest} request
             * @param {CallResponder} responder
             * @param {function(Throwable)} callback
             */
            commitMeldTransaction: function(request, responder, callback) {
                var data                = request.getData();
                var meldTransaction     = _this.meldBuilder.buildMeldTransaction(data.meldTransaction);
                _this.meldbugClientService.commitMeldTransaction(meldTransaction, function(throwable) {
                    var response    = null;
                    if (!throwable) {
                        response    = responder.response(MeldDefines.ResponseTypes.SUCCESS);
                    } else {

                        //TODO BRN: Route these through a client logger so they can be logged back to the server

                        console.log(throwable.message);
                        console.log(throwable.stack);
                        if (Class.doesExtend(throwable, Exception)) {
                            response    = responder.response(MeldDefines.ResponseTypes.EXCEPTION, {
                                exception: throwable.toObject()
                            });
                        } else {
                            response    = responder.response(MeldDefines.ResponseTypes.ERROR, {
                                error: throwable
                            });
                        }
                    }
                    responder.sendResponse(response, callback);
                });
            }
        });

        callback();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbugclient.MeldbugClientController', MeldbugClientController);
