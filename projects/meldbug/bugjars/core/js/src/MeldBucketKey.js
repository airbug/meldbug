//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbug.MeldBucketKey')

//@Require('Class')
//@Require('IObjectable')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var IObjectable         = bugpack.require('IObjectable');
    var Obj                 = bugpack.require('Obj');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var MeldBucketKey = Class.extend(Obj, {

        _name: "meldbug.MeldBucketKey",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} type
         * @param {string} callUuid
         */
        _constructor: function(type, callUuid) {

            this._super();


            //-------------------------------------------------------------------------------
            // Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {string}
             */
            this.callUuid           = callUuid;

            /**
             * @private
             * @type {string}
             */
            this.type               = type;
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
         * @return {string}
         */
        getType: function() {
            return this.type;
        },


        //-------------------------------------------------------------------------------
        // Object Implementation
        //-------------------------------------------------------------------------------

        /**
         * @param {*} value
         * @return {boolean}
         */
        equals: function(value) {
            if (Class.doesExtend(value, MeldBucketKey)) {
                return (value.getCallUuid() === this.getCallUuid() && value.getType() === this.getType());
            }
            return false;
        },

        /**
         * @return {number}
         */
        hashCode: function() {
            if (!this._hashCode) {
                this._hashCode = Obj.hashCode("[MeldBucketKey]" +
                    Obj.hashCode(this.getCallUuid()) + "_" +
                    Obj.hashCode(this.getType()));
            }
            return this._hashCode;
        },


        //-------------------------------------------------------------------------------
        // IObjectable Implementation
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        toObject: function() {
            return {
                callUuid: this.callUuid,
                type: this.type
            };
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        toStringKey: function() {
            return this.type + ":" + this.callUuid;
        }
    });


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(MeldBucketKey, IObjectable);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('meldbug.MeldBucketKey', MeldBucketKey);
});
