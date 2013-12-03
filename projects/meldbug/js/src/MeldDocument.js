//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('meldbug')

//@Export('MeldDocument')

//@Require('Class')
//@Require('Event')
//@Require('Set')
//@Require('TypeUtil')
//@Require('bugdelta.DeltaBuilder')
//@Require('bugdelta.DeltaDocument')
//@Require('bugdelta.DeltaDocumentChange')
//@Require('bugdelta.ObjectChange')
//@Require('bugdelta.SetChange')
//@Require('meldbug.AddToSetOperation')
//@Require('meldbug.Meld')
//@Require('meldbug.MeldDocumentEvent')
//@Require('meldbug.RemoveFromSetOperation')
//@Require('meldbug.RemoveObjectPropertyOperation')
//@Require('meldbug.SetDocumentOperation')
//@Require('meldbug.SetObjectPropertyOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                               = bugpack.require('Class');
var Event                               = bugpack.require('Event');
var Set                                 = bugpack.require('Set');
var TypeUtil                            = bugpack.require('TypeUtil');
var DeltaBuilder                        = bugpack.require('bugdelta.DeltaBuilder');
var DeltaDocument                       = bugpack.require('bugdelta.DeltaDocument');
var DeltaDocumentChange                 = bugpack.require('bugdelta.DeltaDocumentChange');
var ObjectChange                        = bugpack.require('bugdelta.ObjectChange');
var SetChange                           = bugpack.require('bugdelta.SetChange');
var AddToSetOperation                   = bugpack.require('meldbug.AddToSetOperation');
var Meld                                = bugpack.require('meldbug.Meld');
var MeldDocumentEvent                   = bugpack.require('meldbug.MeldDocumentEvent');
var RemoveFromSetOperation              = bugpack.require('meldbug.RemoveFromSetOperation');
var RemoveObjectPropertyOperation       = bugpack.require('meldbug.RemoveObjectPropertyOperation');
var SetDocumentOperation                = bugpack.require('meldbug.SetDocumentOperation');
var SetObjectPropertyOperation          = bugpack.require('meldbug.SetObjectPropertyOperation');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Meld}
 */
var MeldDocument = Class.extend(Meld, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {MeldKey} meldKey
     * @param {*} data
     */
    _constructor: function(meldKey, data) {

        this._super(meldKey, MeldDocument.TYPE);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {DeltaBuilder}
         */
        this.deltaBuilder           = new DeltaBuilder();

        /**
         * @private
         * @type {DeltaDocument}
         */
        this.deltaDocument          = new DeltaDocument(data);
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {DeltaDocument}
     */
    getDeltaDocument: function() {
        return this.deltaDocument;
    },


    //-------------------------------------------------------------------------------
    // IClone Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean} deep
     * @return {*}
     */
    clone: function(deep) {
        var meldDocument = new MeldDocument(this.meldKey);
        meldDocument.getMeldOperationList().addAll(this.meldOperationList);
        meldDocument.deltaDocument = this.deltaDocument.clone(deep);
        return meldDocument;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} path
     * @param {*} setValue
     */
    addToSet: function(path, setValue) {
        var value = this.deltaDocument.getPath(path);
        if (Class.doesExtend(value, Set)) {
            value.add(setValue)
        } else {
            throw new Error("Value at path '" + path + "' is not a Set");
        }
    },

    /**
     *
     */
    commit: function() {
        /** @type {Delta} */
        var delta = this.deltaBuilder.buildDelta(this.deltaDocument, this.deltaDocument.getPreviousDocument());
        this.processDelta(delta);
        this.deltaDocument.commitDelta();
    },

    /**
     * @return {Object}
     */
    generateObject: function() {
        return this.deltaDocument.toObject();
    },

    /**
     * @return {*}
     */
    getData: function() {
        return this.deltaDocument.getData();
    },

    /**
     * @param {*} data
     */
    meldData: function(data) {
        var operation = new SetDocumentOperation(this.meldKey, data);
        this.meldOperation(operation);
    },

    /**
     * @param {string} path
     * @param {string} propertyName
     * @param {*} propertyValue
     */
    meldObjectProperty: function(path, propertyName, propertyValue) {
        var operation = new SetObjectPropertyOperation(this.meldKey, path, propertyName, propertyValue);
        this.meldOperation(operation);
    },

    /**
     * @param {string} path
     * @param {*} setValue
     */
    meldToSet: function(path, setValue) {
        var operation = new AddToSetOperation(this.meldKey, path, setValue);
        this.meldOperation(operation);
    },

    /**
     * @param {string} path
     * @param {*} setValue
     */
    removeFromSet: function(path, setValue) {
        var value = this.deltaDocument.getPath(path);
        if (Class.doesExtend(value, Set)) {
            value.remove(setValue)
        } else {
            throw new Error("Value at path '" + path + "' is not a Set");
        }
    },

    /**
     * @param {string} path
     * @param {string} propertyName
     */
    removeObjectProperty: function(path, propertyName) {
        var value = this.deltaDocument.getPath(path);
        if (TypeUtil.isObject(value)) {
            delete value[propertyName];
        } else {
            throw new Error("Value at path '" + path + "' is not an Object");
        }
    },

    /**
     * @param {*} data
     */
    setData: function(data) {
        this.deltaDocument.setData(data);
    },

    /**
     * @param {string} path
     * @param {string} propertyName
     * @param {*} propertyValue
     */
    setObjectProperty: function(path, propertyName, propertyValue) {
        var value = this.deltaDocument.getPath(path);
        if (TypeUtil.isObject(value)) {
            value[propertyName] = propertyValue;
        } else {
            throw new Error("Value at path '" + path + "' is not a Set");
        }
    },

    /**
     * @param {string} path
     * @param {*} setValue
     */
    unmeldFromSet: function(path, setValue) {
        var operation = new RemoveFromSetOperation(this.getMeldKey(), path, setValue);
        this.meldOperation(operation);
    },

    /**
     * @param {string} path
     * @param {string} propertyName
     */
    unmeldObjectProperty: function(path, propertyName) {
        var operation = new RemoveObjectPropertyOperation(this.getMeldKey(), path, propertyName);
        this.meldOperation(operation);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Delta} delta
     */
    processDelta: function(delta) {
        var _this = this;
        this.dispatchEvent(new MeldDocumentEvent(MeldDocumentEvent.EventTypes.CHANGES, {
            delta: delta
        }));
        delta.getDeltaChangeList().forEach(function(deltaChange) {
            _this.processDeltaChange(deltaChange);
        });
    },

    /**
     * @private
     * @param {DeltaChange} deltaChange
     */
    processDeltaChange: function(deltaChange) {
        var _this = this;
        switch (deltaChange.getChangeType()) {
            case DeltaDocumentChange.ChangeTypes.DATA_SET:
                _this.dispatchEvent(new MeldDocumentEvent(MeldDocumentEvent.EventTypes.RESET));
                break;
            case ObjectChange.ChangeTypes.PROPERTY_REMOVED:
                _this.dispatchEvent(new MeldDocumentEvent(MeldDocumentEvent.EventTypes.CHANGE, {
                    deltaChange: deltaChange,
                    changeType: MeldDocument.ChangeTypes.PROPERTY_REMOVED
                }));
                break;
            case ObjectChange.ChangeTypes.PROPERTY_SET:
                _this.dispatchEvent(new MeldDocumentEvent(MeldDocumentEvent.EventTypes.CHANGE, {
                    deltaChange: deltaChange,
                    changeType: MeldDocument.ChangeTypes.PROPERTY_SET
                }));
                break;
            case SetChange.ChangeTypes.ADDED_TO_SET:
                _this.dispatchEvent(new MeldDocumentEvent(MeldDocumentEvent.EventTypes.CHANGE, {
                    deltaChange: deltaChange,
                    changeType: MeldDocument.ChangeTypes.ADDED_TO_SET
                }));
                break;
            case SetChange.ChangeTypes.REMOVED_FROM_SET:
                _this.dispatchEvent(new MeldDocumentEvent(MeldDocumentEvent.EventTypes.CHANGE, {
                    deltaChange: deltaChange,
                    changeType: MeldDocument.ChangeTypes.REMOVED_FROM_SET
                }));
                break;
        }
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @static
 * @const {string}
 */
MeldDocument.TYPE = "MeldDocument";

/**
 * @static
 * @const {string}
 */
MeldDocument.ChangeTypes = {
    ADDED_TO_SET: "MeldDocument:AddedToSet",
    PROPERTY_REMOVED: "MeldDocument:PropertyRemoved",
    PROPERTY_SET: "MeldDocument:PropertySet",
    REMOVED_FROM_SET: "MeldDocument:RemovedFromSet"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldDocument', MeldDocument);
