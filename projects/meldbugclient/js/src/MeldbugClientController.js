//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugclient')

//@Export('MeldbugClientController')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');


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
    configure: function(callback){
        var _this = this;
        this.bugCallRouter.addAll({
            commitMeldTransaction: function(request, responder) {
                var data                = request.getData();
                var meldTransaction     = _this.meldBuilder.generateMeldTransaction(data.meldTransaction);
                _this.meldbugClientService.commitMeldTransaction(meldTransaction, function(error) {
                    var response    = null;
                    if (!error) {
                        response    = responder.response("commitMeldTransactionResponse", {
                            success: true
                        });
                    } else {
                        response    = responder.response("commitMeldTransactionError", {
                            success: false,
                            error: error
                        });
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
