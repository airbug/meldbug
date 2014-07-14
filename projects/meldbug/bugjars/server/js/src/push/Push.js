/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbug.Push')

//@Require('Bug')
//@Require('Class')
//@Require('Flows')
//@Require('Obj')
//@Require('Set')
//@Require('bugmarsh.MarshTag');
//@Require('bugmarsh.MarshPropertyTag');
//@Require('bugmeta.BugMeta')
//@Require('bugtask.TaskDefines')
//@Require('meldbug.AddToSetOperation')
//@Require('meldbug.MeldTransaction')
//@Require('meldbug.MergeDocumentOperation')
//@Require('meldbug.RemoveFromSetOperation')
//@Require('meldbug.RemoveMeldDocumentOperation')
//@Require('meldbug.RemoveObjectPropertyOperation')
//@Require('meldbug.SetDocumentOperation')
//@Require('meldbug.SetObjectPropertyOperation')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Bug                             = bugpack.require('Bug');
    var Class                           = bugpack.require('Class');
    var Flows                           = bugpack.require('Flows');
    var Obj                             = bugpack.require('Obj');
    var Set                             = bugpack.require('Set');
    var MarshPropertyTag                = bugpack.require('bugmarsh.MarshPropertyTag');
    var MarshTag                        = bugpack.require('bugmarsh.MarshTag');
    var BugMeta                         = bugpack.require('bugmeta.BugMeta');
    var TaskDefines                     = bugpack.require('bugtask.TaskDefines');
    var AddToSetOperation               = bugpack.require('meldbug.AddToSetOperation');
    var MeldTransaction                 = bugpack.require('meldbug.MeldTransaction');
    var MergeDocumentOperation          = bugpack.require('meldbug.MergeDocumentOperation');
    var RemoveFromSetOperation          = bugpack.require('meldbug.RemoveFromSetOperation');
    var RemoveMeldDocumentOperation     = bugpack.require('meldbug.RemoveMeldDocumentOperation');
    var RemoveObjectPropertyOperation   = bugpack.require('meldbug.RemoveObjectPropertyOperation');
    var SetDocumentOperation            = bugpack.require('meldbug.SetDocumentOperation');
    var SetObjectPropertyOperation      = bugpack.require('meldbug.SetObjectPropertyOperation');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                         = BugMeta.context();
    var marsh                           = MarshTag.marsh;
    var property                        = MarshPropertyTag.property;
    var $series                         = Flows.$series;
    var $task                           = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var Push = Class.extend(Obj, {

        _name: "meldbug.Push",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {PushTaskManager} pushTaskManager
         */
        _constructor: function(pushTaskManager) {

            this._super();


            //-------------------------------------------------------------------------------
            // Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {boolean}
             */
            this.all                    = false;

            /**
             * @private
             * @type {function(Throwable=)}
             */
            this.callback               = null;

            /**
             * @private
             * @type {boolean}
             */
            this.executed               = false;

            /**
             * @private
             * @type {MeldTransaction}
             */
            this.meldTransaction        = new MeldTransaction();

            /**
             * @private
             * @type {PushTaskManager}
             */
            this.pushTaskManager        = pushTaskManager;

            /**
             * @private
             * @type {Set.<string>}
             */
            this.toCallUuidSet          = new Set();

            /**
             * @private
             * @type {Set.<string>}
             */
            this.waitForCallUuidSet     = new Set();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        getAll: function() {
            return this.all;
        },

        /**
         * @return {MeldTransaction}
         */
        getMeldTransaction: function() {
            return this.meldTransaction;
        },

        /**
         * @return {PushTaskManager}
         */
        getPushTaskManager: function() {
            return this.pushTaskManager;
        },

        /**
         * @return {Set.<string>}
         */
        getToCallUuidSet: function() {
            return this.toCallUuidSet;
        },

        /**
         * @return {Set.<string>}
         */
        getWaitForCallUuidSet: function() {
            return this.waitForCallUuidSet;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {MeldDocumentKey} meldDocumentKey
         * @param {string} path
         * @param {*} setValue
         * @returns {Push}
         */
        addToSet: function(meldDocumentKey, path, setValue) {
            this.meldTransaction.addMeldOperation(new AddToSetOperation(meldDocumentKey, path, setValue));
            return this;
        },

        /**
         * @param {function(Throwable=)} callback
         */
        exec: function(callback) {
            if (!this.executed) {
                this.executed = true;
                this.callback = callback;
                var _this   = this;
                var task    = this.pushTaskManager.generatePushTask(this);
                $series([
                    $task(function(flow) {
                        _this.pushTaskManager.subscribeToTaskResult(task, _this.receiveTaskResultMessage, _this, function(throwable) {
                            flow.complete(throwable);
                        });
                    }),
                    $task(function(flow) {
                        _this.pushTaskManager.queueTask(task, function(throwable) {
                            flow.complete(throwable);
                        });
                    })
                ]).execute(function(throwable) {
                    if (throwable) {
                        callback(throwable);
                    }
                });
            } else {
                callback(new Bug("InvalidState", {}, "Push has already been executed"));
            }
        },

        /**
         * @param {MeldDocumentKey} meldDocumentKey
         * @param {Object} data
         * @return {Push}
         */
        mergeDocument: function(meldDocumentKey, data) {
            this.meldTransaction.addMeldOperation(new MergeDocumentOperation(meldDocumentKey, data));
            return this;
        },

        /**
         * @param {MeldDocumentKey} meldDocumentKey
         * @return {Push}
         */
        removeDocument: function(meldDocumentKey) {
            this.meldTransaction.addMeldOperation(new RemoveMeldDocumentOperation(meldDocumentKey));
            return this;
        },

        /**
         * @param {MeldDocumentKey} meldDocumentKey
         * @param {string} path
         * @param {*} setValue
         * @return {Push}
         */
        removeFromSet: function(meldDocumentKey, path, setValue) {
            this.meldTransaction.addMeldOperation(new RemoveFromSetOperation(meldDocumentKey, path, setValue));
            return this;
        },

        /**
         * @param {MeldDocumentKey} meldDocumentKey
         * @param {string} path
         * @param {string} propertyName
         * @return {Push}
         */
        removeObjectProperty: function(meldDocumentKey, path, propertyName) {
            this.meldTransaction.addMeldOperation(new RemoveObjectPropertyOperation(meldDocumentKey, path, propertyName));
            return this;
        },

        /**
         * @param {MeldDocumentKey} meldDocumentKey
         * @param {Object} data
         * @return {Push}
         */
        setDocument: function(meldDocumentKey, data) {
            this.meldTransaction.addMeldOperation(new SetDocumentOperation(meldDocumentKey, data));
            return this;
        },

        /**
         * @param {MeldDocumentKey} meldDocumentKey
         * @param {string} path
         * @param {string} propertyName
         * @param {*} propertyValue
         * @return {Push}
         */
        setObjectProperty: function(meldDocumentKey, path, propertyName, propertyValue) {
            this.meldTransaction.addMeldOperation(new SetObjectPropertyOperation(meldDocumentKey, path, propertyName, propertyValue));
            return this;
        },

        /**
         * @param {Array.<string>} callUuids
         * @return {Push}
         */
        to: function(callUuids) {
            this.toCallUuidSet.addAll(callUuids);
            return this;
        },

        /**
         * @return {Push}
         */
        toAll: function() {
            this.all = true;
            return this;
        },

        /**
         * @param {Array.<string>} callUuids
         * @return {Push}
         */
        waitFor: function(callUuids) {
            this.waitForCallUuidSet.addAll(callUuids);
            return this;
        },


        //-------------------------------------------------------------------------------
        // Message Receivers
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Message} message
         */
        receiveTaskResultMessage: function(message) {
            if (message.getMessageType() === TaskDefines.MessageTypes.TASK_COMPLETE) {
                this.callback();
            } else if (message.getMessageType() === TaskDefines.MessageTypes.TASK_THROWABLE) {
                this.callback(message.getMessageData().throwable);
            } else {
                this.callback(new Bug("UnhandledMessage", {}, "Received message of unsupported type - type:", message.getMessageType()));
            }
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(Push).with(
        marsh("Push")
            .properties([
                property("all"),
                property("meldTransaction"),
                property("toCallUuidSet"),
                property("waitForCallUuidSet")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('meldbug.Push', Push);
});
