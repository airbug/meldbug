//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbugserver.MeldClientService')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('bugcall.CallEvent')
//@Require('bugcall.IProcessCall')
//@Require('Flows')
//@Require('bugioc.ArgTag')
//@Require('bugioc.IInitializingModule')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Bugpack Modules
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var Exception                   = bugpack.require('Exception');
    var Obj                         = bugpack.require('Obj');
    var CallEvent                   = bugpack.require('bugcall.CallEvent');
    var IProcessCall                = bugpack.require('bugcall.IProcessCall');
    var Flows                     = bugpack.require('Flows');
    var ArgTag               = bugpack.require('bugioc.ArgTag');
    var IInitializingModule           = bugpack.require('bugioc.IInitializingModule');
    var ModuleTag            = bugpack.require('bugioc.ModuleTag');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                         = ArgTag.arg;
    var bugmeta                     = BugMeta.context();
    var module                      = ModuleTag.module;
    var $if                         = Flows.$if;
    var $series                     = Flows.$series;
    var $task                       = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IInitializingModule}
     * @implements {IProcessCall}
     */
    var MeldClientService = Class.extend(Obj, {

        _name: "meldbugserver.MeldClientService",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {BugCallServer} bugCallServer
         * @param {MeldClientManager} meldClientManager
         */
        _constructor: function(bugCallServer, meldClientManager) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {BugCallServer}
             */
            this.bugCallServer                  = bugCallServer;

            /**
             * @private
             * @type {boolean}
             */
            this.initialized                    = false;

            /**
             * @private
             * @type {MeldClientManager}
             */
            this.meldClientManager              = meldClientManager;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {BugCallServer}
         */
        getBugCallServer: function() {
            return this.bugCallServer;
        },

        /**
         * @return {MeldClientManager}
         */
        getMeldClientManager: function() {
            return this.meldClientManager;
        },

        /**
         * @return {boolean}
         */
        isInitialized: function() {
            return this.initialized;
        },


        //-------------------------------------------------------------------------------
        // IInitializingModule Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        deinitializeModule: function(callback) {
            if (this.isInitialized()) {
                this.initialized = false;
                this.bugCallServer.off(CallEvent.CLOSED, this.hearBugCallServerCallClosed, this);
                this.bugCallServer.deregisterCallProcessor(this);
            }
            callback();
        },

        /**
         * @param {function(Throwable=)} callback
         */
        initializeModule: function(callback) {
            if (!this.isInitialized()) {
                this.initialized = true;
                this.bugCallServer.on(CallEvent.CLOSED, this.hearBugCallServerCallClosed, this);
                this.bugCallServer.registerCallProcessor(this);
            }
            callback();
        },


        //-------------------------------------------------------------------------------
        // IProcessCall Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {Call} call
         * @param {function(Throwable=)} callback
         */
        processCall: function(call, callback) {
            var _this           = this;
            var meldClient      = null;
            var meldClientKey   = this.meldClientManager.generateMeldClientKey(call.getCallUuid());

            $if(function(flow) {
                    _this.meldClientManager.getMeldClientForKey(meldClientKey, function(throwable, retrieveMeldClient) {
                        if (!throwable) {
                            meldClient = retrieveMeldClient;
                            flow.assert(!meldClient);
                        } else {
                            flow.error(throwable);
                        }
                    });
                },
                $task(function(flow) {
                    _this.createMeldClient(meldClientKey, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ).$else(
                $task(function(flow) {
                    if (!meldClient.isActive()) {
                        meldClient.setActive(true);
                        meldClient.setLastActive(new Date());
                        _this.meldClientManager.setMeldClient(meldClient, function(throwable) {
                            flow.complete(throwable);
                        });
                    } else {
                        flow.error(new Exception("AlreadyActive", {}, "A connection by this callUuid is already active"));
                    }
                })
            ).execute(callback);
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {MeldClientKey} meldClientKey
         * @param {function(Throwable, MeldClient=)} callback
         */
        createMeldClient: function(meldClientKey, callback) {
            var meldClient = this.meldClientManager.generateMeldClient(meldClientKey);
            this.meldClientManager.setMeldClient(meldClient, callback);
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {CallEvent} event
         */
        hearBugCallServerCallClosed: function(event) {
            var _this           = this;
            var data            = event.getData();
            var call     = data.call;
            var meldClient      = null;
            var meldClientKey   = this.meldClientManager.generateMeldClientKey(call.getCallUuid());
            $series([
                $task(function(flow) {
                    _this.meldClientManager.getMeldClientForKey(meldClientKey, function(throwable, retrievedMeldClient) {
                        if (!throwable) {
                            meldClient = retrievedMeldClient;
                            flow.complete();
                        } else {
                            flow.error(throwable);
                        }
                    });
                }),
                $task(function(flow) {
                    meldClient.setActive(false);
                    meldClient.setLastActive(new Date());
                    _this.meldClientManager.setMeldClient(meldClient, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]).execute(function(throwable) {
                //TODO BRN: What do we do if this fails?
            });
        }
    });


    //-------------------------------------------------------------------------------
    // Implement Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(MeldClientService, IInitializingModule);
    Class.implement(MeldClientService, IProcessCall);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(MeldClientService).with(
        module("meldClientService")
            .args([
                arg().ref("bugCallServer"),
                arg().ref("meldClientManager")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('meldbugserver.MeldClientService', MeldClientService);
});
