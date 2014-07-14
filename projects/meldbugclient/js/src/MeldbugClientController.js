/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbugclient.MeldbugClientController')

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('meldbug.MeldDefines')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Exception       = bugpack.require('Exception');
    var Obj             = bugpack.require('Obj');
    var MeldDefines     = bugpack.require('meldbug.MeldDefines');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var MeldbugClientController = Class.extend(Obj, {

        _name: "meldbugclient.MeldbugClientController",


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
                 * @param {function(Throwable=)} callback
                 */
                commitMeldTransaction: function(request, responder, callback) {
                    var data                = request.getData();
                    var meldTransaction     = data.meldTransaction;
                    _this.meldbugClientService.commitMeldTransaction(meldTransaction, function(throwable) {
                        var response    = null;
                        if (!throwable) {
                            response    = responder.response(MeldDefines.ResponseTypes.SUCCESS);
                            responder.sendResponse(response, callback);
                        } else {

                            //TODO BRN: Route these through a client logger so they can be logged back to the server

                            console.error(throwable.message);
                            console.error(throwable.stack);
                            if (Class.doesExtend(throwable, Exception)) {
                                response    = responder.response(MeldDefines.ResponseTypes.EXCEPTION, {
                                    exception: throwable.toObject()
                                });
                                responder.sendResponse(response, callback);
                            } else {
                                response    = responder.response(MeldDefines.ResponseTypes.ERROR, {
                                    error: throwable
                                });
                                responder.sendResponse(response, function(responseThrowable) {
                                    callback(responseThrowable || throwable);
                                });
                            }
                        }
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
});
