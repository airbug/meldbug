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

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldbugClientController = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(bugCallRouter, meldbugClientService, meldObjectManager) {

        this._super();

        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BugCallRouter}
         */
        this.bugCallRouter  = bugCallRouter;

        /**
         * @private
         * @type {MeldbugClientService}
         */
        this.meldbugClientService   = meldbugClientService;

        /**
         * @private
         * @type {*}
         */
        this.meldObjectManager      = meldObjectManager;
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
            addMeldObject: function(request, responder) {
                var data        = request.getData();
                var meldId      = data.meldId;
                var meldObject  = _this.meldObjectManager.generateMeldObject(meldId, data.meldObject);
                _this.meldbugClientService.addMeldObject(meldObject, function(error) {
                    var data        = null;
                    var response    = null;
                    if (!error) {
                        data        = {meldId: meldId};
                        response    = responder.response("addMeldObjectResponse", data);
                    } else {
                        data        = {
                            meldId: meldId,
                            error: error
                        };
                        response    = responder.response("addMeldObjectError", data);
                    }
                    responder.sendResponse(response);
                });
            },
            applyMeldOperations: function(request, responder) {
                var data                = request.getData();
                var meldId              = data.meldId;
                var revision            = data.revision;
                var operationList   = _this.meldObjectManager.generateOperationList(data.operationList);
                _this.meldbugClientService.applyOperationList(meldId, revision, operationList, function(error) {
                    var data        = null;
                    var response    = null;
                    if (!error) {
                        data        = {meldId: meldId};
                        response    = responder.response("applyOperationListResponse", data);
                    } else {
                        data        = {
                            meldId: meldId,
                            error: error
                        };
                        response    = responder.response("applyOperationListError", data);
                    }
                    responder.sendResponse(response);
                });
            },
            removeMeldObject: function(request, responder) {

            }
        });

        callback();
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbugclient.MeldbugClientController', MeldbugClientController);
