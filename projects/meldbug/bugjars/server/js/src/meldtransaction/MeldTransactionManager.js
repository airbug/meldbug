//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldTransactionManager')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Obj                         = bugpack.require('Obj');
var ArgAnnotation               = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation            = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                         = ArgAnnotation.arg;
var bugmeta                     = BugMeta.context();
var module                      = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldTransactionManager = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {PubSub} pubSub
     * @param {MeldBuilder} meldBuilder
     */
    _constructor: function(pubSub, meldBuilder) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MeldBuilder}
         */
        this.meldBuilder    = meldBuilder;

        /**
         * @private
         * @type {PubSub}
         */
        this.pubSub         = pubSub;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {MeldBuilder}
     */
    getMeldBuilder: function() {
        return this.meldBuilder;
    },

    /**
     * @return {PubSub}
     */
    getPubSub: function() {
        return this.pubSub;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} callUuid
     * @param {MeldTransaction} meldTransaction
     * @param callback
     */
    publishTransactionForCallAndSubscribeToResponse: function(callUuid, meldTransaction, subscriberFunction, subscriberContext, callback) {
        var transactionChannel      = this.generateTransactionChannel(callUuid);
        var transactionMessageData  = {
            callUuid: callUuid,
            meldTransaction: this.meldBuilder.unbuildMeldTransaction(meldTransaction)
        };
        this.pubSub.publishAndSubscribeToResponse(transactionChannel, transactionMessageData, subscriberFunction, subscriberContext, callback);
    },

    /**
     *
     * @param {Message} message
     * @param {*} response
     * @param {function(Throwable, number=)} callback
     */
    publishTransactionResponse: function(message, response, callback) {
        this.pubSub.publishResponse(message, response, callback);
    },

    /**
     * @param {string} callUuid
     * @param {function(Message)} subscriberFunction
     * @param {Object} subscriberContext
     * @param {function(Throwable=)} callback
     */
    subscribeToTransactionsForCall: function(callUuid, subscriberFunction, subscriberContext, callback) {
        var transactionChannel = this.generateTransactionChannel(callUuid);
        this.pubSub.subscribe(transactionChannel, subscriberFunction, subscriberContext, callback);
    },

    /**
     * @param {string} callUuid
     * @param {function(Message)} subscriberFunction
     * @param {Object} subscriberContext
     * @param {function(Throwable=)} callback
     */
    unsubscribeFromTransactionsForCall: function(callUuid, subscriberFunction, subscriberContext, callback) {
        var transactionChannel = this.generateTransactionChannel(callUuid);
        this.pubSub.unsubscribe(transactionChannel, subscriberFunction, subscriberContext, callback);
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {string} callUuid
     * @return {string}
     */
    generateTransactionChannel: function(callUuid) {
        return "transaction:" + callUuid;
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(MeldTransactionManager).with(
    module("meldTransactionManager")
        .args([
            arg().ref("pubSub"),
            arg().ref("meldBuilder")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldTransactionManager', MeldTransactionManager);
