/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var buildbug            = require('buildbug');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var buildProject        = buildbug.buildProject;
var buildProperties     = buildbug.buildProperties;
var buildScript         = buildbug.buildScript;
var buildTarget         = buildbug.buildTarget;
var enableModule        = buildbug.enableModule;
var parallel            = buildbug.parallel;
var series              = buildbug.series;
var targetTask          = buildbug.targetTask;


//-------------------------------------------------------------------------------
// Enable Modules
//-------------------------------------------------------------------------------

var aws                 = enableModule("aws");
var bugpack             = enableModule('bugpack');
var bugunit             = enableModule('bugunit');
var core                = enableModule('core');
var lintbug             = enableModule("lintbug");
var nodejs              = enableModule('nodejs');


//-------------------------------------------------------------------------------
// Values
//-------------------------------------------------------------------------------

var version         = "0.1.0";
var dependencies    = {
    bugpack: "0.2.0",
    redis: "0.11.0",
    "socket.io": "0.9.16"
};


//-------------------------------------------------------------------------------
// Declare Properties
//-------------------------------------------------------------------------------

buildProperties({
    worker: {
        packageJson: {
            name: "meldbugworker",
            version: version,
            dependencies: dependencies,
            scripts: {
                start: "node ./scripts/meldbug-worker-application-start.js"
            }
        },
        resourcePaths: [
            "./projects/meldbugworker/resources"
        ],
        sourcePaths: [
            "./projects/meldbug/bugjars/core/js/src",
            "./projects/meldbug/bugjars/server/js/src",
            "./projects/meldbugworker/js/src",
            "../bugapp/libraries/bugapp/js/src",
            "../bugcall/libraries/core/js/src",
            "../bugcall/libraries/publisher/js/src",
            "../bugcore/libraries/bugcore/js/src",
            "../bugfs/libraries/bugfs/js/src",
            "../bugioc/libraries/bugioc/js/src",
            "../bugjs/projects/bugdelta/js/src",
            "../bugjs/projects/bugmarsh/js/src",
            "../bugjs/projects/bugsub/js/src",
            "../bugjs/projects/bugtask/js/src",
            "../bugjs/projects/bugwork/js/src",
            "../bugjs/projects/configbug/js/src",
            "../bugjs/projects/loggerbug/js/src",
            "../bugjs/projects/redis/js/src",
            "../bugjs/projects/socketio/libraries/socket/js/src",
            "../bugmeta/libraries/bugmeta/js/src"
        ],
        scriptPaths: [
            "../bugjs/projects/bugwork/js/scripts",
            "./projects/meldbugworker/js/scripts"
        ],
        unitTest: {
            packageJson: {
                name: "meldbugworker-test",
                version: version,
                dependencies: dependencies,
                scripts: {
                    start: "node ./scripts/meldbug-worker-application-start.js",
                    test: "node ./test/scripts/bugunit-run.js"
                }
            },
            sourcePaths: [
                "../buganno/libraries/buganno/js/src",
                "../bugdouble/libraries/bugdouble/js/src",
                "../bugunit/libraries/bugunit/js/src",
                "../bugyarn/libraries/bugyarn/js/src"
            ],
            scriptPaths: [
                "../buganno/libraries/buganno/js/scripts",
                "../bugunit/libraries/bugunit/js/scripts"
            ],
            testPaths: [
                "./projects/meldbug/bugjars/core/js/test",
                "./projects/meldbug/bugjars/server/js/test",
                "./projects/meldbugworker/js/test",
                "../bugapp/libraries/bugapp/js/test",
                "../bugcall/libraries/core/js/test",
                "../bugcall/libraries/publisher/js/test",
                "../bugcore/libraries/bugcore/js/test",
                "../bugfs/libraries/bugfs/js/test",
                "../bugioc/libraries/bugioc/js/test",
                "../bugjs/projects/bugdelta/js/test",
                "../bugjs/projects/bugmarsh/js/test",
                "../bugjs/projects/bugsub/js/test",
                "../bugjs/projects/bugtask/js/test",
                "../bugjs/projects/bugwork/js/test",
                "../bugjs/projects/configbug/js/test",
                "../bugjs/projects/loggerbug/js/test",
                "../bugjs/projects/redis/js/test",
                "../bugjs/projects/socketio/libraries/socket/js/test",
                "../bugmeta/libraries/bugmeta/js/test"
            ]
        }
    },
    lint: {
        targetPaths: [
            "."
        ],
        ignorePatterns: [
            ".*\\.buildbug$",
            ".*\\.bugunit$",
            ".*\\.git$",
            ".*node_modules$"
        ]
    }
});


//-------------------------------------------------------------------------------
// Declare BuildTargets
//-------------------------------------------------------------------------------

// Clean BuildTarget
//-------------------------------------------------------------------------------

buildTarget('clean').buildFlow(
    targetTask('clean')
);


// Local BuildTarget
//-------------------------------------------------------------------------------

buildTarget('local').buildFlow(
    series([

        // TODO BRN: This "clean" task is temporary until we're not modifying the build so much. This also ensures that
        // old source files are removed. We should figure out a better way of doing that.

        targetTask('clean'),
        targetTask('lint', {
            properties: {
                targetPaths: buildProject.getProperty("lint.targetPaths"),
                ignores: buildProject.getProperty("lint.ignorePatterns"),
                lintTasks: [
                    "cleanupExtraSpacingAtEndOfLines",
                    "ensureNewLineEnding",
                    "indentEqualSignsForPreClassVars",
                    "orderBugpackRequires",
                    "orderRequireAnnotations",
                    "updateCopyright"
                ]
            }
        }),
        parallel([
            series([
                targetTask('createNodePackage', {
                    properties: {
                        packageJson: buildProject.getProperty("worker.packageJson"),
                        packagePaths: {
                            "./lib": buildProject.getProperty("worker.sourcePaths"),
                            "./resources": buildProject.getProperty("worker.resourcePaths"),
                            "./scripts": buildProject.getProperty("worker.scriptPaths"),
                            "./test": buildProject.getProperty("worker.unitTest.testPaths"),
                            "./test/lib": buildProject.getProperty("worker.unitTest.sourcePaths"),
                            "./test/scripts": buildProject.getProperty("worker.unitTest.scriptPaths")
                        }
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    init: function(task, buildProject, properties) {
                        var nodePackage = nodejs.findNodePackage(
                            buildProject.getProperty("worker.packageJson.name"),
                            buildProject.getProperty("worker.packageJson.version")
                        );
                        task.updateProperties({
                            sourceRoot: nodePackage.getBuildPath()
                        });
                    }
                }),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: buildProject.getProperty("worker.packageJson.name"),
                        packageVersion: buildProject.getProperty("worker.packageJson.version")
                    }
                }),
                targetTask('startNodeModuleTests', {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(
                            buildProject.getProperty("worker.packageJson.name"),
                            buildProject.getProperty("worker.packageJson.version")
                        );
                        task.updateProperties({
                            modulePath: packedNodePackage.getFilePath()
                        });
                    }
                }),
                targetTask("s3PutFile", {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(buildProject.getProperty("worker.packageJson.name"),
                            buildProject.getProperty("worker.packageJson.version"));
                        task.updateProperties({
                            file: packedNodePackage.getFilePath(),
                            options: {

                                //TODO BRN: In order to protect this file we need to limit the access to this artifact and provide some sort of http auth access so that the artifacts are retrievable via npm install. This would need to be done in a server wrapper.

                                acl: 'public-read',
                                encrypt: true
                            }
                        });
                    },
                    properties: {
                        bucket: "{{local-bucket}}"
                    }
                })
            ])
        ])
    ])
).makeDefault();


// Prod BuildTarget
//-------------------------------------------------------------------------------

buildTarget('prod').buildFlow(
    series([

        // TODO BRN: This "clean" task is temporary until we're not modifying the build so much. This also ensures that
        // old source files are removed. We should figure out a better way of doing that.

        targetTask('clean'),
        targetTask('lint', {
            properties: {
                targetPaths: buildProject.getProperty("lint.targetPaths"),
                ignores: buildProject.getProperty("lint.ignorePatterns"),
                lintTasks: [
                    "cleanupExtraSpacingAtEndOfLines",
                    "ensureNewLineEnding",
                    "indentEqualSignsForPreClassVars",
                    "orderBugpackRequires",
                    "orderRequireAnnotations",
                    "updateCopyright"
                ]
            }
        }),
        parallel([

            //Create test package (this is not the production package). We create a different package for testing so that the production code does not have the unit test code in it.

            series([
                targetTask('createNodePackage', {
                    properties: {
                        packageJson: buildProject.getProperty("worker.unitTest.packageJson"),
                        packagePaths: {
                            "./lib": buildProject.getProperty("worker.sourcePaths"),
                            "./resources": buildProject.getProperty("worker.resourcePaths"),
                            "./scripts": buildProject.getProperty("worker.scriptPaths"),
                            "./test": buildProject.getProperty("worker.unitTest.testPaths"),
                            "./test/lib": buildProject.getProperty("worker.unitTest.sourcePaths"),
                            "./test/scripts": buildProject.getProperty("worker.unitTest.scriptPaths")
                        }
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    init: function(task, buildProject, properties) {
                        var nodePackage = nodejs.findNodePackage(
                            buildProject.getProperty("worker.unitTest.packageJson.name"),
                            buildProject.getProperty("worker.unitTest.packageJson.version")
                        );
                        task.updateProperties({
                            sourceRoot: nodePackage.getBuildPath()
                        });
                    }
                }),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: buildProject.getProperty("worker.unitTest.packageJson.name"),
                        packageVersion: buildProject.getProperty("worker.unitTest.packageJson.version")
                    }
                }),
                targetTask('startNodeModuleTests', {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(
                            buildProject.getProperty("worker.unitTest.packageJson.name"),
                            buildProject.getProperty("worker.unitTest.packageJson.version")
                        );
                        task.updateProperties({
                            modulePath: packedNodePackage.getFilePath(),
                            checkCoverage: true
                        });
                    }
                })
            ]),

            // Create production package

            series([
                targetTask('createNodePackage', {
                    properties: {
                        packageJson: buildProject.getProperty("worker.packageJson"),
                        packagePaths: {
                            "./lib": buildProject.getProperty("worker.sourcePaths"),
                            "./resources": buildProject.getProperty("worker.resourcePaths"),
                            "./scripts": buildProject.getProperty("worker.scriptPaths")
                        }
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    init: function(task, buildProject, properties) {
                        var nodePackage = nodejs.findNodePackage(
                            buildProject.getProperty("worker.packageJson.name"),
                            buildProject.getProperty("worker.packageJson.version")
                        );
                        task.updateProperties({
                            sourceRoot: nodePackage.getBuildPath()
                        });
                    }
                }),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: buildProject.getProperty("worker.packageJson.name"),
                        packageVersion: buildProject.getProperty("worker.packageJson.version")
                    }
                }),
                targetTask("s3PutFile", {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(buildProject.getProperty("worker.packageJson.name"),
                            buildProject.getProperty("worker.packageJson.version"));
                        task.updateProperties({
                            file: packedNodePackage.getFilePath(),
                            options: {

                                //TODO BRN: In order to protect this file we need to limit the access to this artifact and provide some sort of http auth access so that the artifacts are retrievable via npm install. This would need to be done in a server wrapper.

                                acl: 'public-read',
                                encrypt: true
                            }
                        });
                    },
                    properties: {
                        bucket: "{{prod-deploy-bucket}}"
                    }
                })
            ])
        ])
    ])
);


//-------------------------------------------------------------------------------
// Build Scripts
//-------------------------------------------------------------------------------

buildScript({
    dependencies: [
        "bugcore",
        "bugflow",
        "bugfs"
    ],
    script: "./lintbug.js"
});
