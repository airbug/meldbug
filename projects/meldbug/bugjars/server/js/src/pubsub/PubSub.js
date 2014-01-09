//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('PubSub')
//@Autoload

//@Require('Class')
//@Require('List')
//@Require('Map')
//@Require('Obj')
//@Require('UuidGenerator')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.IInitializeModule')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('meldbug.Message')
//@Require('meldbug.Subscriber')
//@Require('redis.RedisPubSub')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var List                    = bugpack.require('List');
var Map                     = bugpack.require('Map');
var Obj                     = bugpack.require('Obj');
var UuidGenerator           = bugpack.require('UuidGenerator');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
var IInitializeModule       = bugpack.require('bugioc.IInitializeModule');
var ModuleAnnotation        = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var Message                 = bugpack.require('meldbug.Message');
var Subscriber              = bugpack.require('meldbug.Subscriber');
var RedisPubSub             = bugpack.require('redis.RedisPubSub');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                     = ArgAnnotation.arg;
var bugmeta                 = BugMeta.context();
var module                  = ModuleAnnotation.module;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var PubSub = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {RedisPubSub} redisPubSub
     */
    _constructor: function(redisPubSub) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<string, List.<Subscriber>>}
         */
        this.channelToSubscriberListMap             = new Map();

        /**
         * @private
         * @type {RedisPubSub}
         */
        this.redisPubSub                            = redisPubSub;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {RedisPubSub}
     */
    getRedisPubSub: function() {
        return this.redisPubSub;
    },


    //-------------------------------------------------------------------------------
    // IInitializeModule Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    deinitializeModule: function(callback) {
        this.redisPubSub.off(RedisPubSub.EventTypes.MESSAGE, this.hearMessageEvent, this);
        callback();
    },

    /**
     * @param {function(Throwable=)} callback
     */
    initializeModule: function(callback) {
        this.redisPubSub.on(RedisPubSub.EventTypes.MESSAGE, this.hearMessageEvent, this);
        callback();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} channel
     * @param {(Message | *)} message
     * @param {function(Throwable, number=)} callback
     */
    publish: function(channel, message, callback) {
        if (!Class.doesExtend(message, Message)) {
            message = this.factoryMessage({
                messageType: "message",
                messageData: message
            });
        }
        this.preProcessMessage(message);
        this.doPublishMessage(channel, message, callback);
    },

    /**
     * @param {string} channel
     * @param {(Message | *)} message
     * @param {function(Message)} subscriberFunction
     * @param {Object} subscriberContext
     * @param {function(Throwable, number=)} callback
     */
    publishAndSubscribeToResponse: function(channel, message, subscriberFunction, subscriberContext, callback) {
        var _this = this;
        if (!Class.doesExtend(message, Message)) {
            message = this.factoryMessage({
                messageType: "message",
                messageData: message
            });
        }
        this.preProcessMessage(message);
        var responseChannel = this.generateResponseChannel(message);
        this.subscribeOnce(responseChannel, subscriberFunction, subscriberContext, function(throwable) {
            //TODO BRN: What to do if we get a throwable here?
            if (!throwable) {
                _this.doPublishMessage(channel, message, callback);
            } else {
                callback(throwable);
            }
        });
    },

    /**
     * @param {Message} respondingToMessage
     * @param {(Message | *)} message
     * @param {function(Throwable, number=)} callback
     */
    publishResponse: function(respondingToMessage, message, callback) {
        var responseChannel = this.generateResponseChannel(respondingToMessage);
        this.publish(responseChannel, message, callback);
    },

    /**
     * @param {string} channel
     * @param {function(Message)} subscriberFunction
     * @param {Object} subscriberContext
     * @param {function(Throwable=)} callback
     */
    subscribe: function(channel, subscriberFunction, subscriberContext, callback) {
        var subscriber = this.factorySubscriber(subscriberFunction, subscriberContext, false);
        this.addSubscriber(channel, subscriber, callback);
    },

    /**
     * @param {string} channel
     * @param {function(Message)} subscriberFunction
     * @param {Object} subscriberContext
     * @param {function(Throwable=)} callback
     */
    subscribeOnce: function(channel, subscriberFunction, subscriberContext, callback) {
        var subscriber = this.factorySubscriber(subscriberFunction, subscriberContext, true);
        this.addSubscriber(channel, subscriber, callback);
    },

    /**
     * @param {string} channel
     * @param {function(Message)} subscriberFunction
     * @param {Object} subscriberContext
     * @param {function(Throwable, boolean=)} callback
     */
    unsubscribe: function(channel, subscriberFunction, subscriberContext, callback) {
        var subscriber = this.factorySubscriber(subscriberFunction, subscriberContext, false);
        this.removeSubscriber(channel, subscriber, callback);
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {string} channel
     * @param {Subscriber} subscriber
     * @param {function(Throwable=)} callback
     */
    addSubscriber: function(channel, subscriber, callback) {
        var subscriberList = this.channelToSubscriberListMap.get(channel);
        if (!subscriberList) {
            subscriberList = new List();
            this.channelToSubscriberListMap.put(channel, subscriberList);
        }
        subscriberList.add(subscriber);
        this.redisPubSub.subscribe(channel, callback);
    },

    /**
     * @protected
     * @param {{messageType: string, messageUuid: string, messageData: *}} messageData
     * @param {string} channel
     * @returns {Message}
     */
    buildMessage: function(messageData, channel) {
        var message = this.factoryMessage(messageData);
        message.setChannel(channel);
        return message;
    },

    /**
     * @protected
     * @param {Message} message
     */
    deliverMessage: function(message) {
        var channel         = message.getChannel();
        var subscriberList  = this.channelToSubscriberListMap.get(channel);
        subscriberList.forEach(function(subscriber) {
            subscriber.receiveMessage(message);
        });
    },

    /**
     * @protected
     * @param {string} channel
     * @param {Message} message
     * @param {function(Throwable, number=)} callback
     */
    doPublishMessage: function(channel, message, callback) {
        var messageData = this.unbuildMessage(message);
        var messageString = JSON.stringify(messageData);
        this.redisPubSub.publish(channel, messageString, callback);
    },

    /**
     * @protected
     * @param {{messageType: string, messageData: *, messageUuid: string=}} messageObject
     * @return {Message}
     */
    factoryMessage: function(messageObject) {
        var message = new Message(messageObject.messageType, messageObject.messageData);
        if (messageObject.messageUuid) {
            message.setMessageUuid(messageObject.messageUuid);
        }
        return message;
    },

    /**
     * @protected
     * @param {function(Message)} subscriberFunction
     * @param {Object} subscriberContext
     * @param {boolean} once
     * @returns {Subscriber}
     */
    factorySubscriber: function(subscriberFunction, subscriberContext, once) {
        return new Subscriber(subscriberFunction, subscriberContext, once);
    },

    /**
     * @protected
     * @param {Message} message
     * @returns {string}
     */
    generateResponseChannel: function(message) {
        return "response:" + message.getMessageUuid();
    },

    /**
     * @protected
     * @param {Message} message
     */
    preProcessMessage: function(message) {
        message.setMessageUuid(UuidGenerator.generateUuid());
    },

    /**
     * @protected
     * @param {string} channel
     * @param {Subscriber} subscriber
     * @param {function(Throwable, boolean=)} callback
     */
    removeSubscriber: function(channel, subscriber, callback) {
        var subscriberList = this.channelToSubscriberListMap.get(channel);
        if (subscriberList) {
            var result = subscriberList.remove(subscriber);
            if (result) {
                if (subscriberList.getCount() === 0) {
                    this.channelToSubscriberListMap.remove(channel);
                    this.redisPubSub.unsubscribe(channel, function(throwable) {
                        if (!throwable) {
                            callback(null, true);
                        } else {
                            callback(throwable);
                        }
                    });
                } else {
                    callback(null, true);
                }
            } else {
                callback(null, false);
            }
        } else {
            callback(null, false);
        }
    },

    /**
     * @protected
     * @param {Message} message
     * @return {{messageType: string, messageUuid: string, messageData: *}}
     */
    unbuildMessage: function(message) {
        return {
            messageType: message.getMessageType(),
            messageUuid: message.getMessageUuid(),
            messageData: message.getMessageData()
        };
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {RedisMessage} redisMessage
     */
    processRedisMessage: function(redisMessage) {
        var channel         = redisMessage.getChannel();
        var messageData     = JSON.parse(redisMessage.getMessage());
        var message         = this.buildMessage(messageData, channel);
        this.deliverMessage(message);
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param event
     */
    hearMessageEvent: function(event) {
        var redisMessage = event.getData().redisMessage;
        this.processRedisMessage(redisMessage);
    }
});


//-------------------------------------------------------------------------------
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(PubSub, IInitializeModule);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(PubSub).with(
    module("pubSub")
        .args([
            arg().ref("redisPubSub")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.PubSub', PubSub);
