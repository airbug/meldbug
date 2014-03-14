//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugwork')

//@Export('MeldbugWorkConfiguration')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugfs.BugFs')
//@Require('bugioc.ConfigurationAnnotation')
//@Require('bugioc.ModuleAnnotation')
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
var ConfigurationAnnotation         = bugpack.require('bugioc.ConfigurationAnnotation');
var ModuleAnnotation                = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var Configbug                       = bugpack.require('configbug.Configbug');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                         = BugMeta.context();
var configuration                   = ConfigurationAnnotation.configuration;
var module                          = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldbugWorkConfiguration = Class.extend(Obj, {

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

bugmeta.annotate(MeldbugWorkConfiguration).with(
    configuration("meldbugWorkConfiguration")
        .modules([
            module("configbug"),
            module("console")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("meldbugwork.MeldbugWorkConfiguration", MeldbugWorkConfiguration);
