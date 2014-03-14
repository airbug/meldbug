//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('CleanupTask')

//@Require('Class')
//@Require('bugmarsh.MarshAnnotation');
//@Require('bugmarsh.MarshPropertyAnnotation');
//@Require('bugmeta.BugMeta')
//@Require('meldbug.Task')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var MarshAnnotation             = bugpack.require('bugmarsh.MarshAnnotation');
var MarshPropertyAnnotation     = bugpack.require('bugmarsh.MarshPropertyAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var Task                        = bugpack.require('meldbug.Task');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var marsh                       = MarshAnnotation.marsh;
var property                    = MarshPropertyAnnotation.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CleanupTask = Class.extend(Task, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} taskUuid
     * @param {string} callUuid
     */
    _constructor: function(taskUuid, callUuid) {

        this._super(taskUuid);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.callUuid               = callUuid;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getCallUuid: function() {
        return this.callUuid;
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(CleanupTask).with(
    marsh("CleanupTask")
        .properties([
            property("callUuid"),
            property("taskUuid")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.CleanupTask', CleanupTask);
