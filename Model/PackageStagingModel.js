const mongoose = require('mongoose');
var validator = require('validator');




var PackageStagingSchema = new mongoose.Schema({

    PackageStagingId: {
        type: "Number"
    },
    Destination: {
        type: "String",
        lowercase: true
    },
    PackageType: {
        type: "String",
        lowercase: true
    },
    PackageDuration: {
        type: "Number",
        min: 7,
        max: 30
    },
    PackageStatus: {
        type: "String",
        default: "NEW"
    },
    TravelPlans: {
        type: [{
            TravelPartnerName: {
                type: "String",
                validate: {
                    validator(v) {
                        if (v == null || v == "") {
                            return false
                        }
                        else {
                            return true;
                        }
                    },
                    message: 'TP name can not be null'
                }
            },
            TravelPartnerWebsite: {
                type: "String"
            },
            TravelPartnerContactNumber: {
                type: "Number",
                validate: {
                    validator(v) {
                        if (v == null || v == NaN) {
                            return false
                        }
                        else {
                            return true;
                        }
                    }
                },
                message: 'Invalid phone number'
            },
            TravelCost: {
                type: Number,
                min: [5000,'Cost must be greater than 5000']
            },
            TravelPlanStatus: {
                type: "String",
                enum: ['POSTED NEW,ADMIN APPROVED,ADMIN REJECTED,UPDATED NEW']

            }
        }]
    }

});


mongoose.model('PackageStagingDetails', PackageStagingSchema);