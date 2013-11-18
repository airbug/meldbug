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
// Declare Properties
//-------------------------------------------------------------------------------

buildProperties({
    meldbugserver: {
        packageJson: {
            name: "meldbugserver",
            version: "0.0.1",
            dependencies: {
                bugpack: "https://s3.amazonaws.com/airbug/bugpack-0.0.5.tgz",
                express: "3.2.x",
                share: "0.6.x"
            },
            scripts: {
                start: "node ./scripts/meldbug-server-application-start.js"
            }
        },
        sourcePaths: [
            "./projects/meldbugserver/js/src",
            "../bugjs/projects/bugmeta/js/src",
            "../bugjs/projects/bugflow/js/src",
            "../bugjs/projects/bugfs/js/src",
            "../bugjs/projects/bugioc/js/src",
            "../bugjs/projects/bugjs/js/src",
            "../bugjs/projects/bugtrace/js/src",
            "../bugjs/projects/express/js/src",
            "../bugjs/projects/sharejs/bugjars/server/js/src",
            "../bugunit/projects/bugdouble/js/src",
            "../bugunit/projects/bugunit/js/src"
        ],
        scriptPaths: [
            "./projects/meldbugserver/js/scripts",
            "../bugunit/projects/bugunit/js/scripts"
        ],
        testPaths: [
            "../bugjs/projects/bugcall/js/test",
            "../bugjs/projects/bugflow/js/test",
            "../bugjs/projects/bugjs/js/test",
            "../bugjs/projects/bugtrace/js/test"
        ]
    },
    meldbugclient: {
        clientJson: {
            name: "meldbug",
            version: "0.0.1",
            main: "./lib/MeldbugClientModule.js"
        },
        sourcePaths: [
            "./projects/meldbugclient/js/src",
            "../bugjs/projects/bugmeta/js/src",
            "../bugjs/projects/bugcall/js/src",
            "../bugjs/projects/bugflow/js/src",
            "../bugjs/projects/bugfs/js/src",
            "../bugjs/projects/bugioc/js/src",
            "../bugjs/projects/bugjs/js/src",
            "../bugjs/projects/bugroute/bugjars/bugcall/js/src",
            "../bugjs/projects/bugtrace/js/src",
            "../bugjs/projects/express/js/src",
            "../bugjs/projects/socketio/bugjars/client/js/src",
            "../bugjs/projects/socketio/bugjars/factoryserver/js/src",
            "../bugjs/projects/socketio/bugjars/socket/js/src",
            "../bugunit/projects/bugdouble/js/src",
            "../bugunit/projects/bugunit/js/src"
        ],
        scriptPaths: [
            "./projects/meldbugclient/js/scripts",
            "../bugunit/projects/bugunit/js/scripts"
        ],
        testPaths: [
            "../bugjs/projects/bugflow/js/test",
            "../bugjs/projects/bugjs/js/test",
            "../bugjs/projects/bugtrace/js/test"
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
                        packageJson: buildProject.getProperty("meldbugserver.packageJson"),
                        sourcePaths: buildProject.getProperty("meldbugserver.sourcePaths"),
                        scriptPaths: buildProject.getProperty("meldbugserver.scriptPaths"),
                        testPaths: buildProject.getProperty("meldbugserver.testPaths")
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    init: function(task, buildProject, properties) {
                        var nodePackage = nodejs.findNodePackage(
                            buildProject.getProperty("meldbugserver.packageJson.name"),
                            buildProject.getProperty("meldbugserver.packageJson.version")
                        );
                        task.updateProperties({
                            sourceRoot: nodePackage.getBuildPath()
                        });
                    }
                }),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: buildProject.getProperty("meldbugserver.packageJson.name"),
                        packageVersion: buildProject.getProperty("meldbugserver.packageJson.version")
                    }
                }),
                targetTask('startNodeModuleTests', {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(
                            buildProject.getProperty("meldbugserver.packageJson.name"),
                            buildProject.getProperty("meldbugserver.packageJson.version")
                        );
                        task.updateProperties({
                            modulePath: packedNodePackage.getFilePath()
                        });
                    }
                }),
                targetTask("s3EnsureBucket", {
                    properties: {
                        bucket: buildProject.getProperty("local-bucket")
                    }
                }),
                targetTask("s3PutFile", {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(buildProject.getProperty("meldbugserver.packageJson.name"),
                            buildProject.getProperty("meldbugserver.packageJson.version"));
                        task.updateProperties({
                            file: packedNodePackage.getFilePath(),
                            options: {
                                acl: 'public-read'
                            }
                        });
                    },
                    properties: {
                        bucket: buildProject.getProperty("local-bucket")
                    }
                })
            ])/*,
            series([
                targetTask('createNodePackage', {
                    properties: {
                        packageJson: buildProject.getProperty("meldbugclient.packageJson"),
                        sourcePaths: buildProject.getProperty("meldbugclient.sourcePaths"),
                        scriptPaths: buildProject.getProperty("meldbugclient.scriptPaths"),
                        testPaths: buildProject.getProperty("meldbugclient.testPaths")
                    }
                }),
                targetTask('generateBugPackRegistry', {
                    init: function(task, buildProject, properties) {
                        var nodePackage = nodejs.findNodePackage(
                            buildProject.getProperty("meldbugclient.packageJson.name"),
                            buildProject.getProperty("meldbugclient.packageJson.version")
                        );
                        task.updateProperties({
                            sourceRoot: nodePackage.getBuildPath()
                        });
                    }
                }),
                targetTask('packNodePackage', {
                    properties: {
                        packageName: buildProject.getProperty("meldbugclient.packageJson.name"),
                        packageVersion: buildProject.getProperty("meldbugclient.packageJson.version")
                    }
                }),
                targetTask('startNodeModuleTests', {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(
                            buildProject.getProperty("meldbugclient.packageJson.name"),
                            buildProject.getProperty("meldbugclient.packageJson.version")
                        );
                        task.updateProperties({
                            modulePath: packedNodePackage.getFilePath()
                        });
                    }
                }),
                targetTask("s3EnsureBucket", {
                    properties: {
                        bucket: buildProject.getProperty("local-bucket")
                    }
                }),
                targetTask("s3PutFile", {
                    init: function(task, buildProject, properties) {
                        var packedNodePackage = nodejs.findPackedNodePackage(buildProject.getProperty("meldbugclient.packageJson.name"),
                            buildProject.getProperty("meldbugclient.packageJson.version"));
                        task.updateProperties({
                            file: packedNodePackage.getFilePath(),
                            options: {
                                acl: 'public-read'
                            }
                        });
                    },
                    properties: {
                        bucket: buildProject.getProperty("local-bucket")
                    }
                })
            ])*/
        ])
    ])
).makeDefault();
