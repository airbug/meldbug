//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbug.PushManager')
//@Autoload

//@Require('Class')
//@Require('Obj')
//@Require('bugioc.ArgTag')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')
//@Require('meldbug.Push')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Obj                 = bugpack.require('Obj');
    var ArgTag       = bugpack.require('bugioc.ArgTag');
    var ModuleTag    = bugpack.require('bugioc.ModuleTag');
    var BugMeta             = bugpack.require('bugmeta.BugMeta');
    var Push                = bugpack.require('meldbug.Push');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                 = ArgTag.arg;
    var bugmeta             = BugMeta.context();
    var module              = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var PushManager = Class.extend(Obj, {

        _name: "meldbug.PushManager",


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

    bugmeta.tag(PushManager).with(
        module("pushManager")
            .args([
                arg().ref("pushTaskManager")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('meldbug.PushManager', PushManager);
});
