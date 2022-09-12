require('dotenv').config({path:'../.env'})
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const {UnauthenticatedError} = require('../errors/index')

const authenticationMiddleware = async (req,res,next) => {

    // check for auth header 
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) throw new UnauthenticatedError('Authentication invalid')

    const token = authHeader.split(' ')[1]

    try {
        // decode token
        const payload = jwt.verify(token, process.env.JWT_SECRET)

        req.user = {userId: payload.userId, name: payload.name}
        next()

    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid')
    }
    
}



module.exports = authenticationMiddleware