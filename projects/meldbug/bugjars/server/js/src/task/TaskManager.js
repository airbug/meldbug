//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('TaskManager')

//@Require('ArgUtil')
//@Require('Bug')
//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('bugflow.BugFlow')
//@Require('bugtrace.BugTrace')
//@Require('meldbug.TaskDefines')


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
var Exception           = bugpack.require('Exception');
var Obj                 = bugpack.require('Obj');
var BugFlow             = bugpack.require('bugflow.BugFlow');
var BugTrace            = bugpack.require('bugtrace.BugTrace');
var TaskDefines         = bugpack.require('meldbug.TaskDefines');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $series             = BugFlow.$series;
var $task               = BugFlow.$task;
var $traceWithError     = BugTrace.$traceWithError;


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
     * @param {Logger} logger
     * @param {RedisClient} blockingRedisClient
     * @param {RedisClient} redisClient
     * @param {PubSub} pubSub
     * @param {string} taskQueueName
     */
    _constructor: function(logger, blockingRedisClient, redisClient, pubSub, taskQueueName) {
        var args = ArgUtil.process(arguments, [
            {name: "logger", optional: false, type: "object"},
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
         * @type {Logger}
         */
        this.logger                 = logger;

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
        this.blockingRedisClient.bRPopLPush(this.getTaskQueueName(), this.getProcessingQueueName(), 15, function(error, reply) {
            if (!error) {
                if (reply) {
                    callback(null, _this.buildTaskFromDataString(reply));
                } else {

                    //TEST
                    _this.logger.log("dequeue task timed out");

                    callback(null, null);
                }
            } else {
                callback(new Exception("RedisError", {}, "An error occurred in the redis DB", [error]));
            }
        });
    },

    /**
     * @param {Task} task
     * @param {function(Throwable=)} callback
     */
    finishTask: function(task, callback) {
        var _this           = this;
        var taskDataString  = this.unbuildTaskToDataString(task);

        $task(function(flow) {
            _this.redisClient.lRem(_this.getProcessingQueueName(), -1, taskDataString, $traceWithError(function(error, reply) {
                if (!error) {
                    flow.complete();
                } else {
                    flow.error(new Exception("RedisError", {}, "An error occurred in the redis DB", [error]));
                }
            }));
        }).execute(callback);
    },

    /**
     * @param {Task} task
     * @param {function(Throwable=)} callback
     */
    queueTask: function(task, callback) {
        var _this           = this;
        var taskDataString  = this.unbuildTaskToDataString(task);

        $task(function(flow) {
            _this.redisClient.lPush(_this.getTaskQueueName(), taskDataString, $traceWithError(function(error, reply) {
                if (!error) {
                    flow.complete();
                } else {
                    flow.error(new Exception("RedisError", {}, "An error occurred in the redis DB", [error]));
                }
            }));
        }).execute(callback);
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
                var message     = _this.pubSub.factoryMessage({
                    messageType: TaskDefines.MessageTypes.TASK_COMPLETE,
                    messageData: {
                        taskUuid: task.getTaskUuid()
                    }
                });
                _this.pubSub.publish(_this.generateTaskResultChannel(task), message, function(throwable, reply) {
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
     * @param {Throwable} throwable
     * @param {function(Throwable, number=)} callback
     */
    reportTaskThrowable: function(task, throwable, callback) {
        var _this           = this;
        var numberReceived  = 0;
        $series([
            $task(function(flow) {
                var message     = _this.pubSub.factoryMessage({
                    messageType: TaskDefines.MessageTypes.TASK_THROWABLE,
                    messageData: {
                        taskUuid: task.getTaskUuid(),
                        throwable: throwable
                    }
                });
                _this.pubSub.publish(_this.generateTaskResultChannel(task), message, function(throwable, reply) {
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
     * @param {function(Throwable=)} callback
     */
    requeueTask: function(task, callback) {
        var _this           = this;
        var taskDataString  = this.unbuildTaskToDataString(task);
        var multi           = this.redisClient.multi();
        multi
            .lrem(this.getProcessingQueueName(), -1, taskDataString)
            .lpush(this.getTaskQueueName(), taskDataString)
            .exec($traceWithError(function(errors, replies) {
                if (!errors) {
                    _this.logger.info("TASK REQUEUED - taskUuid:", task.getTaskUuid());
                    callback();
                } else {
                    callback(new Exception("RedisError", {}, "An error occurred in redis", errors));
                }
            }));
    },

    /**
     * @param {Task} task
     * @param {function(Message)} subscriberFunction
     * @param {Object} subscriberContext
     * @param {function(Throwable=)} callback
     */
    subscribeToTaskResult: function(task, subscriberFunction, subscriberContext, callback) {
        var _this           = this;
        var channel         = this.generateTaskResultChannel(task);

        $task(function(flow) {
            _this.pubSub.subscribeOnce(channel, subscriberFunction, subscriberContext, function(throwable) {
                flow.complete(throwable);
            });
        }).execute(callback);
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
    generateTaskResultChannel: function(task) {
        return "taskResult:" + task.getTaskUuid();
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
