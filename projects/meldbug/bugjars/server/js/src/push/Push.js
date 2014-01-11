//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('Push')

//@Require('Class')
//@Require('Obj')
//@Require('Set')
//@Require('bugflow.BugFlow')
//@Require('meldbug.AddToSetOperation')
//@Require('meldbug.MeldTransaction')
//@Require('meldbug.MergeDocumentOperation')
//@Require('meldbug.RemoveFromSetOperation')
//@Require('meldbug.RemoveMeldDocumentOperation')
//@Require('meldbug.RemoveObjectPropertyOperation')
//@Require('meldbug.SetDocumentOperation')
//@Require('meldbug.SetObjectPropertyOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var Obj                                 = bugpack.require('Obj');
var Set                                 = bugpack.require('Set');
var BugFlow                             = bugpack.require('bugflow.BugFlow');
var AddToSetOperation                   = bugpack.require('meldbug.AddToSetOperation');
var MeldTransaction                     = bugpack.require('meldbug.MeldTransaction');
var MergeDocumentOperation              = bugpack.require('meldbug.MergeDocumentOperation');
var RemoveFromSetOperation              = bugpack.require('meldbug.RemoveFromSetOperation');
var RemoveMeldDocumentOperation         = bugpack.require('meldbug.RemoveMeldDocumentOperation');
var RemoveObjectPropertyOperation       = bugpack.require('meldbug.RemoveObjectPropertyOperation');
var SetDocumentOperation                = bugpack.require('meldbug.SetDocumentOperation');
var SetObjectPropertyOperation          = bugpack.require('meldbug.SetObjectPropertyOperation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var $series                             = BugFlow.$series;
var $task                               = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Push = Class.extend(Obj, {

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
        var _this   = this;
        var task    = this.pushTaskManager.generatePushTask(this);
        $series([
            $task(function(flow) {
                _this.pushTaskManager.subscribeToTaskComplete(task, function(message) {
                    callback();
                }, null, function(throwable) {
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
     */
    removeDocument: function(meldDocumentKey) {
        this.meldTransaction.addMeldOperation(new RemoveMeldDocumentOperation(meldDocumentKey));
    },

    /**
     * @param {MeldDocumentKey} meldDocumentKey
     * @param {string} path
     * @param {*} setValue
     * @returns {Push}
     */
    removeFromSet: function(meldDocumentKey, path, setValue) {
        this.meldTransaction.addMeldOperation(new RemoveFromSetOperation(meldDocumentKey, path, setValue));
        return this;
    },

    /**
     * @param {MeldDocumentKey} meldDocumentKey
     * @param {string} path
     * @param {string} propertyName
     * @returns {Push}
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
     * @returns {Push}
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
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.Push', Push);