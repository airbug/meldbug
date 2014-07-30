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
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // Common Modules
    //-------------------------------------------------------------------------------

    var redis               = require('redis');


    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var BugFs               = bugpack.require('bugfs.BugFs');
    var ConfigurationTag    = bugpack.require('bugioc.ConfigurationTag');
    var ModuleTag           = bugpack.require('bugioc.ModuleTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var Configbug           = bugpack.require('configbug.Configbug');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var configuration       = ConfigurationTag.configuration;
    var module              = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var MeldbugWorkerConfiguration = Class.extend(Obj, {

        _name: "meldbugworker.MeldbugWorkerConfiguration",


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
});
