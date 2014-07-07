//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbug.MeldDocumentEvent')

//@Require('Class')
//@Require('Event')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Event               = bugpack.require('Event');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Event}
     */
    var MeldDocumentEvent = Class.extend(Event, {
        _name: "meldbug.MeldDocumentEvent"
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    MeldDocumentEvent.EventTypes = {
        CHANGE: "MeldDocumentEvent:Change",
        CHANGES: "MeldDocumentEvent:Changes",
        RESET: "MeldDocumentEvent:Reset"
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('meldbug.MeldDocumentEvent', MeldDocumentEvent);
});
