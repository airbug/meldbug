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

//@Export('meldbugworker.MeldbugWorkerApplication')
//@Autoload

//@Require('Class')
//@Require('bugapp.Application')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class           = bugpack.require('Class');
    var Application     = bugpack.require('bugapp.Application');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Application}
     */
    var MeldbugWorkerApplication = Class.extend(Application, {

        _name: "meldbugworker.MeldbugWorkerApplication",


        //-------------------------------------------------------------------------------
        // Application Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        preConfigureApplication: function() {
            this.getModuleTagScan().scanBugpacks([
                "bugmarsh.MarshRegistry",
                "bugmarsh.Marshaller",
                "bugwork.WorkerCommandFactory",
                "bugwork.WorkerContextFactory",
                "bugwork.WorkerManager",
                "bugwork.WorkerProcessFactory",
                "bugwork.WorkerRegistry",
                "loggerbug.Logger",
                "meldbugworker.MeldbugWorkerConfiguration",
                "meldbugworker.MeldbugWorkerInitializer"
            ]);
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('meldbugworker.MeldbugWorkerApplication', MeldbugWorkerApplication);
});
