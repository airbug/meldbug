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

    _constructor: function(bugCallRouter, meldbugClientService, meldBuilder) {

        this._super();

        //-------------------------------------------------------------------------------
        // Properties
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
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    configure: function(callback) {
        var _this = this;
        this.bugCallRouter.addAll({
            commitMeldTransaction: function(request, responder) {
                var data                = request.getData();
                var meldTransaction     = _this.meldBuilder.buildMeldTransaction(data.meldTransaction);
                _this.meldbugClientService.commitMeldTransaction(meldTransaction, function(throwable) {
                    var response    = null;
                    if (!throwable) {
                        response    = responder.response(MeldDefines.ResponseTypes.SUCCESS);
                    } else {
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
                    responder.sendResponse(response);
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
