const express = require('express');
const router = express.Router();

const StagingServices = require('../Services/PkgStagingServices');
const _StagingServices = new StagingServices();

router.post('/addPackage', async (req, res) => {
    try {
        var rec = await _StagingServices.fetchMaxId()
        if (rec == null) {
            maxId = 9919
        }
        else {
            maxId = rec.PackageStagingId
        }
        try {
            if (req.body.Destination && req.body.PackageType && req.body.PackageDuration
                && req.body.PackageStatus) {

                var document = await _StagingServices.addStagingRecord(parseInt(maxId) + 1,
                    req.body.Destination, req.body.PackageType,
                    req.body.PackageDuration, req.body.PackageStatus)

                res.send({
                    data: "INSERTED",
                    document: document
                })
            }
        }
        catch (err) {
            res.status(500).send({
                err: "Error Processing Request"
            })
        }

    }
    catch (err) {
        console.log(err)
        res.status(500).send({
            err: "Error Processing Request"
        })
    }


})

router.get('/getstagingdetails/:PackageStagingId', async (req, res) => {
    console.log(req.params.PackageStagingId);
    var rec = await _StagingServices.getPackageStagingId(req.params.PackageStagingId);

    if (!rec) {
        res.status(404).send({ data: 'No record found' })
    }
    else {
        res.status(200).send(rec)
    }

})

router.put('/updateStaging/updateExisting/:PackageStagingId/:agentName', async(req,res)=>{
    var PackageStagingId = req.params.PackageStagingId
    var AgentName = req.params.agentName

    var rec = await _StagingServices.getPackageStagingId(req.params.PackageStagingId);

    if (!rec) {
        res.status(404).send({ data: 'No record found' })
    }
    else{
        /****validate if req already present by agent NEW / ADMIN REJECTED STATUS**/
    }

    

})

router.put('/updateStaging/postNewPlan/:PackageStagingId', async (req, res) => {
    console.log(req.params.PackageStagingId);
    var rec = await _StagingServices.getPackageStagingId(req.params.PackageStagingId);

    if (!rec) {
        res.status(404).send({ data: 'No record found' })
    }
    else {
        if (req.body.TravelPartnerName && req.body.TravelPartnerContactNumber && req.body.TravelCost) {
            tpName = req.body.TravelPartnerName
            tpContactNumber = req.body.TravelPartnerContactNumber
            cost = req.body.TravelCost
            var rec = await _StagingServices.postNewPlanByAgent(req.params.PackageStagingId,
                tpName,req.body.TravelPartnerWebsite,cost)
                console.log(rec)
                res.status(200).send({ data: rec })
        }
        else{
            res.status(401).send({ data: 'Invalid request body' })
        }
    }

})

module.exports = router;