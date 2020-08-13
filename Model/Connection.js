const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://shuvo:shuvo@mongo@cluster0-msk3d.mongodb.net/tps?retryWrites=true&w=majority',
    { useNewUrlParser: true,useUnifiedTopology: true }).then((con)=>{
        console.log('Connection established successfully')
    }).catch((err)=>{
        console.log('Error Establishing connection to DB'+err)
    })


const UserModel = require('./UserModel');
const PackageModel = require('./PackageModel');
const PackageStaggingModel = require('./PackageStagingModel');

