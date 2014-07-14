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

var version         = "0.0.10";
var dependencies    = {
    bugpack: "0.1.11",
    redis: "0.10.0",
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
            "../bugcore/projects/bugcore/js/src",
            "../bugfs/projects/bugfs/js/src",
            "../bugjs/projects/bugapp/js/src",
            "../bugjs/projects/bugcall/libraries/core/js/src",
            "../bugjs/projects/bugcall/libraries/publisher/js/src",
            "../bugjs/projects/bugdelta/js/src",
            "../bugjs/projects/bugioc/js/src",
            "../bugjs/projects/bugmarsh/js/src",
            "../bugjs/projects/bugsub/js/src",
            "../bugjs/projects/bugtask/js/src",
            "../bugjs/projects/bugwork/js/src",
            "../bugjs/projects/configbug/js/src",
            "../bugjs/projects/loggerbug/js/src",
            "../bugjs/projects/redis/js/src",
            "../bugjs/projects/socketio/libraries/socket/js/src",
            "../bugmeta/projects/bugmeta/js/src"
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
                    start: "node ./scripts/meldbug-worker-application-start.js"
                }
            },
            sourcePaths: [
                "../buganno/projects/buganno/js/src",
                "../bugjs/projects/bugyarn/js/src",
                "../bugunit/projects/bugdouble/js/src",
                "../bugunit/projects/bugunit/js/src"
            ],
            scriptPaths: [
                "../buganno/projects/buganno/js/scripts",
                "../bugunit/projects/bugunit/js/scripts"
            ],
            testPaths: [
                "./projects/meldbug/bugjars/core/js/test",
                "./projects/meldbug/bugjars/server/js/test",
                "./projects/meldbugworker/js/test",
                "../bugcore/projects/bugcore/js/test",
                "../bugfs/projects/bugfs/js/test",
                "../bugjs/projects/bugapp/js/test",
                "../bugjs/projects/bugcall/libraries/core/js/test",
                "../bugjs/projects/bugcall/libraries/publisher/js/test",
                "../bugjs/projects/bugdelta/js/test",
                "../bugjs/projects/bugioc/js/test",
                "../bugjs/projects/bugmarsh/js/test",
                "../bugjs/projects/bugsub/js/test",
                "../bugjs/projects/bugtask/js/test",
                "../bugjs/projects/bugwork/js/test",
                "../bugjs/projects/configbug/js/test",
                "../bugjs/projects/loggerbug/js/test",
                "../bugjs/projects/redis/js/test",
                "../bugjs/projects/socketio/libraries/socket/js/test",
                "../bugmeta/projects/bugmeta/js/test"
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
                        resourcePaths: buildProject.getProperty("worker.resourcePaths"),
                        sourcePaths: buildProject.getProperty("worker.sourcePaths").concat(
                            buildProject.getProperty("worker.unitTest.sourcePaths")
                        ),
                        scriptPaths: buildProject.getProperty("worker.scriptPaths").concat(
                            buildProject.getProperty("worker.unitTest.scriptPaths")
                        ),
                        testPaths: buildProject.getProperty("worker.unitTest.testPaths")
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
                        resourcePaths: buildProject.getProperty("worker.resourcePaths"),
                        sourcePaths: buildProject.getProperty("worker.sourcePaths").concat(
                            buildProject.getProperty("worker.unitTest.sourcePaths")
                        ),
                        scriptPaths: buildProject.getProperty("worker.scriptPaths").concat(
                            buildProject.getProperty("worker.unitTest.scriptPaths")
                        ),
                        testPaths: buildProject.getProperty("worker.unitTest.testPaths")
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
                        resourcePaths: buildProject.getProperty("worker.resourcePaths"),
                        sourcePaths: buildProject.getProperty("worker.sourcePaths"),
                        scriptPaths: buildProject.getProperty("worker.scriptPaths")
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
