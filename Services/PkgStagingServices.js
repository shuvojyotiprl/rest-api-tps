require('../Model/Connection');
const mongoose = require('mongoose');

const PackageStaging = mongoose.model('PackageStagingDetails');


module.exports = function () {
    this.fetchMaxId =  () => {
        console.log('fetch max id ')
        return  PackageStaging.findOne({}, { _id: 0, __v: 0 }).sort('-PackageStagingId')
    }

    this.addStagingRecord = (PackageStagingId, Destination, PackageType, PackageDuration, PackageStatus) => {
        var StagingRec = new PackageStaging();
        StagingRec.PackageStagingId = PackageStagingId
        StagingRec.Destination = Destination
        StagingRec.PackageType = PackageType
        StagingRec.PackageDuration = PackageDuration
        StagingRec.PackageStatus = PackageStatus
        StagingRec.TravelPlans = []

        return StagingRec.save();
    }

    this.updateExistingPlanByAgent = ()=>{

    }

    this.postNewPlanByAgent = (PackageStagingId,TravelPartnerName,TravelPartnerWebsite,TravelPartnerContactNumber,TravelCost) => {
        console.log('posting new travel plan');
        var travelPlanInfo = {
            TravelPartnerName:TravelPartnerName,
            TravelPartnerWebsite:TravelPartnerWebsite,
            TravelPartnerContactNumber:TravelPartnerContactNumber,
            TravelCost:TravelCost,
            TravelPlanStatus:"POSTED NEW"
        }
        return PackageStaging.findOneAndUpdate({PackageStagingId:PackageStagingId},
            {"$push":{"TravelPlans":travelPlanInfo}},{upsert: true})

           
    }

    this.getPackageStagingId = (PackageStagingId) => {
        console.log('get staging docs');
        return PackageStaging.findOne({ PackageStagingId: PackageStagingId })
    }

}