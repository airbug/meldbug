//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbugserver')

//@Export('DummyBugCallServer')

//@Require('Class')
//@Require('bugcall.CallEvent')
//@Require('EventDispatcher')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack Modules
//-------------------------------------------------------------------------------


var Class                           = bugpack.require('Class');
var CallEvent                       = bugpack.require('bugcall.CallEvent');
var EventDispatcher                 = bugpack.require('EventDispatcher');

//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var DummyBugCallServer = Class.extend(EventDispatcher, {
    connect: function(callManager) {
        this.dispatchEvent(new CallEvent(CallEvent.OPENED, {
            callManager: callManager
        }));
    }
});

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbugserver.DummyBugCallServer', DummyBugCallServer);

