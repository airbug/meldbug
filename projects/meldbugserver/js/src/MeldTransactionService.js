//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugserver')

//@Export('MeldTransactionService')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugcall.CallEvent')
//@Require('bugcall.IProcessCall')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var CallEvent               = bugpack.require('bugcall.CallEvent');
var IProcessCall            = bugpack.require('bugcall.IProcessCall');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation        = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                     = ArgAnnotation.arg;
var bugmeta                 = BugMeta.context();
var module                  = ModuleAnnotation.module;
var $if                     = BugFlow.$if;
var $parallel               = BugFlow.$parallel;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 * @implements {IProcessCall}
 */
var MeldTransactionService = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {BugCallServer} bugCallServer
     * @param {MeldTransactionManager} meldTransactionManager
     * @param {MeldBuilder} meldBuilder
     * @param {MeldbugClientConsumerManager} meldbugClientConsumerManager
     */
    _constructor: function(bugCallServer, meldTransactionManager, meldBuilder, meldbugClientConsumerManager) {

        this._super();


        //-------------------------------------------------------------------------------
        // Instance Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BugCallServer}
         */
        this.bugCallServer                  = bugCallServer;

        /**
         * @private
         * @type {MeldbugClientConsumerManager}
         */
        this.meldbugClientConsumerManager   = meldbugClientConsumerManager;

        /**
         * @private
         * @type {MeldBuilder}
         */
        this.meldBuilder                    = meldBuilder;

        /**
         * @private
         * @type {MeldTransactionManager}
         */
        this.meldTransactionManager         = meldTransactionManager;

        this.initialize();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {BugCallServer}
     */
    getBugCallServer: function() {
        return this.bugCallServer;
    },

    /**
     * @return {MeldbugClientConsumerManager}
     */
    getMeldbugClientConsumerManager: function() {
        return this.meldbugClientConsumerManager;
    },

    /**
     * @return {MeldBuilder}
     */
    getMeldBuilder: function() {
        return this.meldBuilder;
    },

    /**
     * @return {MeldTransactionManager}
     */
    getMeldTransactionManager: function() {
        return this.meldTransactionManager;
    },


    //-------------------------------------------------------------------------------
    // ICallProcessor Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {CallManager} callManager
     * @param {function(Throwable=)} callback
     */
    processCall: function(callManager, callback) {
        var _this = this;
        $series([
            $task(function(flow) {
                _this.meldTransactionManager.subscribeToTransactionsForCall(callManager.getCallUuid(), _this.receiveTransactionMessage, _this, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(callback);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    initialize: function() {
        this.bugCallServer.on(CallEvent.CLOSED, this.hearBugCallServerCallClosed, this);
        this.bugCallServer.registerCallProcessor(this);
    },

    /**
     * @private
     * @param {Message} respondingToMessage
     * @param {boolean} success
     */
    publishTransactionResult: function(respondingToMessage, success) {
        this.meldTransactionManager.publishTransactionResponse(respondingToMessage, {success: success}, function(throwable, numberReceived) {

            //TODO BRN: What do we do here if we receive a throwable or the numberReceived is 0 or greater than 1?
            // If it's 1 then that's the expected response.

            if (throwable) {
                console.error(throwable.message, throwable.stack);
            } else {
                console.log("Publish transaction response success - numberReceived:", numberReceived);
            }
        });
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {CallEvent} event
     */
    hearBugCallServerCallClosed: function(event) {
        var data            = event.getData();
        var callManager     = data.callManager;

        this.meldTransactionManager.unsubscribeFromTransactionsForCall(callManager.getCallUuid(), this.receiveTransactionMessage, this, function(throwable) {

            //TODO BRN: If this is not successful what do we do?

            if (throwable) {
                throw throwable;
            }
        });
    },


    //-------------------------------------------------------------------------------
    // Message Receivers
    //-------------------------------------------------------------------------------

    /**
     * @privet
     * @param {Message} message
     */
    receiveTransactionMessage: function(message) {
        var _this                   = this;
        var messageData             = message.getMessageData();
        var callUuid                = messageData.callUuid;
        var meldbugClientConsumer   = this.meldbugClientConsumerManager.getConsumerForCallUuid(callUuid);
        if (meldbugClientConsumer) {

            //TODO BRN: We need to ensure the order in which the meldTransactions are applied is maintained.
            // If one transaction message to the client fails then it needs to be retried and verified before processing the next.

            var meldTransaction = this.meldBuilder.buildMeldTransaction(messageData.meldTransaction);
            meldbugClientConsumer.commitMeldTransaction(meldTransaction, function(throwable) {
                if (!throwable) {
                    _this.publishTransactionResult(message, true);
                } else {

                    //TODO BRN: Transaction should be retried.

                    console.error(throwable.message, throwable.stack);
                }
            });
        } else {
            this.publishTransactionResult(message, false)
        }
    }
});


//-------------------------------------------------------------------------------
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(MeldTransactionService, IProcessCall);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(MeldTransactionService).with(
    module("meldTransactionService")
        .args([
            arg().ref("bugCallServer"),
            arg().ref("meldTransactionManager"),
            arg().ref("meldBuilder"),
            arg().ref("meldbugClientConsumerManager")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbugserver.MeldTransactionService', MeldTransactionService);
