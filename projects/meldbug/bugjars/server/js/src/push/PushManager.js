//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('PushManager')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugflow.BugFlow')
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
var BugFlow             = bugpack.require('bugflow.BugFlow');
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

var PushManager = Class.extend(Obj, {

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
         * @type {PushTaskManager}
         */
        this.pushTaskManager    = pushTaskManager;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {PushTaskManager}
     */
    getPushTaskManager: function() {
        return this.pushTaskManager;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {Push}
     */
    push: function() {
        return new Push(this.pushTaskManager);
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(PushManager).with(
    module("pushManager")
        .args([
            arg().ref("pushTaskManager")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.PushManager', PushManager);
