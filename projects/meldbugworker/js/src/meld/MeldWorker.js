//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbug.MeldWorker')
//@Autoload

//@Require('Class')
//@Require('bugioc.BugIoc')
//@Require('bugmeta.BugMeta')
//@Require('bugwork.Worker')
//@Require('bugwork.WorkerTag')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                               = bugpack.require('Class');
    var BugIoc                          = bugpack.require('bugioc.BugIoc');
    var BugMeta                             = bugpack.require('bugmeta.BugMeta');
    var Worker                              = bugpack.require('bugwork.Worker');
    var WorkerTag                    = bugpack.require('bugwork.WorkerTag');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var worker                              = WorkerTag.worker;
    var bugmeta                             = BugMeta.context();


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Worker}
     */
    var MeldWorker = Class.extend(Worker, {

        _name: "meldbug.MeldWorker",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {IocContext}
             */
            this.iocContext             = BugIoc.context();

            /**
             * @private
             * @type {ModuleTagScan}
             */
            this.moduleTagScan          = BugIoc.moduleScan(bugmeta);
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {IocContext}
         */
        getIocContext: function() {
            return this.iocContext;
        },

        /**
         * @return {ModuleTagScan}
         */
        getModuleTagScan: function() {
            return this.moduleTagScan;
        },


        //-------------------------------------------------------------------------------
        // Worker Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         * @param {function(Throwable=)} callback
         */
        configure: function(callback) {
            var throwable = null;
            try {
                this.moduleTagScan.scanBugpacks([
                    "bugcall.CallManager",
                    "bugcall.CallRequestFactory",
                    "bugcall.CallRequestManager",
                    "bugcall.CallResponseHandlerFactory",
                    "bugcall.PersistedCallFactory",
                    "bugmarsh.Marshaller",
                    "bugmarsh.MarshRegistry",
                    "bugsub.PubSub",
                    "loggerbug.Logger",
                    "meldbug.CleanupTaskManager",
                    "meldbug.MeldBucketManager",
                    "meldbug.MeldBuilder",
                    "meldbug.MeldClientManager",
                    "meldbug.MeldTaskManager",
                    "meldbug.MeldTransactionGenerator",
                    "meldbug.MeldTransactionPublisher",
                    "meldbug.MeldWorkerConfiguration"
                ]);
                this.iocContext.generate();
            } catch(t) {
                throwable = t;
            }
            callback(throwable);
        },

        /**
         * @protected
         * @param {function(Throwable=)} callback
         */
        deinitialize: function(callback) {
            this.iocContext.deinitialize(callback);
        },

        /**
         * @protected
         * @param {function(Throwable=)} callback
         */
        initialize: function(callback) {
            console.log("Initializing MeldWorker...");
            this.iocContext.initialize(callback);
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(MeldWorker).with(
        worker("meldWorker")
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('meldbug.MeldWorker', MeldWorker);
});
