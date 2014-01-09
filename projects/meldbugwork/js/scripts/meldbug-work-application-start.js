//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Require('meldbugwork.MeldbugWorkApplication')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context(module);


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var MeldbugWorkApplication  = bugpack.require('meldbugwork.MeldbugWorkApplication');


//-------------------------------------------------------------------------------
// Script
//-------------------------------------------------------------------------------

var meldbugWorkApplication = new MeldbugWorkApplication();
meldbugWorkApplication.start(function(throwable) {
    console.log("Starting meldbug worker application...");
    if (!throwable) {
        console.log("Meldbug worker application server successfully started");
    } else {
        console.error(throwable.message);
        console.error(throwable.stack);
        process.exit(1);
    }
});


var gracefulShutdown = function() {
    console.log("Shutting down meldbug worker application...");
    meldbugWorkApplication.stop(function(throwable) {
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
