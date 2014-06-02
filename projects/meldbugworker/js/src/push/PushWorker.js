//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbug.PushWorker')
//@Autoload

//@Require('Class')
//@Require('bugioc.ConfigurationTagProcessor')
//@Require('bugioc.ConfigurationTagScan')
//@Require('bugioc.IocContext')
//@Require('bugioc.ModuleTagProcessor')
//@Require('bugioc.ModuleTagScan')
//@Require('bugmeta.BugMeta')
//@Require('bugwork.Worker')
//@Require('bugwork.WorkerTag')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var ConfigurationTagProcessor    = bugpack.require('bugioc.ConfigurationTagProcessor');
var ConfigurationTagScan                   = bugpack.require('bugioc.ConfigurationTagScan');
var IocContext                          = bugpack.require('bugioc.IocContext');
var ModuleTagProcessor           = bugpack.require('bugioc.ModuleTagProcessor');
var ModuleTagScan                          = bugpack.require('bugioc.ModuleTagScan');
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

var PushWorker = Class.extend(Worker, {

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
        this.iocContext         = new IocContext();

        /**
         * @private
         * @type {ConfigurationTagScan}
         */
        this.configurationTagScan  = new ConfigurationTagScan(bugmeta, new ConfigurationTagProcessor(this.iocContext));

        /**
         * @private
         * @type {ModuleTagScan}
         */
        this.moduleTagScan         = new ModuleTagScan(bugmeta, new ModuleTagProcessor(this.iocContext));
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {ConfigurationTagScan}
     */
    getConfigurationTagScan: function() {
        return this.configurationTagScan;
    },

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
    deinitialize: function(callback) {
        this.iocContext.deinitialize(callback);
    },

    /**
     * @protected
     * @param {function(Throwable=)} callback
     */
    initialize: function(callback) {
        console.log("Initializing PushWorker...");
        this.iocContext.initialize(callback);
    },

    /**
     * @protected
     * @param {function(Throwable=)} callback
     */
    process: function(callback) {
        var throwable = null;
        try {
            this.configurationTagScan.scanBugpack("meldbug.PushWorkerConfiguration");
            this.moduleTagScan.scanBugpacks([
                "bugmarsh.Marshaller",
                "bugmarsh.MarshRegistry",
                "bugsub.PubSub",
                "loggerbug.Logger",
                "meldbug.CleanupTaskManager",
                "meldbug.MeldBucketManager",
                "meldbug.MeldBuilder",
                "meldbug.MeldClientManager",
                "meldbug.MeldManager",
                "meldbug.MeldTaskManager",
                "meldbug.PushTaskManager"
            ]);
            this.iocContext.process();
        } catch(t) {
            throwable = t;
        }
        callback(throwable);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(PushWorker).with(
    worker("pushWorker")
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.PushWorker', PushWorker);
