const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors/index')
const bcrypt = require('bcrypt')

exports.register = async (req,res,next) => {

    // Validate - name, email, password - with Mongoose
    const user = await User.create({...req.body})    
    // Send Response with Token
    res.status(StatusCodes.CREATED).json({user: {name:user.name},token: user.createJWT() })
}


exports.login = async (req,res,next) => {
    
    const { email, password } = req.body

    if (!email || !password) throw new UnauthenticatedError('Please provide email and password')

    // query db using email
    const user = await User.findOne({email: email})

    if (!user) throw new UnauthenticatedError('Invalid Credentials')

    const isMatch = await user.checkPassword(password)
    if (!isMatch) throw new UnauthenticatedError('Invalid Credentials')

    res.status(StatusCodes.CREATED).json({user: {name:user.name},token: user.createJWT() })
}