const mongoose = require('mongoose');
var validator = require('validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema(
    {
        name: {
            type: "String"
        },
        email: {
            type: "String",
            validate(data) {
                if (!validator.isEmail(data)) {
                    throw new Error('Invalid Email Id');
                }
            }
        },
        mobile: {
            type: "String"
        },
        age: {
            type: "Number"
        },
        gender: {
            type: "String"
        },
        password: {
            type: "String"
        },
        tokens: [{
            token: {
                type: "String",
                required: true
            }
        }],
        avatar: {
            type : Buffer
        }
    },
    {
        timestamps : true 
    }
)

/**creating method to validate credentials**/
UserSchema.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({ email: email })
    if (!user) {
        throw new Error('This Email id is not registered')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
        throw new Error('Invalid credentials')

    return user


}

UserSchema.methods.publicProfile = async function () {
    const user = this
    const publicUser = user.toObject();

    delete publicUser.password
    delete publicUser.tokens
    delete publicUser.avatar

    return publicUser
}


/**creating method to geenerate jwt credentials**/
UserSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'secret')
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

//hash password before saving
UserSchema.pre('save', async function (next) {
    const user = this
    console.log('Just before saving the user !!')
    if (user.isModified('password')) {
        console.log('Encryption runs')
        user.password = await bcrypt.hash(user.password, 8)
    }
    next();
})


const User = mongoose.model('UserTps', UserSchema);