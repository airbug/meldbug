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

//@Export('meldbug.MeldClient')

//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Obj         = bugpack.require('Obj');
    var TypeUtil    = bugpack.require('TypeUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var MeldClient = Class.extend(Obj, {

        _name: "meldbug.MeldClient",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {MeldClientKey} meldClientKey
         * @param {boolean=} active
         * @param {Date=} lastActive
         */
        _constructor: function(meldClientKey, active, lastActive) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {boolean}
             */
            this.active                     = TypeUtil.isBoolean(active) ? active : true;

            /**
             * @private
             * @type {Date}
             */
            this.lastActive                 = TypeUtil.isDate(lastActive) ? lastActive : new Date();

            /**
             * @private
             * @type {MeldClientKey}
             */
            this.meldClientKey              = meldClientKey;
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        getActive: function() {
            return this.active;
        },

        /**
         * @returns {boolean}
         */
        isActive: function() {
            return this.getActive();
        },

        /**
         * @param {boolean} active
         */
        setActive: function(active) {
            this.active = active;
        },

        /**
         * @return {Date}
         */
        getLastActive: function() {
            return this.lastActive;
        },

        /**
         * @param {Date} lastActive
         */
        setLastActive: function(lastActive) {
            this.lastActive = lastActive;
        },

        /**
         * @return {MeldClientKey}
         */
        getMeldClientKey: function() {
            return this.meldClientKey;
        }
    });


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('meldbug.MeldClient', MeldClient);
});
