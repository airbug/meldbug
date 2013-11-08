//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@TestFile

//@Require('bugmeta.BugMeta')
//@Require('bugunit-annotate.TestAnnotation')
//@Require('meldbug.Meld')
//@Require('meldbug.MeldBucket')
//@Require('meldbug.MeldEvent')
//@Require('meldbug.MeldKey')
//@Require('meldbug.MeldMeldOperation')
//@Require('meldbug.MeldOperation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var TestAnnotation          = bugpack.require('bugunit-annotate.TestAnnotation');
var Meld                    = bugpack.require('meldbug.Meld');
var MeldBucket              = bugpack.require('meldbug.MeldBucket');
var MeldEvent               = bugpack.require('meldbug.MeldEvent');
var MeldKey                 = bugpack.require('meldbug.MeldKey');
var MeldMeldOperation       = bugpack.require('meldbug.MeldMeldOperation');
var MeldOperation           = bugpack.require('meldbug.MeldOperation');
var RemoveMeldOperation     = bugpack.require('meldbug.RemoveMeldOperation');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var bugmeta                 = BugMeta.context();
var test                    = TestAnnotation.test;


//-------------------------------------------------------------------------------
// Declare Tests
//-------------------------------------------------------------------------------

var meldBucketContainsMeldTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.meldBucket = new MeldBucket();
        this.meldKey    = new MeldKey("TestType", "testId", "basic");
        this.meld       = new Meld(this.meldKey, this.meldType);
        this.meldBucket.addMeld(this.meld);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(this.meldBucket.containsMeld(this.meld),
            "Assert #containsMeld returns true for a meld that has been added to the meldBucket");
        test.assertEqual(this.meldBucket.getMeld(this.meldKey), this.meld,
            "Assert the correct meld is in the meldBucket");
    }
};
bugmeta.annotate(meldBucketContainsMeldTest).with(
    test().name("MeldBucket - #containsMeld Test")
);

var meldBucketContainsMeldByKeyTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.meldBucket = new MeldBucket();
        this.meldKey    = new MeldKey("TestType", "testId", "basic");
        this.meld       = new Meld(this.meldKey, this.meldType);
        this.meldBucket.addMeld(this.meld);
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(this.meldBucket.containsMeldByKey(this.meldKey),
            "Assert #containsMeld returns true for a meld that has been added to the meldBucket");
        test.assertEqual(this.meldBucket.getMeld(this.meldKey), this.meld,
            "Assert the correct meld is in the meldBucket");
    }
};
bugmeta.annotate(meldBucketContainsMeldByKeyTest).with(
    test().name("MeldBucket - #containsMeldByKey Test")
);

var meldBucketAddMeldTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.meldBucket = new MeldBucket();
        this.meldKey    = new MeldKey("TestType", "testId", "basic");
        this.meld       = new Meld(this.meldKey, this.meldType);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertFalse(this.meldBucket.containsMeld(this.meld),
            "Assert meldBucket does not contain meld");
        this.meldBucket.addMeld(this.meld);
        test.assertTrue(this.meldBucket.containsMeld(this.meld),
            "Assert the meld has been added");
    }
};
bugmeta.annotate(meldBucketAddMeldTest).with(
    test().name("MeldBucket - #addMeld Test")
);

var meldBucketRemoveMeldTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.meldBucket = new MeldBucket();
        this.meldKey    = new MeldKey("TestType", "testId", "basic");
        this.meld       = new Meld(this.meldKey, this.meldType);

    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertFalse(this.meldBucket.containsMeld(this.meld),
            "Assert meldBucket does not contain meld");
        this.meldBucket.addMeld(this.meld);
        test.assertTrue(this.meldBucket.containsMeld(this.meld),
            "Assert the meld has been added");
        this.meldBucket.removeMeld(this.meldKey);
        test.assertFalse(this.meldBucket.containsMeld(this.meld),
            "Assert the meld has been removed");
    }
};
bugmeta.annotate(meldBucketRemoveMeldTest).with(
    test().name("MeldBucket - #removeMeld Test")
);

var meldBucketMeldOperationTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test){
        this.meldBucket             = new MeldBucket();
        this.meldKey                = new MeldKey("TestType", "testIdTwo", "basic");
        this.meld                   = new Meld(this.meldKey, this.meldType);
        this.meldMeldOperation      = new MeldMeldOperation(this.meldKey, this.meld);
        this.removeMeldOperation    = new RemoveMeldOperation(this.meldKey);
        this.eventCounter           = 0;
        this.returnedData           = undefined;
        this.handleEvent            = function(event){
            this.eventCounter += 1;
            this.returnedData = event.getData();
        };
    },

    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test){
        this.meldBucket.addEventListener(MeldEvent.EventTypes.OPERATION, this.handleEvent, this);
        this.meldBucket.meldOperation(this.meldMeldOperation);
        test.assertTrue(this.eventCounter === 1,
            "Assert MeldEvent.EventTypes.OPERATION was dispatched during #meldOperation");
        test.assertEqual(this.returnedData.meldOperation, this.meldMeldOperation,
            "Assert dispatched event contained the correct data");
        test.assertTrue(this.meldBucket.containsMeld(this.meld),
            "Assert the meld is contained in the meldBucket");
        this.meldBucket.meldOperation(this.removeMeldOperation);
        test.assertTrue(this.eventCounter === 2,
            "Assert MeldEvent.EventTypes.OPERATION was dispatched during #meldOperation");
        test.assertEqual(this.returnedData.meldOperation, this.removeMeldOperation,
            "Assert dispatched event contained the correct data");
        test.assertFalse(this.meldBucket.containsMeld(this.meld),
            "Assert the meld is not contained in the meldBucket");
    }
};
bugmeta.annotate(meldBucketMeldOperationTest).with(
    test().name("MeldBucket - #meldOperation Test")
);

var meldBucketMeldMeldTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.meldBucket = new MeldBucket();
        this.meldKey    = new MeldKey("TestType", "testId", "basic");
        this.meld       = new Meld(this.meldKey, this.meldType);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertFalse(this.meldBucket.containsMeld(this.meld),
            "Assert meld is not contained in the meldBucket prior to meldMeld call");
        this.meldBucket.meldMeld(this.meld);
        test.assertTrue(this.meldBucket.containsMeld(this.meld),
            "Assert meld is contained in the meldBucket after the meldMeld call");
    }
};
bugmeta.annotate(meldBucketMeldMeldTest).with(
    test().name("MeldBucket - #meldMeld Test")
);

var meldBucketUnmeldMeldTest = {

    //-------------------------------------------------------------------------------
    // Setup Test
    //-------------------------------------------------------------------------------

    setup: function(test) {
        this.meldBucket = new MeldBucket();
        this.meldKey    = new MeldKey("TestType", "testId", "basic");
        this.meld       = new Meld(this.meldKey, this.meldType);
        this.meldBucket.meldMeld(this.meld);
    },


    //-------------------------------------------------------------------------------
    // Run Test
    //-------------------------------------------------------------------------------

    test: function(test) {
        test.assertTrue(this.meldBucket.containsMeld(this.meld),
            "Assert meld is contained in the meldBucket prior to meldMeld call");
        this.meldBucket.unmeldMeld(this.meld);
        test.assertFalse(this.meldBucket.containsMeld(this.meld),
            "Assert meld is not contained in the meldBucket after the meldMeld call");
    }
};
bugmeta.annotate(meldBucketUnmeldMeldTest).with(
    test().name("MeldBucket - #unmeld Test")
);
