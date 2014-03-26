//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

var buildbug        = require('buildbug');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var buildProject    = buildbug.buildProject;
var buildProperties = buildbug.buildProperties;
var buildTarget     = buildbug.buildTarget;
var enableModule    = buildbug.enableModule;
var parallel        = buildbug.parallel;
var series          = buildbug.series;
var targetTask      = buildbug.targetTask;


//-------------------------------------------------------------------------------
// Enable Modules
//-------------------------------------------------------------------------------

var aws             = enableModule("aws");
var bugpack         = enableModule('bugpack');
var bugunit         = enableModule('bugunit');
var clientjs        = enableModule('clientjs');
var core            = enableModule('core');
var nodejs          = enableModule('nodejs');


//-------------------------------------------------------------------------------
// Values
//-------------------------------------------------------------------------------

var version         = "0.0.8";
var dependencies    = {
    bugpack: "https://s3.amazonaws.com/airbug/bugpack-0.0.5.tgz",
    redis: "0.10.0",
    "socket.io": "0.9.16"
};


//-------------------------------------------------------------------------------
// Declare Properties
//-------------------------------------------------------------------------------

buildProperties({
    work: {
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
            "../bugjs/projects/bugcall/bugjars/core/js/src",
            "../bugjs/projects/bugcall/bugjars/publisher/js/src",
            "../bugjs/projects/bugdelta/js/src",
            "../bugjs/projects/bugflow/js/src",
            "../bugjs/projects/bugfs/js/src",
            "../bugjs/projects/bugioc/js/src",
            "../bugjs/projects/bugjs/js/src",
            "../bugjs/projects/bugmarsh/js/src",
            "../bugjs/projects/bugmeta/js/src",
            "../bugjs/projects/bugsub/js/src",
            "../bugjs/projects/bugtrace/js/src",
            "../bugjs/projects/bugwork/js/src",
            "../bugjs/projects/configbug/js/src",
            "../bugjs/projects/loggerbug/js/src",
            "../bugjs/projects/redis/js/src",
            "../bugjs/projects/socketio/bugjars/socket/js/src"
        ],
        scriptPaths: [
            "../bugjs/projects/bugwork/js/scripts",
            "./projects/meldbugworker/js/scripts"
        ]
    },
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
            "../bugjs/projects/bugyarn/js/src",
            "../bugunit/projects/bugdouble/js/src",
            "../bugunit/projects/bugunit/js/src"
        ],
        scriptPaths: [
            "../bugunit/projects/bugunit/js/scripts"
        ],
        testPaths: [
            "./projects/meldbug/bugjars/core/js/test",
            "./projects/meldbug/bugjars/server/js/test",
            "./projects/meldbugworker/js/test",
            "../bugjs/projects/bugcall/bugjars/core/js/test",
            "../bugjs/projects/bugcall/bugjars/publisher/js/test",
            "../bugjs/projects/bugdelta/js/test",
            "../bugjs/projects/bugflow/js/test",
            "../bugjs/projects/bugioc/js/test",
            "../bugjs/projects/bugjs/js/test",
            "../bugjs/projects/bugmarsh/js/test",
            "../bugjs/projects/bugmeta/js/test",
            "../bugjs/projects/bugsub/js/test",
            "../bugjs/projects/bugtrace/js/test",
            "../bugjs/projects/bugwork/js/test",
            "../bugjs/projects/configbug/js/test",
            "../bugjs/projects/loggerbug/js/test",
            "../bugjs/projects/redis/js/test",
            "../bugjs/projects/socketio/bugjars/socket/js/test"
        ]
    }
});


//-------------------------------------------------------------------------------
// Declare Tasks
//-------------------------------------------------------------------------------


//-------------------------------------------------------------------------------
// Declare Flows
//-------------------------------------------------------------------------------

// Clean Flow
//-------------------------------------------------------------------------------

buildTarget('clean').buildFlow(
    targetTask('clean')
);


// Local Flow
//-------------------------------------------------------------------------------

buildTarget('local').buildFlow(
    series([

        // TODO BRN: This "clean" task is temporary until we're not modifying the build so much. This also ensures that
        // old source files are removed. We should figure out a better way of doing that.

        targetTask('clean'),
        parallel([
            series([
                targetTask('createNodePackage', {
                    properties: {
                        packageJson: buildProject.getProperty("work.packageJson"),
                        resourcePaths: buildProject.getProperty("work.resourcePaths"),
                        sourcePaths: buildProject.getProperty("work.sourcePaths").concat(
                            buildProject.getProperty("unitTest.sourcePaths")
                        ),
                        scriptPaths: buildProject.getProperty("work.scriptPaths").concat(
                            buildProject.getProperty("unitTest.scriptPaths")
                        ),
                        testPaths: buildProject.getProperty("unitTest.testPaths")
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    init: function(task, buildProject, properties) {
                        var nodePackage = nodejs.findNodePackage(
                            buildProject.getProperty("work.packageJson.name"),
                            buildProject.getProperty("work.packageJson.version")
                        );
                        task.updateProperties({
                            sourceRoot: nodePackage.getBuildPath()
                        });
                    }
                }),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: buildProject.getProperty("work.packageJson.name"),
                        packageVersion: buildProject.getProperty("work.packageJson.version")
                    }
                }),
                targetTask('startNodeModuleTests', {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(
                            buildProject.getProperty("work.packageJson.name"),
                            buildProject.getProperty("work.packageJson.version")
                        );
                        task.updateProperties({
                            modulePath: packedNodePackage.getFilePath()
                        });
                    }
                }),
                targetTask("s3PutFile", {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(buildProject.getProperty("work.packageJson.name"),
                            buildProject.getProperty("work.packageJson.version"));
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


// Prod Flow
//-------------------------------------------------------------------------------

buildTarget('prod').buildFlow(
    series([

        // TODO BRN: This "clean" task is temporary until we're not modifying the build so much. This also ensures that
        // old source files are removed. We should figure out a better way of doing that.

        targetTask('clean'),
        parallel([

            //Create test package (this is not the production package). We create a different package for testing so that the production code does not have the unit test code in it.

            series([
                targetTask('createNodePackage', {
                    properties: {
                        packageJson: buildProject.getProperty("unitTest.packageJson"),
                        resourcePaths: buildProject.getProperty("work.resourcePaths"),
                        sourcePaths: buildProject.getProperty("work.sourcePaths").concat(
                            buildProject.getProperty("unitTest.sourcePaths")
                        ),
                        scriptPaths: buildProject.getProperty("work.scriptPaths").concat(
                            buildProject.getProperty("unitTest.scriptPaths")
                        ),
                        testPaths: buildProject.getProperty("unitTest.testPaths")
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    init: function(task, buildProject, properties) {
                        var nodePackage = nodejs.findNodePackage(
                            buildProject.getProperty("unitTest.packageJson.name"),
                            buildProject.getProperty("unitTest.packageJson.version")
                        );
                        task.updateProperties({
                            sourceRoot: nodePackage.getBuildPath()
                        });
                    }
                }),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: buildProject.getProperty("unitTest.packageJson.name"),
                        packageVersion: buildProject.getProperty("unitTest.packageJson.version")
                    }
                }),
                targetTask('startNodeModuleTests', {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(
                            buildProject.getProperty("unitTest.packageJson.name"),
                            buildProject.getProperty("unitTest.packageJson.version")
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
                        packageJson: buildProject.getProperty("work.packageJson"),
                        resourcePaths: buildProject.getProperty("work.resourcePaths"),
                        sourcePaths: buildProject.getProperty("work.sourcePaths"),
                        scriptPaths: buildProject.getProperty("work.scriptPaths")
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    init: function(task, buildProject, properties) {
                        var nodePackage = nodejs.findNodePackage(
                            buildProject.getProperty("work.packageJson.name"),
                            buildProject.getProperty("work.packageJson.version")
                        );
                        task.updateProperties({
                            sourceRoot: nodePackage.getBuildPath()
                        });
                    }
                }),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: buildProject.getProperty("work.packageJson.name"),
                        packageVersion: buildProject.getProperty("work.packageJson.version")
                    }
                }),
                targetTask("s3PutFile", {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(buildProject.getProperty("work.packageJson.name"),
                            buildProject.getProperty("work.packageJson.version"));
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
