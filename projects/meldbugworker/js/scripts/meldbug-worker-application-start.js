//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Require('meldbugworker.MeldbugWorkerApplication')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context(module);


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var MeldbugWorkerApplication  = bugpack.require('meldbugworker.MeldbugWorkerApplication');


//-------------------------------------------------------------------------------
// Script
//-------------------------------------------------------------------------------

var meldbugWorkerApplication = new MeldbugWorkerApplication();
meldbugWorkerApplication.start(function(throwable) {
    console.log("Starting meldbug worker application...");
    if (!throwable) {
        console.log("Meldbug worker application server successfully started");
    } else {
        console.log("Meldbug worker application error on startup");
        console.error(throwable.message);
        console.error(throwable.stack);
        process.exit(1);
    }
});


var gracefulShutdown = function() {
    console.log("Shutting down meldbug worker application...");
    meldbugWorkerApplication.stop(function(throwable) {
        if (throwable) {
            console.error(throwable.message);
            console.error(throwable.stack);
            process.exit(1);
        } else {
            process.exit();
        }
    });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
