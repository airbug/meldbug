//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugclient')

//@Export('MeldbugClientConfiguration')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ConfigurationAnnotation')
//@Require('bugioc.IConfiguration')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('meldbugclient.MeldObjectManager')
//@Require('meldbugclient.MeldbugClientController')
//@Require('meldbugclient.MeldbugClientService')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();
var connect                     = require('connect');
var express                     = require('express');
var path                        = require('path');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Obj                         = bugpack.require('Obj');
var ArgAnnotation               = bugpack.require('bugioc.ArgAnnotation');
var ConfigurationAnnotation     = bugpack.require('bugioc.ConfigurationAnnotation');
var IConfiguration              = bugpack.require('bugioc.IConfiguration');
var ModuleAnnotation            = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var MeldObjectManager           = bugpack.require('meldbugclient.MeldObjectManager');
var MeldbugClientController     = bugpack.require('meldbugclient.MeldbugClientController');
var MeldbugClientService        = bugpack.require('meldbugclient.MeldbugClientService');



//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                     = ArgAnnotation.arg;
var bugmeta                 = BugMeta.context();
var configuration           = ConfigurationAnnotation.configuration;
var module                  = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldbugClientConfiguration = Class.extend(Obj, {

    /**
     * @return {MeldObjectManager}
     */
    meldObjectManager: function() {
        return new MeldObjectManager();
    },

    /**
     * @param {BugCallRouter} bugCallRouter
     * @param {MeldbugClientService} meldbugClientService
     * @return {*}
     */
    meldbugClientController: function(bugCallRouter, meldbugClientService) {
        return new MeldbugClientController(bugCallRouter, meldbugClientService);
    },

    /**
     * @param {MeldObjectManager} meldObjectManager
     * @return {MeldbugClientService}
     */
    meldbugClientService: function(meldObjectManager) {
        return new MeldbugClientService(meldObjectManager);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(MeldbugClientConfiguration, IConfiguration);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(MeldbugClientConfiguration).with(
    configuration().modules([


        //-------------------------------------------------------------------------------
        // Controllers
        //-------------------------------------------------------------------------------

        module("meldbugClientController")
            .args([
                arg().ref("bugCallRouter"),
                arg().ref("meldbugClientService"),
                arg().ref("meldObjectManager")
            ]),


        //-------------------------------------------------------------------------------
        // Services
        //-------------------------------------------------------------------------------

        module("meldbugClientService")
            .args([
                arg().ref("meldObjectManager")
            ]),


        //-------------------------------------------------------------------------------
        // Managers
        //-------------------------------------------------------------------------------

        module("meldObjectManager")
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("meldbugclient.MeldbugClientConfiguration", MeldbugClientConfiguration);
