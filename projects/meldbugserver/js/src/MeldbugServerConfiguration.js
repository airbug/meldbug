//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugserver')

//@Export('MeldbugServerConfiguration')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ConfigurationAnnotation')
//@Require('bugioc.IConfiguration')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugioc.PropertyAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('meldbug.MeldBucket')
//@Require('meldbug.MeldBuilder')
//@Require('meldbug.MeldStore')
//@Require('meldbugserver.MeldbugClientApi')
//@Require('meldbugserver.MeldbugClientConsumerManager')
//@Require('meldbugserver.MeldManagerFactory')
//@Require('meldbugserver.MeldMirrorManager')
//@Require('meldbugserver.MeldMirrorService')
//@Require('meldbugserver.MeldbugServerService')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();
var connect                         = require('connect');
var express                         = require('express');
var path                            = require('path');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                           = bugpack.require('Class');
var Obj                             = bugpack.require('Obj');
var BugFlow                         = bugpack.require('bugflow.BugFlow');
var ArgAnnotation                   = bugpack.require('bugioc.ArgAnnotation');
var ConfigurationAnnotation         = bugpack.require('bugioc.ConfigurationAnnotation');
var IConfiguration                  = bugpack.require('bugioc.IConfiguration');
var ModuleAnnotation                = bugpack.require('bugioc.ModuleAnnotation');
var PropertyAnnotation              = bugpack.require('bugioc.PropertyAnnotation');
var BugMeta                         = bugpack.require('bugmeta.BugMeta');
var MeldBucket                      = bugpack.require('meldbug.MeldBucket');
var MeldBuilder                     = bugpack.require('meldbug.MeldBuilder');
var MeldManagerFactory              = bugpack.require('meldbug.MeldManagerFactory');
var MeldMirrorManager               = bugpack.require('meldbug.MeldMirrorManager');
var MeldMirrorService               = bugpack.require('meldbug.MeldMirrorService');
var MeldStore                       = bugpack.require('meldbug.MeldStore');
var MeldbugClientApi                = bugpack.require('meldbugserver.MeldbugClientApi');
var MeldbugClientConsumerManager    = bugpack.require('meldbugserver.MeldbugClientConsumerManager');
var MeldbugServerService            = bugpack.require('meldbugserver.MeldbugServerService');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                             = ArgAnnotation.arg;
var bugmeta                         = BugMeta.context();
var configuration                   = ConfigurationAnnotation.configuration;
var module                          = ModuleAnnotation.module;
var property                        = PropertyAnnotation.property;

var $parallel                       = BugFlow.$parallel;
var $series                         = BugFlow.$series;
var $task                           = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldbugServerConfiguration = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Variables
        //-------------------------------------------------------------------------------


    },


    //-------------------------------------------------------------------------------
    // Configuration Lifecycle
    //-------------------------------------------------------------------------------

    /**
     * @param {function(error)} callback
     */
    initializeConfiguration: function(callback) {
        var _this = this;
        console.log("Initializing MeldbugServerConfiguration");
        callback();
    },

    /**
     * @param {MeldbugClientConsumerManager} meldbugClientConsumerManager
     * @return {MeldbugClientApi}
     */
    meldbugClientApi: function(meldbugClientConsumerManager) {
        return new MeldbugClientApi(meldbugClientConsumerManager);
    },

    /**
     * @param {MeldBuilder} meldBuilder
     * @return {MeldbugClientConsumerManager}
     */
    meldbugClientConsumerManager: function(meldBuilder) {
        return new MeldbugClientConsumerManager(meldBuilder);
    },

    /**
     * @param {MeldbugClientConsumerManager} meldbugClientConsumerManager
     * @param {MeldbugClientApi} meldbugClientApi
     * @return {MeldbugServerService}
     */
    meldbugServerService: function(meldbugObjectManager, meldbugClientConsumerManager,  meldbugClientApi) {
        return new MeldbugServerService(meldbugObjectManager, meldbugClientConsumerManager, meldbugClientApi);
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
     * @return {MeldManagerFactory}
     */
    meldManagerFactory: function(meldStore) {
        return new MeldManagerFactory(meldStore);
    },

    /**
     * @return {MeldMirrorManager}
     */
    meldMirrorManager: function() {
        return new MeldMirrorManager();
    },

    /**
     * @param {BugCallServer} bugCallServer
     * @param {MeldMirrorManager} meldMirrorManager
     * @return {MeldMirrorService}
     */
    meldMirrorService: function(bugCallServer, meldMirrorManager) {
        return new MeldMirrorService(bugCallServer, meldMirrorManager);
    },

    /**
     * @param {MeldBucket} meldBucket
     * @return {MeldStore}
     */
    meldStore: function(meldBucket) {
        return new MeldStore(meldBucket);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(MeldbugServerConfiguration, IConfiguration);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(MeldbugServerConfiguration).with(
    configuration().modules([
        module("meldbugClientApi")
            .args([
                arg().ref("meldbugClientConsumerManager")
            ]),
        module("meldbugClientConsumerManager")
            .args([
                arg().ref("meldBuilder")
            ]),
        module("meldbugServerService")
            .args([
                arg().ref("meldbugObjectManager"),
                arg().ref("meldbugClientConsumerManager"),
                arg().ref("meldbugClientApi")
            ]),
        module("meldBuilder"),
        module("meldBucket"),
        module("meldManagerFactory"),
        module("meldMirrorManager"),
        module("meldMirrorService")
            .args([
                arg().ref("bugCallServer"),
                arg().ref("meldMirrorManager")
            ]),
        module("meldStore")
            .args([
                arg().ref("meldBucket")
            ])
    ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export("meldbugserver.MeldbugServerConfiguration", MeldbugServerConfiguration);
