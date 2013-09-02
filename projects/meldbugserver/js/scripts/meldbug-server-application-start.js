//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Require('meldbugserver.MeldbugServerApplication')


//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context(module);


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var MeldbugServerApplication = bugpack.require('meldbugserver.MeldbugServerApplication');


//-------------------------------------------------------------------------------
// Script
//-------------------------------------------------------------------------------

var meldbugServerApplication = new MeldbugServerApplication();
meldbugServerApplication.start(function(error) {
    console.log("Starting meldbug server...");
    if (!error){
        console.log("Meldbug server successfully started");
    } else {
        console.error(error);
        console.error(error.stack);
        process.exit(1);
    }
});
