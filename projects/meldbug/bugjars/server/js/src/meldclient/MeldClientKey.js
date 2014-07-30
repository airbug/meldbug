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

//@Export('meldbug.MeldClientKey')

//@Require('ArgumentBug')
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

    var ArgumentBug         = bugpack.require('ArgumentBug');
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
    var MeldClientKey = Class.extend(Obj, {

        _name: "meldbug.MeldClientKey",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {string} callUuid
         */
        _constructor: function(callUuid) {

            this._super();


            //-------------------------------------------------------------------------------
            // Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {string}
             */
            this.callUuid           = callUuid;
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


        //-------------------------------------------------------------------------------
        // Obj Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {*} value
         * @return {boolean}
         */
        equals: function(value) {
            if (Class.doesExtend(value, MeldClientKey)) {
                return (value.getCallUuid() === this.getCallUuid());
            }
            return false;
        },

        /**
         * @return {number}
         */
        hashCode: function() {
            if (!this._hashCode) {
                this._hashCode = Obj.hashCode("[MeldClientKey]" +
                    Obj.hashCode(this.callUuid));
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
                callUuid: this.callUuid
            };
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {string}
         */
        toStringKey: function() {
            return "meldClient" + ":" + this.callUuid;
        }
    });



    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {string} stringKey
     * @returns {MeldClientKey}
     */
    MeldClientKey.fromStringKey = function(stringKey) {
        var keyParts = stringKey.split(":");
        if (keyParts.length === 2) {
            var meldClient = keyParts[0];
            var callUuid = keyParts[1];
            if (meldClient === "meldClient") {
                return new MeldClientKey(callUuid);
            } else {
                throw new ArgumentBug(ArgumentBug.ILLEGAL, "stringKey", stringKey, "parameter must in MeldClientKey string format");
            }
        } else {
            throw new ArgumentBug(ArgumentBug.ILLEGAL, "stringKey", stringKey, "parameter must in MeldClientKey string format");
        }
    };


    //-------------------------------------------------------------------------------
    // Interfaces
    //-------------------------------------------------------------------------------

    Class.implement(MeldClientKey, IObjectable);


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('meldbug.MeldClientKey', MeldClientKey);
});
