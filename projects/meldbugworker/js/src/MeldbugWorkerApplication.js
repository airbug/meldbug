//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbugworker.MeldbugWorkerApplication')
//@Autoload

//@Require('Class')
//@Require('bugapp.Application')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var Application                         = bugpack.require('bugapp.Application');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Application}
 */
var MeldbugWorkerApplication = Class.extend(Application, {

    //-------------------------------------------------------------------------------
    // Application Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    preProcessApplication: function() {
        this.getConfigurationTagScan().scanBugpack('meldbugworker.MeldbugWorkerConfiguration');
        this.getModuleTagScan().scanBugpacks([
            "bugmarsh.MarshRegistry",
            "bugmarsh.Marshaller",
            "bugwork.WorkerCommandFactory",
            "bugwork.WorkerContextFactory",
            "bugwork.WorkerManager",
            "bugwork.WorkerProcessFactory",
            "bugwork.WorkerRegistry",
            "loggerbug.Logger",
            "meldbugworker.MeldbugWorkerInitializer"
        ]);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbugworker.MeldbugWorkerApplication', MeldbugWorkerApplication);
