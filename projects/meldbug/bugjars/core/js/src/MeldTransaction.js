//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbug.MeldTransaction')

//@Require('Class')
//@Require('List')
//@Require('Obj')
//@Require('bugmarsh.MarshTag');
//@Require('bugmarsh.MarshPropertyTag');
//@Require('bugmeta.BugMeta')



//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                       = bugpack.require('Class');
    var List                        = bugpack.require('List');
    var Obj                         = bugpack.require('Obj');
    var MarshTag             = bugpack.require('bugmarsh.MarshTag');
    var MarshPropertyTag     = bugpack.require('bugmarsh.MarshPropertyTag');
    var BugMeta                     = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var bugmeta                     = BugMeta.context();
    var marsh                       = MarshTag.marsh;
    var property                    = MarshPropertyTag.property;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var MeldTransaction = Class.extend(Obj, {

        _name: "meldbug.MeldTransaction",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         */
        _constructor: function() {

            this._super();


            //-------------------------------------------------------------------------------
            // Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {List.<MeldOperation>}
             */
            this.meldOperationList          = new List();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {List.<MeldOperation>}
         */
        getMeldOperationList: function() {
            return this.meldOperationList;
        },

        /**
         * @param {List.<MeldOperation>} meldOperationList
         */
        setMeldOperationList: function(meldOperationList) {
            this.meldOperationList = meldOperationList;
        },


        //-------------------------------------------------------------------------------
        // IObjectable Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {MeldOperation} meldOperation
         */
        addMeldOperation: function(meldOperation) {
            this.meldOperationList.add(meldOperation);
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        isEmpty: function() {
            return this.meldOperationList.isEmpty();
        }
    });


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(MeldTransaction).with(
        marsh("MeldTransaction")
            .properties([
                property("meldOperationList")
            ])
    );


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('meldbug.MeldTransaction', MeldTransaction);
});
