//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('meldbug.MeldDocument')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('IDocument')
//@Require('ISet')
//@Require('Set')
//@Require('TypeUtil')
//@Require('bugdelta.DeltaBuilder')
//@Require('bugdelta.DeltaDocument')
//@Require('bugdelta.DocumentChange')
//@Require('bugdelta.ObjectChange')
//@Require('bugdelta.SetChange')
//@Require('bugmarsh.MarshAnnotation');
//@Require('bugmarsh.MarshPropertyAnnotation');
//@Require('bugmeta.BugMeta')
//@Require('meldbug.MeldDocumentEvent')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Event                       = bugpack.require('Event');
var EventDispatcher             = bugpack.require('EventDispatcher');
var IDocument                   = bugpack.require('IDocument');
var ISet                        = bugpack.require('ISet');
var Set                         = bugpack.require('Set');
var TypeUtil                    = bugpack.require('TypeUtil');
var DeltaBuilder                = bugpack.require('bugdelta.DeltaBuilder');
var DeltaDocument               = bugpack.require('bugdelta.DeltaDocument');
var DocumentChange              = bugpack.require('bugdelta.DocumentChange');
var ObjectChange                = bugpack.require('bugdelta.ObjectChange');
var SetChange                   = bugpack.require('bugdelta.SetChange');
var MarshAnnotation             = bugpack.require('bugmarsh.MarshAnnotation');
var MarshPropertyAnnotation     = bugpack.require('bugmarsh.MarshPropertyAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var MeldDocumentEvent           = bugpack.require('meldbug.MeldDocumentEvent');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var marsh                       = MarshAnnotation.marsh;
var property                    = MarshPropertyAnnotation.property;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {EventDispatcher}
 * @implements {IDocument}
 */
var MeldDocument = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {MeldDocumentKey} meldDocumentKey
     * @param {*} data
     */
    _constructor: function(meldDocumentKey, data) {

        this._super();


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

        /**
         * @private
         * @type {MeldBucket}
         */
        this.meldBucket             = null;

        /**
         * @private
         * @type {MeldDocumentKey}
         */
        this.meldDocumentKey        = meldDocumentKey;
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

    /**
     * @return {MeldBucket}
     */
    getMeldBucket: function() {
        return this.meldBucket;
    },

    /**
     * @param {MeldBucket} meldBucket
     */
    setMeldBucket: function(meldBucket) {
        this.meldBucket = meldBucket;
    },

    /**
     * @return {MeldDocumentKey}
     */
    getMeldDocumentKey: function() {
        return this.meldDocumentKey;
    },


    //-------------------------------------------------------------------------------
    // IClone Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean} deep
     * @return {*}
     */
    clone: function(deep) {
        var meldDocument = new MeldDocument(this.meldDocumentKey);
        meldDocument.deltaDocument = this.deltaDocument.clone(deep);
        return meldDocument;
    },


    //-------------------------------------------------------------------------------
    // IObjectable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {Object}
     */
    toObject: function() {
        return {
            data: this.generateObject(),
            meldDocumentKey: this.meldDocumentKey.toObject(),
            meldType: this.meldType
        };
    },


    //-------------------------------------------------------------------------------
    // IDocument Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {*}
     */
    getData: function() {
        return this.deltaDocument.getData();
    },

    /**
     * @param {*} data
     */
    mergeData: function(data) {
        this.deltaDocument.mergeData(data);
    },

    /**
     * @param {*} data
     */
    setData: function(data) {
        this.deltaDocument.setData(data);
    },

    /**
     * @param {string} path
     * @return {*}
     */
    getPath: function(path) {
        return this.deltaDocument.getPath(path);
    },

    /**
     * @param {string} path
     * @param {*} value
     */
    setPath: function(path, value) {
        this.deltaDocument.setPath(path, value);
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} path
     * @param {*} setValue
     */
    addToSet: function(path, setValue) {
        var pathValue = this.deltaDocument.getPath(path);
        if (!Class.doesImplement(pathValue, ISet)) {
            pathValue = new Set();
        }
        pathValue.add(setValue);
        this.setPath(path, pathValue)
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
     * @param {string} path
     * @param {*} setValue
     */
    removeFromSet: function(path, setValue) {
        var pathValue = this.deltaDocument.getPath(path);
        if (!Class.doesImplement(pathValue, Set)) {
            pathValue.remove(setValue)
        } else {
            if (!TypeUtil.isNull(pathValue) && !TypeUtil.isUndefined(pathValue)) {
                throw new Error("Value at path '" + path + "' is not a Set");
            }
        }
    },

    /**
     * @param {string} path
     * @param {string} propertyName
     */
    removeObjectProperty: function(path, propertyName) {
        var pathValue = this.deltaDocument.getPath(path);
        if (TypeUtil.isObject(pathValue)) {
            delete pathValue[propertyName];
        } else {
            if (!TypeUtil.isNull(pathValue) && !TypeUtil.isUndefined(pathValue)) {
                throw new Error("Value at path '" + path + "' is not an Object");
            }
        }
    },

    /**
     * @param {string} path
     * @param {string} propertyName
     * @param {*} propertyValue
     */
    setObjectProperty: function(path, propertyName, propertyValue) {
        var pathValue = this.deltaDocument.getPath(path);
        if (!TypeUtil.isObject(pathValue)) {
            pathValue = {};
        }
        pathValue[propertyName] = propertyValue;
        this.setPath(path, pathValue)
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
            case DocumentChange.ChangeTypes.DATA_SET:
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
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(MeldDocument, IDocument);


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

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
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(MeldDocument).with(
    marsh("MeldDocument")
        .properties([
            property("data")
                .getter("getData")
                .setter("setData"),
            property("meldDocumentKey")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('meldbug.MeldDocument', MeldDocument);
