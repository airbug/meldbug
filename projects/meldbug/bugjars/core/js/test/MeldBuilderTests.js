//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('Class')
//@Require('TypeUtil')
//@Require('bugmarsh.MarshRegistry')
//@Require('bugmarsh.Marshaller')
//@Require('bugmeta.BugMeta')
//@Require('bugunit.TestAnnotation')
//@Require('bugyarn.BugYarn')
//@Require('meldbug.PutMeldDocumentOperation')
//@Require('meldbug.MeldBuilder')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldDocumentKey')
//@Require('meldbug.MeldTransaction')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var TypeUtil                    = bugpack.require('TypeUtil');
var MarshRegistry               = bugpack.require('bugmarsh.MarshRegistry');
var Marshaller                  = bugpack.require('bugmarsh.Marshaller');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var TestAnnotation              = bugpack.require('bugunit.TestAnnotation');
var BugYarn                     = bugpack.require('bugyarn.BugYarn');
var PutMeldDocumentOperation    = bugpack.require('meldbug.PutMeldDocumentOperation');
var MeldBuilder                 = bugpack.require('meldbug.MeldBuilder');
var MeldDocument                = bugpack.require('meldbug.MeldDocument');
var MeldDocumentKey             = bugpack.require('meldbug.MeldDocumentKey');
var MeldTransaction             = bugpack.require('meldbug.MeldTransaction');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                     = BugMeta.context();
var bugyarn                     = BugYarn.context();
var test                        = TestAnnotation.test;


//-------------------------------------------------------------------------------
// BugYarn
//-------------------------------------------------------------------------------

bugyarn.registerWinder("setupTestMeldBuilder", function(yarn) {
    yarn.spin([
        "setupTestMarshaller"
    ]);
    yarn.wind({
        meldBuilder: new MeldBuilder(this.marshaller)
    });
});


//-------------------------------------------------------------------------------
// Helper Functions
//-------------------------------------------------------------------------------

var setupMeldBuilder = function(setupObject) {
    setupObject.marshRegistry.processModule();
};


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldBuilderInstantiationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn    = bugyarn.yarn(this);
        yarn.spin([
            "setupTestMarshaller"
        ]);
        this.testMeldBuilder    = new MeldBuilder(this.marshaller);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(Class.doesExtend(this.testMeldBuilder, MeldBuilder),
            "Assert instance of MeldBuilder");
        test.assertEqual(this.testMeldBuilder.getMarshaller(), this.marshaller,
            "Assert .marshaller was set correctly");
    }
};

var meldBuilderGenerateMeldDocumentKeyTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn                = bugyarn.yarn(this);
        yarn.spin([
            "setupTestMeldBuilder"
        ]);
        setupMeldBuilder(this);
        this.testDataType       = "testDataType";
        this.testId             = "testId";
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var meldDocumentKey = this.meldBuilder.generateMeldDocumentKey(this.testDataType, this.testId);
        test.assertEqual(meldDocumentKey.getDataType(), this.testDataType,
            "Assert meldDocumentKey's dataType is testDataType");
        test.assertEqual(meldDocumentKey.getId(), this.testId,
            "Assert meldDocumentKey's id is testId");
    }
};


var meldBuilderMarshalUnmarshalMeldDocumentTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        var yarn                = bugyarn.yarn(this);
        yarn.spin([
            "setupTestMeldBuilder"
        ]);
        setupMeldBuilder(this);
        this.testDataType           = "testDataType";
        this.testId                 = "testId";
        this.testMeldDocumentKey    = yarn.weave("testMeldDocumentKey", [this.testDataType, this.testId]);
        this.testData               = {
            key: this.testValue
        };
        this.testMeldDocument       = yarn.weave("testMeldDocument", [this.testMeldDocumentKey, this.testData]);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var meldDocumentData = this.meldBuilder.marshalData(this.testMeldDocument);
        test.assertTrue(TypeUtil.isString(meldDocumentData),
            "Assert MeldDocument was converted in to a string");
        var meldDocument = this.meldBuilder.unmarshalData(meldDocumentData);
        test.assertEqual(meldDocument.getData().key, this.testValue,
            "Assert data was correctly marshalled/unmarshalled");
        test.assertEqual(meldDocument.getMeldDocumentKey(), this.testMeldDocumentKey,
            "Assert MeldDocumentKey was marshalled/unmarshalled");
        test.assertTrue(meldDocument.getMeldDocumentKey() !== this.testMeldDocumentKey,
            "Assert MeldDocumentKey is not the same instance as the testMeldDocumentKey")
    }
};

/*var meldBuilderBuildMeldDocumentKeyTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testMeldDocumentKeyData = {
            dataType: "testDataType",
            id: "testId"
        };
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var meldDocumentKey = this.testMeldBuilder.buildMeldDocumentKey(this.testMeldDocumentKeyData);
        test.assertEqual(meldDocumentKey.getDataType(), this.testMeldDocumentKeyData.dataType,
            "Assert meldDocumentKey's dataType is testMeldDocumentKeyData.dataType");
        test.assertEqual(meldDocumentKey.getId(), this.testMeldDocumentKeyData.id,
            "Assert meldDocumentKey's id is testId");
    }
};
bugmeta.annotate(meldBuilderBuildMeldDocumentKeyTest).with(
    test().name("MeldBuilder #buildMeldDocumentKey Test")
);

var meldBuilderUnbuildMeldDocumentKeyTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testDataType = "testDataType";
        this.testId = "testId";
        this.testMeldDocumentKey    = new MeldDocumentKey(this.testDataType, this.testId);
        this.testMeldBuilder = setupMeldBuilder();
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var meldDocumentKeyData = this.testMeldBuilder.unbuildMeldDocumentKey(this.testMeldDocumentKey);
        test.assertEqual(meldDocumentKeyData.dataType, this.testDataType,
            "Assert meldDocumentKeyData's dataType is testDataType");
        test.assertEqual(meldDocumentKeyData.id, this.testId,
            "Assert meldDocumentKeyData's id is testId");
    }
};
bugmeta.annotate(meldBuilderUnbuildMeldDocumentKeyTest).with(
    test().name("MeldBuilder #unbuildMeldDocumentKey Test")
);


var meldBuilderBuildMeldOperationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testPutMeldDocumentOperationData = {
            meldDocumentKey: {
                dataType: "testDataType",
                id: "testId"
            },
            type: PutMeldDocumentOperation.TYPE,
            meldDocument: {
                meldDocumentKey: {
                    dataType: "testDataType",
                    id: "testId"
                },
                data: JSON.stringify({
                    key: "value"
                })
            }
        };
        this.testMeldBuilder = setupMeldBuilder();
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var meldOperation = this.testMeldBuilder.buildMeldOperation(this.testPutMeldDocumentOperationData);
        test.assertEqual(meldOperation.getMeldDocumentKey().getDataType(), this.testPutMeldDocumentOperationData.meldDocumentKey.dataType,
            "Assert meldOperation.meldDocumentKey's dataType is testPutMeldDocumentOperationData.meldDocumentKey.dataType");
        test.assertEqual(meldOperation.getMeldDocumentKey().getId(), this.testPutMeldDocumentOperationData.meldDocumentKey.id,
            "Assert meldOperation.meldDocumentKey's id is testPutMeldDocumentOperationData.meldDocumentKey.id");
        test.assertEqual(meldOperation.getMeldDocument().getData().key, "value",
            "Assert meldOperation's meldDocument was set correctly");
    }
};
bugmeta.annotate(meldBuilderBuildMeldOperationTest).with(
    test().name("MeldBuilder #buildMeldOperation Test")
);

var meldBuilderUnbuildMeldOperationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testDataType = "testDataType";
        this.testId = "testId";
        this.testMeldDocumentKey            = new MeldDocumentKey(this.testDataType, this.testId);
        this.testData               = {
            key: "value"
        };
        this.testMeldDocument       = new MeldDocument(this.testMeldDocumentKey, this.testData);
        this.testOperationData      = new PutMeldDocumentOperation(this.testMeldDocumentKey, this.testMeldDocument);
        this.testMeldBuilder        = setupMeldBuilder();
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var operationData = this.testMeldBuilder.unbuildMeldOperation(this.testOperationData);
        test.assertEqual(operationData.meldDocumentKey.dataType, this.testDataType,
            "Assert operationData.meldDocumentKey's dataType is testDataType");
        test.assertEqual(operationData.meldDocumentKey.id, this.testId,
            "Assert operationData.meldDocumentKey's id is testId");
        test.assertEqual(operationData.type, PutMeldDocumentOperation.TYPE,
            "Assert operationData.type is PutMeldDocumentOperation.TYPE");

        test.assertTrue(TypeUtil.isString(operationData.meldDocument.data),
            "Assert operation data was turned in to a string");
        // Assert marshalled data
        var marshalledData = JSON.parse(operationData.meldDocument.data);
        test.assertTrue(TypeUtil.isObject(marshalledData),
            "Assert marshalledData is an object");
        test.assertEqual(marshalledData.key, "value",
            "Assert marshalledData.key is 'value'");
    }
};*/


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(meldBuilderInstantiationTest).with(
    test().name("MeldBuilder - instantiation test")
);

bugmeta.annotate(meldBuilderGenerateMeldDocumentKeyTest).with(
    test().name("MeldBuilder #generateMeldDocumentKey Test")
);

bugmeta.annotate(meldBuilderMarshalUnmarshalMeldDocumentTest).with(
    test().name("MeldBuilder - marshal and unmarshal Test")
);

/*bugmeta.annotate(meldBuilderUnbuildMeldOperationTest).with(
    test().name("MeldBuilder #unbuildMeldOperation Test")
);*/
