//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('Message')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Obj                         = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var Message = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(messageType, messageData) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.channel        = "";

        /**
         * @private
         * @type {*}
         */
        this.messageData    = messageData;

        /**
         * @private
         * @type {string}
         */
        this.messageType    = messageType;

        /**
         * @private
         * @type {string}
         */
        this.messageUuid    = "";
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getChannel: function() {
        return this.channel;
    },

    /**
     * @param {string} channel
     */
    setChannel: function(channel) {
        this.channel = channel;
    },

    /**
     * @return {*}
     */
    getMessageData: function() {
        return this.messageData;
    },

    /**
     * @return {string}
     */
    getMessageType: function() {
        return this.messageType;
    },

    /**
     * @return {string}
     */
    getMessageUuid: function() {
        return this.messageUuid;
    },

    /**
     * @param {string} messageUuid
     */
    setMessageUuid: function(messageUuid) {
        this.messageUuid = messageUuid;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.Message', Message);
