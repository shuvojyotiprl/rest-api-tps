const mongoose = require('mongoose');
var validator = require('validator');

var PackageSchema = new mongoose.Schema({

    PackageId: {
        type: "Number"
    },
    Destination: {
        type: "String",
        lowercase:true
    },
    PackageType: {
        type: "String"
    },
    PackageDuration: {
        type: "Number"
    },
    TravelPlans: {
        type: [{
            TravelPartnerName: {
                type: "String"
            },
            TravelPartnerWebsite: {
                type: "String"
            },
            TravelPartnerContactNumber: {
                type: "Number"
            },
            TravelCost: {
                type: "Number"
            }
        }]
    }

});

/* var TravelPlanSchema = new mongoose.Schema({
    TravelPartnerName: {
        type: "String"
    },
    TravelPartnerWebsite: {
        type: "String"
    },
    TravelPartnerContactNumber: {
        type: "Number"
    },
    TravelCost: {
        type: "Number"
    }
})
 */
mongoose.model('PackageDetails', PackageSchema);