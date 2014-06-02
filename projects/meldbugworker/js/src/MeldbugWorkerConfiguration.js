//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbugworker.MeldbugWorkerConfiguration')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugfs.BugFs')
//@Require('bugioc.ConfigurationTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('configbug.Configbug')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();
var redis                           = require('redis');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Obj                             = bugpack.require('Obj');
var BugFs                           = bugpack.require('bugfs.BugFs');
var ConfigurationTag         = bugpack.require('bugioc.ConfigurationTag');
var ModuleTag                = bugpack.require('bugioc.ModuleTag');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var Configbug                       = bugpack.require('configbug.Configbug');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                         = BugMeta.context();
var configuration                   = ConfigurationTag.configuration;
var module                          = ModuleTag.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldbugWorkerConfiguration = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Config Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Configbug}
     */
    configbug: function() {
        return new Configbug(BugFs.resolvePaths([__dirname, '../resources/config']));
    },

    /**
     * @return {console|Console}
     */
    console: function() {
        return console;
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.tag(MeldbugWorkerConfiguration).with(
    configuration("meldbugWorkerConfiguration")
        .modules([
            module("configbug"),
            module("console")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("meldbugworker.MeldbugWorkerConfiguration", MeldbugWorkerConfiguration);
