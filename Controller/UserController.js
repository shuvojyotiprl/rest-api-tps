const express = require('express');
const userModel = require('../Model/Connection');
const mongoose = require('mongoose');
const auth = require('../middleware/auth')
var multer = require('multer')
const sharp = require('sharp');


const UserModel = mongoose.model('UserTps');

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const user = await UserModel.findByCredentials(req.body.email, req.body.password)
        const jwt = await user.generateAuthToken()

        res.send({ user: await user.publicProfile(), jwt })
    }
    catch (er) {
        console.log("Error " + er)
        res.status(400).send({ error: er.toString() })
    }

}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((t) => {
            return t.token !== req.token
        })

        await req.user.save()
        res.status(200).send({
            data: req.user._id + '  logged out successfully   '
        })
    }
    catch (e) {
        res.status(500).send({ error: e.toString() })
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})




router.post('/logout/all', auth, async (req, res) => {
    try {
        req.user.tokens = []

        await req.user.save()
        res.status(200).send({
            data: req.user._id + '  logged out successfully from all devices '
        })
    }
    catch (e) {
        res.status(500).send({ error: e.toString() })
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


router.get('/listuser/me', auth, async (req, res) => {
    res.send(await req.user.publicProfile())

}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


router.post('/adduser', async (req, res) => {
    const user = new UserModel(req.body)
    try {

        const exist_user = await UserModel.findOne({ email: req.body.email })
        console.log(exist_user)
        if (exist_user != null) {
            throw Error('Email already taken')
        }

        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user: await user.publicProfile(), token })
    }
    catch (e) {
        res.status(400).send({ error: e.toString() })
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


const uploads = multer({
    // dest:'profile_pics',
    limits: {
        fieldSize: 1000000
    },
    fileFilter(req, file, cb) {
        console.log('File filter will be processed before processing the file')
        if (!file.originalname.endsWith('.jpeg')) {
            return cb(new Error('Upload jpeg file'))
        }

        cb(undefined, true)
    }
})

router.post('/listuser/me/avatar',auth, uploads.single('avatar'), async(req, res) => {
    console.log('**upload inf0 --  profile picture**')
    console.log(req.file.buffer)

    const buffer = await sharp(req.file.buffer).resize(
        {width:250,height:250}
    ).png().toBuffer()

    req.user.avatar = buffer
    await req.user.save()
    res.send({ data: 'Profile picture uploaded successfully' })
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.get('/listuser/me/avatar',auth, uploads.single('avatar'), async(req, res) => {
    res.set('Content-Type','image/png')
    res.send(req.user.avatar)
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})
/* router.post('/adduser', (req, res) => {
    var user = new UserModel();
    user.name = req.body.name
    user.email = req.body.email
    user.mobile = req.body.mobile
    user.age = req.body.age
    user.gender = req.body.gender
    user.password = req.body.password


    UserModel.findOne({ email: req.body.email }).exec((err, rec) => {
        if (err) throw err;

        if (rec != null) {
            console.log('duplicate email id ' + rec.email);
            res.status(400)
            res.send({
                "message": "this email id is already taken"
            });
        }
        else {
            user.save().then((result) => {
                console.log(result);
                res.status(200);
                res.send({
                    "message": "user created successfully",
                    "id": result._id
                });
            }).catch((err) => {
                console.log(err);
                res.status(406);
                res.send(
                    {
                        "message": "error occured processing req",
                        "error": err
                    }
                )
            })

        }
    });

}); */

module.exports = router;
