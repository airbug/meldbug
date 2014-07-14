/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbugclient.MeldbugClientConfiguration')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ConfigurationTag')
//@Require('bugioc.IInitializingModule')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('meldbug.MeldBucket')
//@Require('meldbug.MeldStore')
//@Require('meldbugclient.MeldbugClientController')
//@Require('meldbugclient.MeldbugClientService')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var Obj                         = bugpack.require('Obj');
    var ArgTag                      = bugpack.require('bugioc.ArgTag');
    var ConfigurationTag            = bugpack.require('bugioc.ConfigurationTag');
    var IInitializingModule         = bugpack.require('bugioc.IInitializingModule');
    var ModuleTag                   = bugpack.require('bugioc.ModuleTag');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');
    var MeldBucket                  = bugpack.require('meldbug.MeldBucket');
    var MeldStore                   = bugpack.require('meldbug.MeldStore');
    var MeldbugClientController     = bugpack.require('meldbugclient.MeldbugClientController');
    var MeldbugClientService        = bugpack.require('meldbugclient.MeldbugClientService');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                         = ArgTag.arg;
    var bugmeta                     = BugMeta.context();
    var configuration               = ConfigurationTag.configuration;
    var module                      = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     * @implements {IInitializingModule}
     */
    var MeldbugClientConfiguration = Class.extend(Obj, {

        _name: "meldbugclient.MeldbugClientConfiguration",


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
             * @type {MeldbugClientController}
             */
            this._meldbugClientController             = null;
        },


        //-------------------------------------------------------------------------------
        // IInitializingModule Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {function(Throwable=)} callback
         */
        deinitializeModule: function(callback) {
            callback();
        },

        /**
         * @param {function(Throwable=)} callback
         */
        initializeModule: function(callback) {
            this._meldbugClientController.configure(callback);
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

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
         * @param {MeldBuilder} meldBuilder
         * @return {MeldbugClientController}
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

    Class.implement(MeldbugClientConfiguration, IInitializingModule);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(MeldbugClientConfiguration).with(
        configuration("meldbugClientConfiguration").modules([
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
});
