const express = require('express');
const mongoose = require('mongoose');

const PackageModel = mongoose.model('PackageDetails');


const router = express.Router();

var Trip = require('../Model/TripModel')


router.post('/search', (req, res) => {

    var searchByDest = false;
    var searchByBudget = false;
    var searchByDuration = false;

    if (req.body.destination != null) {
        var dest = req.body.destination;
        searchByDest = true;
    }

    if (req.body.budget != null) {
        var lowerBudget = req.body.budget.lower;
        var upperBudget = req.body.budget.upper;
        searchByBudget = true;
    }

    if (req.body.duration != null) {
        var from = req.body.duration.from;
        var to = req.body.duration.to;
        searchByDuration = true;
    }

    if (searchByDest && searchByBudget && searchByDuration) {
        var tripArray = new Array();
        console.log("Search with all criteria");
        PackageModel.find({
            $and: [
                { Destination: { $regex: new RegExp("^" + dest.toLowerCase(), "i") } },
                { PackageDuration: { $gte: from } },
                { PackageDuration: { $lte: to } }
            ]
        })
            .then((docs) => {
                console.log(docs)

                for (var x = 0; x < docs.length; x++) {

                    var travelPlanArr = docs[x].TravelPlans;
                    console.log(travelPlanArr)
                    for (var y = 0; y < travelPlanArr.length; y++) {

                        var trip = new Trip(docs[x].Destination, travelPlanArr[y].TravelPartnerWebsite, travelPlanArr[y].TravelCost,
                            travelPlanArr[y].TravelPartnerName, travelPlanArr[y].TravelPartnerContactNumber, docs[x].PackageDuration)

                        if (travelPlanArr[y].TravelCost >= lowerBudget && travelPlanArr[y].TravelCost <= upperBudget) {
                            tripArray.push(trip)
                        }


                    }
                }

                res.send(tripArray);


            }).catch((err) => {
                throw Error(err)
            })

    }
    else if (searchByDest && searchByBudget) {
        console.log("Search with  Dest and Budget");


        var tripArray = new Array();
        PackageModel.find({ Destination: { $regex: new RegExp("^" + dest.toLowerCase(), "i") } })
            .then((docs) => {
                console.log(docs)

                for (var x = 0; x < docs.length; x++) {

                    var travelPlanArr = docs[x].TravelPlans;
                    console.log(travelPlanArr)
                    for (var y = 0; y < travelPlanArr.length; y++) {

                        var trip = new Trip(docs[x].Destination, travelPlanArr[y].TravelPartnerWebsite, travelPlanArr[y].TravelCost,
                            travelPlanArr[y].TravelPartnerName, travelPlanArr[y].TravelPartnerContactNumber, docs[x].PackageDuration)

                        if (travelPlanArr[y].TravelCost >= lowerBudget && travelPlanArr[y].TravelCost <= upperBudget) {
                            tripArray.push(trip)
                        }


                    }
                }

                res.send(tripArray);


            }).catch((err) => {
                throw Error(err)
            })



    }
    else if (searchByBudget && searchByDuration) {
        console.log("Search with  Budget and Dur");

        var tripArray = new Array();

        PackageModel.find({
            $and: [
                { PackageDuration: { $gte: from } },
                { PackageDuration: { $lte: to } }
            ]
        })
            .then((docs) => {
                console.log(docs)

                for (var x = 0; x < docs.length; x++) {

                    var travelPlanArr = docs[x].TravelPlans;
                    console.log(travelPlanArr)
                    for (var y = 0; y < travelPlanArr.length; y++) {

                        var trip = new Trip(docs[x].Destination, travelPlanArr[y].TravelPartnerWebsite, travelPlanArr[y].TravelCost,
                            travelPlanArr[y].TravelPartnerName, travelPlanArr[y].TravelPartnerContactNumber, docs[x].PackageDuration)

                        if (travelPlanArr[y].TravelCost >= lowerBudget && travelPlanArr[y].TravelCost <= upperBudget) {
                            tripArray.push(trip)
                        }


                    }
                }

                res.send(tripArray);


            }).catch((err) => {
                throw Error(err)
            })


    }
    else if (searchByDuration && searchByDest) {
        console.log("Search with Duration  and Destination ");


        var tripArray = new Array();

        PackageModel.find({
            $and: [
                { Destination: { $regex: new RegExp("^" + dest.toLowerCase(), "i") } },
                { PackageDuration: { $gte: from } },
                { PackageDuration: { $lte: to } }
            ]
        })
            .then((docs) => {
                console.log(docs)

                for (var x = 0; x < docs.length; x++) {

                    var travelPlanArr = docs[x].TravelPlans;
                    console.log(travelPlanArr)
                    for (var y = 0; y < travelPlanArr.length; y++) {

                        var trip = new Trip(docs[x].Destination, travelPlanArr[y].TravelPartnerWebsite, travelPlanArr[y].TravelCost,
                            travelPlanArr[y].TravelPartnerName, travelPlanArr[y].TravelPartnerContactNumber, docs[x].PackageDuration)

                        tripArray.push(trip)


                    }
                }

                res.send(tripArray);


            }).catch((err) => {
                throw Error(err)
            })
    }
    else if (searchByDest) {
        console.log("search with Destination")



        var tripArray = new Array();

        PackageModel.find({

            Destination: { $regex: new RegExp("^" + dest.toLowerCase(), "i") },


        })
            .then((docs) => {
                console.log(docs)

                for (var x = 0; x < docs.length; x++) {

                    var travelPlanArr = docs[x].TravelPlans;
                    console.log(travelPlanArr)
                    for (var y = 0; y < travelPlanArr.length; y++) {

                        var trip = new Trip(docs[x].Destination, travelPlanArr[y].TravelPartnerWebsite, travelPlanArr[y].TravelCost,
                            travelPlanArr[y].TravelPartnerName, travelPlanArr[y].TravelPartnerContactNumber, docs[x].PackageDuration)

                        tripArray.push(trip)


                    }
                }

                res.send(tripArray);


            }).catch((err) => {
                throw Error(err)
            })
    }
    else if (searchByBudget) {
        var tripArray = new Array();

        PackageModel.find({})
            .then((docs) => {
                console.log(docs)

                for (var x = 0; x < docs.length; x++) {

                    var travelPlanArr = docs[x].TravelPlans;
                    console.log(travelPlanArr)
                    for (var y = 0; y < travelPlanArr.length; y++) {

                        var trip = new Trip(docs[x].Destination, travelPlanArr[y].TravelPartnerWebsite, travelPlanArr[y].TravelCost,
                            travelPlanArr[y].TravelPartnerName, travelPlanArr[y].TravelPartnerContactNumber, docs[x].PackageDuration)

                        if (travelPlanArr[y].TravelCost >= lowerBudget && travelPlanArr[y].TravelCost <= upperBudget) {
                            tripArray.push(trip)
                        }


                    }
                }

                res.send(tripArray);


            }).catch((err) => {
                throw Error(err)
            })

    }
    else if (searchByDuration) {
        console.log("search with Duration")
        var tripArray = new Array();

        PackageModel.find({
            $and: [
                { PackageDuration: { $gte: from } },
                { PackageDuration: { $lte: to } }
            ]
        })
            .then((docs) => {
                console.log(docs)

                for (var x = 0; x < docs.length; x++) {

                    var travelPlanArr = docs[x].TravelPlans;
                    console.log(travelPlanArr)
                    for (var y = 0; y < travelPlanArr.length; y++) {

                        var trip = new Trip(docs[x].Destination, travelPlanArr[y].TravelPartnerWebsite, travelPlanArr[y].TravelCost,
                            travelPlanArr[y].TravelPartnerName, travelPlanArr[y].TravelPartnerContactNumber, docs[x].PackageDuration)

                        tripArray.push(trip)


                    }
                }

                res.send(tripArray);


            }).catch((err) => {
                throw Error(err)
            })

    }


})


module.exports = router;