//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('TaskManager')

//@Require('ArgUtil')
//@Require('Bug')
//@Require('Class')
//@Require('Obj')
//@Require('bugflow.BugFlow')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgUtil             = bugpack.require('ArgUtil');
var Bug                 = bugpack.require('Bug');
var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var BugFlow             = bugpack.require('bugflow.BugFlow');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $series             = BugFlow.$series;
var $task               = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @abstract
 * @class
 * @extends {Obj}
 */
var TaskManager = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {RedisClient} blockingRedisClient
     * @param {RedisClient} redisClient
     * @param {PubSub} pubSub
     * @param {string} taskQueueName
     */
    _constructor: function(blockingRedisClient, redisClient, pubSub, taskQueueName) {
        var args = ArgUtil.process(arguments, [
            {name: "blockingRedisClient", optional: false, type: "object"},
            {name: "redisClient", optional: false, type: "object"},
            {name: "pubSub", optional: false, type: "object"},
            {name: "taskQueueName", optional: false, type: "string"}
        ]);
        blockingRedisClient     = args.blockingRedisClient;
        redisClient             = args.redisClient;
        pubSub                  = args.pubSub;
        taskQueueName           = args.taskQueueName;

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {RedisClient}
         */
        this.blockingRedisClient    = blockingRedisClient;

        /**
         * @private
         * @type {PubSub}
         */
        this.pubSub                 = pubSub;

        /**
         * @private
         * @type {RedisClient}
         */
        this.redisClient            = redisClient;

        /**
         * @private
         * @type {string}
         */
        this.taskQueueName          = taskQueueName;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {RedisClient}
     */
    getBlockingRedisClient: function() {
        return this.blockingRedisClient;
    },

    /**
     * @return {string}
     */
    getProcessingQueueName: function() {
        return "processing:" + this.getTaskQueueName();
    },

    /**
     * @return {PubSub}
     */
    getPubSub: function() {
        return this.pubSub;
    },

    /**
     * @return {RedisClient}
     */
    getRedisClient: function() {
        return this.redisClient;
    },

    /**
     * @return {string}
     */
    getTaskQueueName: function() {
        return this.taskQueueName;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable, Task=)} callback
     */
    dequeueTask: function(callback) {
        var _this = this;
        this.blockingRedisClient.bRPopLPush(this.getTaskQueueName(), this.getProcessingQueueName(), 1000, function(error, reply) {
            if (!error) {
                if (reply) {
                    callback(null, _this.buildTaskFromDataString(reply));
                } else {
                    callback(null, null);
                }
            } else {
                callback(error);
            }
        });
    },

    /**
     * @param {Task} task
     * @param {function(Throwable, number=)} callback
     */
    completeTask: function(task, callback) {
        var _this           = this;
        var numberReceived  = 0;
        $series([
            $task(function(flow) {
                _this.finishTask(task, function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.reportTaskComplete(task, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                callback(null, numberReceived);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {Task} task
     * @param {function(Throwable)} callback
     */
    finishTask: function(task, callback) {
        var _this           = this;
        var taskDataString  = this.unbuildTaskToDataString(task);
        $series([
            $task(function(flow) {
                _this.redisClient.lRem(_this.getProcessingQueueName(), -1, taskDataString, function(error, reply) {
                    flow.complete(error);
                });
            })
        ]).execute(callback);
    },

    /**
     * @param {Task} task
     * @param {function(Throwable=)} callback
     */
    queueTask: function(task, callback) {
        var taskDataString = this.unbuildTaskToDataString(task);
        this.redisClient.lPush(this.getTaskQueueName(), taskDataString, function(error, reply) {
            if (!error) {
                callback();
            } else {
                callback(error);
            }
        });
    },

    /**
     * @param {Task} task
     * @param {function(Throwable, number=)} callback
     */
    reportTaskComplete: function(task, callback) {
        var _this           = this;
        var numberReceived  = 0;
        $series([
            $task(function(flow) {
                var messageData = {
                    taskUuid: task.getTaskUuid()
                };
                _this.pubSub.publish(_this.generateTaskCompleteChannel(task), messageData, function(throwable, reply) {
                    if (!throwable) {
                        numberReceived = reply;
                    }
                    flow.complete(throwable);
                })
            })
        ]).execute(function(throwable) {
            if (!throwable) {
                callback(null, numberReceived);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {Task} task
     * @param {function(Message)} subscriberFunction
     * @param {Object} subscriberContext
     * @param {function(Throwable=)} callback
     */
    subscribeToTaskComplete: function(task, subscriberFunction, subscriberContext, callback) {
        var _this               = this;
        var taskCompleteChannel = this.generateTaskCompleteChannel(task);
        $series([
            $task(function(flow) {
                _this.pubSub.subscribe(taskCompleteChannel, subscriberFunction, subscriberContext, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(callback);
    },


    //-------------------------------------------------------------------------------
    // Abstract Methods
    //-------------------------------------------------------------------------------

    /**
     * @abstract
     * @param {Object} taskData
     * @return {Task}
     */
    buildTask: function(taskData) {
        throw new Bug("AbstractMethodNotImplemented");
    },

    /**
     * @abstract
     * @param {Task} task
     * @return {Object}
     */
    unbuildTask: function(task) {
        throw new Bug("AbstractMethodNotImplemented");
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} taskDataString
     * @return {Task}
     */
    buildTaskFromDataString: function(taskDataString) {
        var taskData = JSON.parse(taskDataString);
        return this.buildTask(taskData);
    },

    /**
     * @private
     * @param {Task} task
     * @returns {string}
     */
    generateTaskCompleteChannel: function(task) {
        return "taskComplete:" + task.getTaskUuid();
    },

    /**
     * @private
     * @param {Task} task
     * @return {string}
     */
    unbuildTaskToDataString: function(task) {
        var taskData = this.unbuildTask(task);
        return JSON.stringify(taskData);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.TaskManager', TaskManager);
