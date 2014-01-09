//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('PushBuilder')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('meldbug.Push')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var Obj                 = bugpack.require('Obj');
var ArgAnnotation       = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation    = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta             = bugpack.require('bugmeta.BugMeta');
var Push                = bugpack.require('meldbug.Push');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                 = ArgAnnotation.arg;
var bugmeta             = BugMeta.context();
var module              = ModuleAnnotation.module;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var PushBuilder = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {MeldBuilder} meldBuilder
     */
    _constructor: function(meldBuilder) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {MeldBuilder}
         */
        this.meldBuilder    = meldBuilder;
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


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {Object} pushData
     * @return {Push}
     */
    buildPush: function(pushData) {
        var push = new Push();
        push.all = pushData.all;
        push.meldTransaction = this.meldBuilder.buildMeldTransaction(pushData.meldTransaction);
        push.toCallUuidSet.addAll(pushData.toCallUuidSet);
        push.waitForCallUuidSet.addAll(pushData.waitForCallUuidSet);
        return push;
    },

    /**
     * @param {Push} push
     * @return {Object}
     */
    unbuildPush: function(push) {
        return {
            all: push.getAll(),
            meldTransaction: this.meldBuilder.unbuildMeldTransaction(push.getMeldTransaction()),
            toCallUuidSet: push.getToCallUuidSet().toArray(),
            waitForCallUuidSet: push.getWaitForCallUuidSet().toArray()
        };
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(PushBuilder).with(
    module("pushBuilder")
        .args([
            arg().ref("meldBuilder")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.PushBuilder', PushBuilder);
