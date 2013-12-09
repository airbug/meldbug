//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('meldbug.MeldBuilder')
//@Require('meldbug.MeldDocument')
//@Require('meldbug.MeldKey')
//@Require('meldbug.MeldMeldOperation')
//@Require('meldbug.MeldTransaction')
//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var MeldBuilder         = bugpack.require('meldbug.MeldBuilder');
var MeldDocument        = bugpack.require('meldbug.MeldDocument');
var MeldKey             = bugpack.require('meldbug.MeldKey');
var MeldMeldOperation   = bugpack.require('meldbug.MeldMeldOperation');
var MeldTransaction     = bugpack.require('meldbug.MeldTransaction');
var BugMeta             = bugpack.require('bugmeta.BugMeta');
var TestAnnotation      = bugpack.require('bugunit-annotate.TestAnnotation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta             = BugMeta.context();
var test                = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldBuilderGenerateMeldKeyTest = {

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
        var meldKey = this.testMeldBuilder.generateMeldKey(this.testDataType, this.testId);
        test.assertEqual(meldKey.getDataType(), this.testDataType,
            "Assert meldKey's dataType is testDataType");
        test.assertEqual(meldKey.getId(), this.testId,
            "Assert meldKey's id is testId");
    }
};
bugmeta.annotate(meldBuilderGenerateMeldKeyTest).with(
    test().name("MeldBuilder #generateMeldKey Test")
);


var meldBuilderBuildMeldTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testMeldData = {
            meldType: MeldDocument.TYPE,
            meldKey: {
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
            },
            meldOperationList: [

            ]
        };
        this.testMeldBuilder = new MeldBuilder();
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var meld = this.testMeldBuilder.buildMeld(this.testMeldData);

        //TODO BRN: finish the rest of this test
    }
};
bugmeta.annotate(meldBuilderBuildMeldTest).with(
    test().name("MeldBuilder #buildMeld Test")
);

var meldBuilderBuildMeldKeyTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testMeldKeyData = {
            dataType: "testDataType",
            id: "testId"
        };
        this.testMeldBuilder = new MeldBuilder();
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var meldKey = this.testMeldBuilder.buildMeldKey(this.testMeldKeyData);
        test.assertEqual(meldKey.getDataType(), this.testMeldKeyData.dataType,
            "Assert meldKey's dataType is testMeldKeyData.dataType");
        test.assertEqual(meldKey.getId(), this.testMeldKeyData.id,
            "Assert meldKey's id is testId");
    }
};
bugmeta.annotate(meldBuilderBuildMeldKeyTest).with(
    test().name("MeldBuilder #buildMeldKey Test")
);

var meldBuilderUnbuildMeldKeyTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testDataType = "testDataType";
        this.testId = "testId";
        this.testMeldKey    = new MeldKey(this.testDataType, this.testId);
        this.testMeldBuilder = new MeldBuilder();
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var meldKeyData = this.testMeldBuilder.unbuildMeldKey(this.testMeldKey);
        test.assertEqual(meldKeyData.dataType, this.testDataType,
            "Assert meldKeyData's dataType is testDataType");
        test.assertEqual(meldKeyData.id, this.testId,
            "Assert meldKeyData's id is testId");
    }
};
bugmeta.annotate(meldBuilderUnbuildMeldKeyTest).with(
    test().name("MeldBuilder #unbuildMeldKey Test")
);


var meldBuilderBuildMeldOperationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.testMeldMeldOperationData = {
            meldKey: {
                dataType: "testDataType",
                id: "testId"
            },
            type: MeldMeldOperation.TYPE,
            meld: {
                meldKey: {
                    dataType: "testDataType",
                    id: "testId"
                },
                meldType: MeldDocument.TYPE,
                data: {
                    type: MeldBuilder.TYPES.OBJECT,
                    value: {
                        key: {
                            type: MeldBuilder.TYPES.STRING,
                            value: "value"
                        }
                    }
                },
                meldOperationList: []
            }
        };
        this.testMeldBuilder = new MeldBuilder();
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var meldOperation = this.testMeldBuilder.buildMeldOperation(this.testMeldMeldOperationData);
        test.assertEqual(meldOperation.getMeldKey().getDataType(), this.testMeldMeldOperationData.meldKey.dataType,
            "Assert meldOperation.meldKey's dataType is testMeldMeldOperationData.meldKey.dataType");
        test.assertEqual(meldOperation.getMeldKey().getId(), this.testMeldMeldOperationData.meldKey.id,
            "Assert meldOperation.meldKey's id is testMeldMeldOperationData.meldKey.id");
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
        this.testMeldKey    = new MeldKey(this.testDataType, this.testId);
        this.testData       = {
            key: "value"
        };
        this.testMeld       = new MeldDocument(this.testMeldKey, this.testData);
        this.testMeldMeldOperation = new MeldMeldOperation(this.testMeldKey, this.testMeld);
        this.testMeldBuilder = new MeldBuilder();
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        var meldMeldOperationData = this.testMeldBuilder.unbuildMeldOperation(this.testMeldMeldOperation);
        test.assertEqual(meldMeldOperationData.meldKey.dataType, this.testDataType,
            "Assert meldMeldOperationData.meldKey's dataType is testDataType");
        test.assertEqual(meldMeldOperationData.meldKey.id, this.testId,
            "Assert meldMeldOperationData.meldKey's id is testId");
        test.assertEqual(meldMeldOperationData.type, MeldMeldOperation.TYPE,
            "Assert meldMeldOperationData.type is MeldMeldOperation.TYPE");
        test.assertEqual(meldMeldOperationData.meld.meldType, MeldDocument.TYPE,
            "Assert meldMeldOperationData.meld.meldType is MeldDocument.TYPE");

        // Assert marshalled data
        test.assertEqual(meldMeldOperationData.meld.data.type, MeldBuilder.TYPES.OBJECT,
            "Assert meldMeldOperationData.meld.data.type is MeldBuilder.TYPES.OBJECT");
        test.assertEqual(meldMeldOperationData.meld.data.value.key.type, MeldBuilder.TYPES.STRING,
            "Assert value.key is of type String");
        test.assertEqual(meldMeldOperationData.meld.data.value.key.value, "value");
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
