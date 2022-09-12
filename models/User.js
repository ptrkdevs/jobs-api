require('dotenv').config({path:'../.env'})
const { mongoose, Schema } = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minLength: 3,
        maxLength: 50
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'Please provide a valid email'],
        unique: true 
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        min: 6,
        max: 250
    }
})


userSchema.pre('save', async function(next) {

    if (!this.isModified('password')) return next()

    const salt = await bcrypt.genSalt(12)
    
    this.password = await bcrypt.hash(this.password, salt)

})
userSchema.methods.checkPassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.createJWT = function () {
    return jwt.sign({userId: this._id, name: this.name},process.env.JWT_SECRET,{expiresIn: process.env.JWT_LIFETIME})
}



module.exports = mongoose.model('User',userSchema)