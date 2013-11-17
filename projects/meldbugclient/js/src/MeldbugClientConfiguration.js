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
//@Require('meldbug.MeldBucket')
//@Require('meldbug.MeldBuilder')
//@Require('meldbug.MeldStore')
//@Require('meldbugclient.MeldbugClientController')
//@Require('meldbugclient.MeldbugClientService')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


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
var MeldBucket                  = bugpack.require('meldbug.MeldBucket');
var MeldBuilder                 = bugpack.require('meldbug.MeldBuilder');
var MeldStore                   = bugpack.require('meldbug.MeldStore');
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
    
    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MeldbugClientController}
         */
        this._meldbugClientController             = null;
    },

    //-------------------------------------------------------------------------------
    // Configuration Lifecycle
    //-------------------------------------------------------------------------------

     /**
      * @param {function(Error)}
      */
    initializeConfiguration: function(callback) {
        var meldbugClientController = this._meldbugClientController;
        console.log("MeldbugClientConfiguration#initializeConfiguration ");
        meldbugClientController.configure(function(error) {
            if (error) {
                throw new Error("Error configuring meldbugClientController routes " + error);
            }
        });
    },
    
    /**
     * @return {MeldBuilder}
     */
    meldBuilder: function() {
        return new MeldBuilder();
    },

    /**
     * @return {MeldBucket}
     */
    meldBucket: function() {
        return new MeldBucket();
    },

    /**
     * @param {MeldBucket} meldBucket
     * @return {MeldStore}
     */
    meldStore: function(meldBucket) {
        return new MeldStore(meldBucket);
    },

    /**
     * @param {BugCallRouter} bugCallRouter
     * @param {MeldbugClientService} meldbugClientService
     * @return {*}
     */
    meldbugClientController: function(bugCallRouter, meldbugClientService, meldBuilder) {
        this._meldbugClientController = new MeldbugClientController(bugCallRouter, meldbugClientService, meldBuilder);
        return this._meldbugClientController;
    },

    /**
     * @param {MeldStore} meldStore
     * @return {MeldbugClientService}
     */
    meldbugClientService: function(meldStore) {
        return new MeldbugClientService(meldStore);
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
        module("meldbugClientController")
            .args([
                arg().ref("bugCallRouter"),
                arg().ref("meldbugClientService"),
                arg().ref("meldBuilder")
            ]),
        module("meldbugClientService")
            .args([
                arg().ref("meldStore")
            ]),
        module("meldBucket"),
        module("meldBuilder"),
        module("meldStore")
            .args([
                arg().ref("meldBucket")
            ])
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("meldbugclient.MeldbugClientConfiguration", MeldbugClientConfiguration);
