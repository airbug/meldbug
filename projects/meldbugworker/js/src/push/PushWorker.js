//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbug.PushWorker')
//@Autoload

//@Require('Class')
//@Require('bugioc.ConfigurationAnnotationProcessor')
//@Require('bugioc.ConfigurationScan')
//@Require('bugioc.IocContext')
//@Require('bugioc.ModuleAnnotationProcessor')
//@Require('bugioc.ModuleScan')
//@Require('bugmeta.BugMeta')
//@Require('bugwork.Worker')
//@Require('bugwork.WorkerAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var ConfigurationAnnotationProcessor    = bugpack.require('bugioc.ConfigurationAnnotationProcessor');
var ConfigurationScan                   = bugpack.require('bugioc.ConfigurationScan');
var IocContext                          = bugpack.require('bugioc.IocContext');
var ModuleAnnotationProcessor           = bugpack.require('bugioc.ModuleAnnotationProcessor');
var ModuleScan                          = bugpack.require('bugioc.ModuleScan');
var BugMeta                             = bugpack.require('bugmeta.BugMeta');
var Worker                              = bugpack.require('bugwork.Worker');
var WorkerAnnotation                    = bugpack.require('bugwork.WorkerAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var worker                              = WorkerAnnotation.worker;
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
         * @type {ConfigurationScan}
         */
        this.configurationScan  = new ConfigurationScan(bugmeta, new ConfigurationAnnotationProcessor(this.iocContext));

        /**
         * @private
         * @type {ModuleScan}
         */
        this.moduleScan         = new ModuleScan(bugmeta, new ModuleAnnotationProcessor(this.iocContext));
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {ConfigurationScan}
     */
    getConfigurationScan: function() {
        return this.configurationScan;
    },

    /**
     * @return {IocContext}
     */
    getIocContext: function() {
        return this.iocContext;
    },

    /**
     * @return {ModuleScan}
     */
    getModuleScan: function() {
        return this.moduleScan;
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
            this.configurationScan.scanBugpack("meldbug.PushWorkerConfiguration");
            this.moduleScan.scanBugpacks([
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

bugmeta.annotate(PushWorker).with(
    worker("pushWorker")
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.PushWorker', PushWorker);
