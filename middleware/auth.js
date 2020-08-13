const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
//const User = require('../Model/UserModel')
const UserModel = mongoose.model('UserTps');

const auth = async(req,res,next)=>{
    console.log('auth middleware')

    try{    
        const token  =  req.header('Authorization').replace('Bearer ','')
        //console.log(token)
        const decoded = jwt.verify(token,'secret')
        //console.log(decoded)
        const user = await UserModel.findOne({_id:decoded._id, 'tokens.token':token})
        console.log(user)

        if(!user)
            throw Error()
        
            //set user and token in req properties uon successfule authentication
        req.user = user
        req.token = token
        next()
    }
    catch(e){
        console.log(e)
        res.status(401).send({error:'Please Authenticate. '})
    }
   // next()
}

module.exports = auth  