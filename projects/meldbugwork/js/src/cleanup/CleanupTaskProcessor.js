//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('CleanupTaskProcessor')

//@Require('Bug')
//@Require('Class')
//@Require('bugflow.BugFlow')
//@Require('meldbug.TaskProcessor')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Bug                 = bugpack.require('Bug');
var Class               = bugpack.require('Class');
var BugFlow             = bugpack.require('bugflow.BugFlow');
var TaskProcessor       = bugpack.require('meldbug.TaskProcessor');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $iterableParallel   = BugFlow.$iterableParallel;
var $parallel           = BugFlow.$parallel;
var $series             = BugFlow.$series;
var $task               = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {TaskProcessor}
 */
var CleanupTaskProcessor = Class.extend(TaskProcessor, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {CleanupTaskManager} cleanupTaskManager
     * @param {MeldBucketManager} meldBucketManager
     * @param {MeldManager} meldManager
     * @param {MeldClientManager} meldClientManager
     */
    _constructor: function(cleanupTaskManager, meldBucketManager, meldManager, meldClientManager) {

        this._super(cleanupTaskManager);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CleanupTaskManager}
         */
        this.cleanupTaskManager     = cleanupTaskManager;

        /**
         * @private
         * @type {MeldBucketManager}
         */
        this.meldBucketManager  = meldBucketManager;

        /**
         * @private
         * @type {MeldClientManager}
         */
        this.meldClientManager  = meldClientManager;

        /**
         * @private
         * @type {MeldManager}
         */
        this.meldManager        = meldManager;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {CleanupTaskManager}
     */
    getCleanupTaskManager: function() {
        return this.cleanupTaskManager;
    },

    /**
     * @return {MeldBucketManager}
     */
    getMeldBucketManager: function() {
        return this.meldBucketManager;
    },

    /**
     * @return {MeldClientManager}
     */
    getMeldClientManager: function() {
        return this.meldClientManager;
    },

    /**
     * @return {MeldManager}
     */
    getMeldManager: function() {
        return this.meldManager;
    },


    //-------------------------------------------------------------------------------
    // TaskProcessor Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {CleanupTask} cleanupTask
     * @param {function(Throwable=)} callback
     */
    doTask: function(cleanupTask, callback) {

        console.log("Processing CleanupTask - taskUuid:", cleanupTask.getTaskUuid(), " callUuid", cleanupTask.getCallUuid());

        var _this       = this;
        var callUuid    = cleanupTask.getCallUuid();
        $series([
            $parallel([
                $task(function(flow) {
                    var mirrorMeldBucketKey = _this.meldBucketManager.generateMeldBucketKey("mirrorMeldBucket", callUuid);
                    _this.meldBucketManager.deleteMeldBucketByKey(mirrorMeldBucketKey, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    var serverMeldBucketKey = _this.meldBucketManager.generateMeldBucketKey("serverMeldBucket", callUuid);
                    _this.meldBucketManager.deleteMeldBucketByKey(serverMeldBucketKey, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    _this.meldManager.removeCallUuid(callUuid, function(throwable) {
                        flow.complete(throwable);
                    });
                }),
                $task(function(flow) {
                    var meldClientKey = _this.meldClientManager.generateMeldClientKey(callUuid);
                    _this.meldClientManager.removeMeldClientForKey(meldClientKey, function(throwable) {
                        flow.complete(throwable);
                    });
                })
            ]),
            $task(function(flow) {
                _this.cleanupTaskManager.completeTask(cleanupTask, function(throwable) {
                    console.log("CleanupTask complete - taskUuid:", cleanupTask.getTaskUuid(), " callUuid", cleanupTask.getCallUuid());
                    flow.complete(throwable);
                });
            })
        ]).execute(callback);
    }

});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.CleanupTaskProcessor', CleanupTaskProcessor);
