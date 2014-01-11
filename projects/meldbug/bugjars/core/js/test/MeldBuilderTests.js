//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('meldbug.PutMeldDocumentOperation')
//@Require('meldbug.MeldBuilder')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldDocumentKey')
//@Require('meldbug.MeldTransaction')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var PutMeldDocumentOperation    = bugpack.require('meldbug.PutMeldDocumentOperation');
var MeldBuilder                 = bugpack.require('meldbug.MeldBuilder');
var MeldDocument                = bugpack.require('meldbug.MeldDocument');
var MeldDocumentKey                     = bugpack.require('meldbug.MeldDocumentKey');
var MeldTransaction             = bugpack.require('meldbug.MeldTransaction');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var TestAnnotation              = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta             = BugMeta.context();
var test                = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldBuilderGenerateMeldDocumentKeyTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testDataType = "testDataType";
        this.testId = "testId";
        this.testMeldBuilder = new MeldBuilder();
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var meldDocumentKey = this.testMeldBuilder.generateMeldDocumentKey(this.testDataType, this.testId);
        test.assertEqual(meldDocumentKey.getDataType(), this.testDataType,
            "Assert meldDocumentKey's dataType is testDataType");
        test.assertEqual(meldDocumentKey.getId(), this.testId,
            "Assert meldDocumentKey's id is testId");
    }
};
bugmeta.annotate(meldBuilderGenerateMeldDocumentKeyTest).with(
    test().name("MeldBuilder #generateMeldDocumentKey Test")
);


var meldBuilderBuildMeldTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testMeldDocumentData = {
            meldDocumentKey: {
                dataType: "testDataType",
                id: "testId",
                filterType: "testFilterType"
            },
            data: {
                type: MeldBuilder.TYPES.OBJECT,
                value: {
                    key: {
                        type: MeldBuilder.TYPES.STRING,
                        value: "value"
                    }
                }
            }
        };
        this.testMeldBuilder = new MeldBuilder();
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var meld = this.testMeldBuilder.buildMeldDocument(this.testMeldDocumentData);

        //TODO BRN: finish the rest of this test
    }
};
bugmeta.annotate(meldBuilderBuildMeldTest).with(
    test().name("MeldBuilder #buildMeld Test")
);

var meldBuilderBuildMeldDocumentKeyTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testMeldDocumentKeyData = {
            dataType: "testDataType",
            id: "testId"
        };
        this.testMeldBuilder = new MeldBuilder();
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
        this.testMeldBuilder = new MeldBuilder();
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
                data: {
                    type: MeldBuilder.TYPES.OBJECT,
                    value: {
                        key: {
                            type: MeldBuilder.TYPES.STRING,
                            value: "value"
                        }
                    }
                }
            }
        };
        this.testMeldBuilder = new MeldBuilder();
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
        this.testMeldBuilder        = new MeldBuilder();
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

        // Assert marshalled data
        test.assertEqual(operationData.meldDocument.data.type, MeldBuilder.TYPES.OBJECT,
            "Assert operationData.meld.data.type is MeldBuilder.TYPES.OBJECT");
        test.assertEqual(operationData.meldDocument.data.value.key.type, MeldBuilder.TYPES.STRING,
            "Assert value.key is of type String");
        test.assertEqual(operationData.meldDocument.data.value.key.value, "value",
            "Assert key value was correct unbuilt");
    }
};
bugmeta.annotate(meldBuilderUnbuildMeldOperationTest).with(
    test().name("MeldBuilder #unbuildMeldOperation Test")
);

// var meldBuilderBuildMeldTransactionTest = {

//     setup: function(test) {
//         this.meldTransaction = new MeldTransaction();
//         this.meldBuilder = new MeldBuilder();
//     },

//     test: function(test) {

//     }
// };
// bugmeta.annotate(meldBuilderBuildMeldTransactionTest).with(
//     test().name("MeldBuilder #buildMeldTransaction Test")
// );

// var meldBuilderUnbuildMeldTransactionTest = {

//     setup: function(test) {
//         this.meldTransaction = new MeldTransaction();
//         this.meldBuilder = new MeldBuilder();
//     },

//     test: function(test) {

//     }
// };
// bugmeta.annotate(meldBuilderUnbuildMeldTransactionTest).with(
//     test().name("MeldBuilder #unbuildMeldTransaction Test")
// );

// var meldBuilderUnmarshalDataTest = {

//     setup: function(test) {
//         this.meldBuilder = new MeldBuilder();
//     },

//     test: function(test) {

//     }
// };
// bugmeta.annotate(meldBuilderUnmarshalDataTest).with(
//     test().name("MeldBuilder #unmarshalData Test")
// );
//