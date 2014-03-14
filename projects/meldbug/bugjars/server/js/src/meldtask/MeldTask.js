//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldTask')

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

var bugmeta                             = BugMeta.context();
var marsh                               = MarshAnnotation.marsh;
var property                            = MarshPropertyAnnotation.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var MeldTask = Class.extend(Task, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} taskUuid
     * @param {string} callUuid
     * @param {MeldTransaction} meldTransaction
     */
    _constructor: function(taskUuid, callUuid, meldTransaction) {

        this._super(taskUuid);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.callUuid               = callUuid;

        /**
         * @private
         * @type {MeldTransaction}
         */
        this.meldTransaction        = meldTransaction;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getCallUuid: function() {
        return this.callUuid;
    },

    /**
     * @return {MeldTransaction}
     */
    getMeldTransaction: function() {
        return this.meldTransaction;
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(MeldTask).with(
    marsh("MeldTask")
        .properties([
            property("callUuid"),
            property("meldTransaction"),
            property("taskUuid")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldTask', MeldTask);
