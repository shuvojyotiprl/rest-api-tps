

const express = require("express");
var cors = require('cors')
const bodyparser = require("body-parser");

const application = express();

application.use(cors())
application.use(bodyparser.json())
application.use(
    bodyparser.urlencoded({
        extended : true
    })
);



const UserControllerRoute = require('./Controller/UserController');
const PackageControllerRoute = require('./Controller/PackageController');
const TripController = require('./Controller/TripController');
const StagingControllerRoute = require('./Controller/PackageStagingController');


application.use('/user',UserControllerRoute);
application.use('/package',PackageControllerRoute);
application.use('/trip',TripController);
application.use('/staging',StagingControllerRoute);

application.listen('3000',()=>{
    console.log('Server started');
})

