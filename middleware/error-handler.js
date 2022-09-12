const { StatusCodes, getReasonPhrase } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {



  const customError = {
    statusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
  }

  if (err.name === 'CastError') {
    customError.msg = `No Item found with id: ${err.value}`
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors).map(field => field.message).join(',')
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  if (err.code || err.code === 11000) {
    customError.msg = `Duplicate value for ${Object.keys(err.keyValue)} field, please choose another one`
    customError.statusCode = StatusCodes.BAD_REQUEST
  }
   res.status(customError.statusCode).json({ msg: customError.msg })
//  res.status(customError.statusCode).json({ err })
}

module.exports = errorHandlerMiddleware
