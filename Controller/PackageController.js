const express = require('express');
const userModel = require('../Model/Connection');
const mongoose = require('mongoose');


const PackageModel = mongoose.model('PackageDetails');

const router = express.Router();

router.get('/getPackage/:PackageId', (req, res) => {
    var packageId = req.params.PackageId;
    PackageModel.findOne({ 'PackageId': packageId }, { _id: 0, __v: 0 }).exec((err, doc) => {
        if (err) throw Error(err)

        console.log(doc);

        if (doc == null) {
            res.send({ "Data": "invalid package id " + packageId });
        }

        else {
            res.send(doc);
        }

    })

})

router.post('/amendPackage/:PackageId', (req, res) => {
    var packageId = req.params.PackageId;
    var isTpExists = false;
    var index = 0;
    var newTravelPartner = new Array();
    /****validate the package id ********/
    PackageModel.findOne({ 'PackageId': packageId }).exec((err, doc) => {
        if (err) throw Error(err)

        if (doc == null) {
            res.send({ "Data": "invalid package id " + packageId });
        }
        else if (req.body.TravelPartnerName == null || req.body.TravelPartnerName == "") {
            res.send({ "Data": "Travel Partner name can not be empty" });
        }
        else {
            var travelPartnerNme = req.body.TravelPartnerName
            /***check if travel partner already exist ***/
            var travelPartnerArr = doc.TravelPlans;


            for (var i = 0; i < travelPartnerArr.length; i++) {
                if (travelPartnerArr[i].TravelPartnerName == travelPartnerNme) {
                    index = i;
                    isTpExists = true;
                    if (req.body.TravelPartnerWebsite != null) {
                        travelPartnerArr[i].TravelPartnerWebsite = req.body.TravelPartnerWebsite;
                    }
                    if (req.body.TravelPartnerContactNumber != null) {
                        travelPartnerArr[i].TravelPartnerContactNumber = req.body.TravelPartnerContactNumber
                    }
                    if (req.body.TravelCost != null) {
                        travelPartnerArr[i].TravelCost = req.body.TravelCost
                    }
                    newTravelPartner.push(travelPartnerArr[i])
                }
                else {
                    newTravelPartner.push(travelPartnerArr[i])
                }
            }

            if (isTpExists == true) {
                console.log('travel partner exists for this package, update package with provided details')

                PackageModel.updateOne(
                    { PackageId: packageId },
                    {
                        $set: {
                            TravelPlans: newTravelPartner
                        }
                    }
                ).exec(() => {
                    console.log()
                    res.send({
                        "Data": "travel partner exists and updated with new values",
                        "Status": "UPDATED"
                    })
                })

            }
            else {

                console.log('travel partner does not existfor this package, create a TravelPartner object and push')

                newTravelPartnerDetails = {
                    TravelPartnerName: req.body.TravelPartnerName,
                    TravelPartnerWebsite: "xyz@xyz.com",
                    TravelPartnerContactNumber: 9999999,
                    TravelCost: 0
                }


                if (req.body.TravelPartnerWebsite != null) {
                    newTravelPartnerDetails.TravelPartnerWebsite = req.body.TravelPartnerWebsite;
                }
                if (req.body.TravelPartnerContactNumber != null) {
                    newTravelPartnerDetails.TravelPartnerContactNumber = req.body.TravelPartnerContactNumber
                }
                if (req.body.TravelCost != null) {
                    newTravelPartnerDetails.TravelCost = req.body.TravelCost
                }
                else {
                    res.send({
                        "Data": "Travel cost is required",
                        "Status": "ERROR"
                    })

                    throw Error('TRAVEL COST IS REQUIRED')
                }


                newTravelPartner.push(newTravelPartnerDetails);

                PackageModel.updateOne(
                    { PackageId: packageId },
                    {
                        $set: {
                            TravelPlans: newTravelPartner
                        }
                    }
                ).exec(() => {
                    console.log()
                    res.send({
                        "Data": "New Travel Partner Added",
                        "Status": "INSERTED"
                    })
                })
            }
            //res.send(doc);
        }


    })

})

router.post('/addPackage', (req, res) => {
    var package = new PackageModel();


    /**Fetch maximum package id**/
    PackageModel.findOne({}, { _id: 0, __v: 0 }).sort('-PackageId').exec((err, rec) => {
        if (err) throw Error(err)

        if (rec == null) {
            package.PackageId = 1001
        }
        else {
            package.PackageId = parseInt(rec.PackageId) + 1;
        }


        package.Destination = req.body.Destination
        package.PackageType = req.body.PackageType
        package.PackageDuration = req.body.PackageDuration
        var TravelPlanSchema = req.body.TravelPlans
        console.log("****** sever log ********")
        console.log(TravelPlanSchema)

        package.TravelPlans = TravelPlanSchema;



        package.save().then((result) => {
            console.log(result)
            res.send(result)
        }).catch((err) => {
            res.send(err);
        });

    })

})


module.exports = router;
