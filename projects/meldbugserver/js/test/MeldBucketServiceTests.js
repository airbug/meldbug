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

//@TestFile

//@Require('Class')
//@Require('Flows')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestTag')
//@Require('bugyarn.BugYarn')
//@Require('meldbugserver.MeldBucketService')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Flows               = bugpack.require('Flows');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var TestTag             = bugpack.require('bugunit.TestTag');
    var BugYarn             = bugpack.require('bugyarn.BugYarn');
    var MeldBucketService   = bugpack.require('meldbugserver.MeldBucketService');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta             = BugMeta.context();
    var bugyarn             = BugYarn.context();
    var test                = TestTag.test;
    var $series             = Flows.$series;
    var $task               = Flows.$task;


    //-------------------------------------------------------------------------------
    // BugYarn
    //-------------------------------------------------------------------------------

    bugyarn.registerWinder("setupTestMeldBucketService", function(yarn) {
        yarn.spin([
            "setupTestMeldBuilder",
            "setupTestMeldBucketManager",
            "setupTestBugCallServer"
        ]);
        yarn.wind({
            meldBucketService: new MeldBucketService(this.bugCallServer, this.meldBucketManager, this.meldBuilder)
        });
    });


    //-------------------------------------------------------------------------------
    // Test Setup
    //-------------------------------------------------------------------------------

    var setupMeldBucketService = function(setupObject, callback) {
        setupObject.marshRegistry.configureModule();
        $series([
            $task(function(flow) {
                setupObject.redisClient.connect(function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(callback);
    };


    //-------------------------------------------------------------------------------
    // Declare Tests
    //-------------------------------------------------------------------------------

    var meldBucketServiceInstantiationTest = {

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var yarn = bugyarn.yarn(this);
            yarn.spin([
                "setupTestMeldBuilder",
                "setupTestMeldBucketManager",
                "setupTestBugCallServer"
            ]);
            this.testMeldBucketService = new MeldBucketService(this.bugCallServer, this.meldBucketManager, this.meldBuilder);
        },


        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            test.assertTrue(Class.doesExtend(this.testMeldBucketService, MeldBucketService),
                "Assert that testMeldBucketService is an instance of MeldBucketService");
            test.assertEqual(this.testMeldBucketService.getBugCallServer(), this.bugCallServer,
                "Assert that .bugCallServer was set correctly");
            test.assertEqual(this.testMeldBucketService.getMeldBucketManager(), this.meldBucketManager,
                "Assert that .meldBucketManager was set correctly");
            test.assertEqual(this.testMeldBucketService.getMeldBuilder(), this.meldBuilder,
                "Assert that .meldBuilder was set correctly");
        }
    };

    var meldBucketServicePreProcessCallNotCreatedNotReconnectTest = {

        async: true,

        //-------------------------------------------------------------------------------
        // Setup Test
        //-------------------------------------------------------------------------------

        setup: function(test) {
            var _this   = this;
            var yarn    = bugyarn.yarn(this);
            yarn.spin([
                "setupTestMeldBucketService",
                "setupTestCall"
            ]);
            $task(function(flow) {
                setupMeldBucketService(_this, function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(function(throwable) {
                if (!throwable) {
                    test.completeSetup();
                } else {
                    test.error(throwable);
                }
            });
        },

        //-------------------------------------------------------------------------------
        // Run Test
        //-------------------------------------------------------------------------------

        test: function(test) {
            this.meldBucketService.preProcessCall(this.call, function(throwable) {
                if (!throwable) {
                    //TODO Validations
                    test.completeTest();
                } else {
                    test.error(throwable);
                }
            });
        }
    };


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(meldBucketServiceInstantiationTest).with(
        test().name("MeldBucketService - instantiation Test")
    );
    bugmeta.tag(meldBucketServicePreProcessCallNotCreatedNotReconnectTest).with(
        test().name("MeldBucketService - #preProcessCall not created not reconnect Test")
    );
});
