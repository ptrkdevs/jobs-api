const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors/index')

exports.getAllJobs = async (req,res,next) => {

    const jobs = await Job.find({createdBy: req.user.userId}).sort('createdAt')

    res.status(StatusCodes.OK).json({jobs: jobs, count: jobs.length})
}


exports.getJob = async (req,res,next) => {
    
    const { id:jobId } = req.params
    const job = await Job.findOne({createdBy: req.user.userId, _id:jobId })

    if (!job) throw new NotFoundError('Job not found')

    res.status(StatusCodes.OK).json({job})

}


exports.createJob = async (req,res,next) => {

    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body) 
    
    res.status(StatusCodes.CREATED).json({job})
}


exports.updateJob = async (req,res,next) => {
    
    const  {
        params:{id:jobId},
        user: {userId},
        body:{company, position}
    } = req

    if (company === '' || position === '') throw new BadRequestError('Company or position fields cannot be empty')

    const job = await Job.findOneAndUpdate({_id: jobId, createdBy: userId},req.body, {
        runValidators: true,
        new:true
    })

    if (!job) throw new NotFoundError(`No job with id ${jobId}`) 

    res.status(StatusCodes.OK).json({job})
}

exports.deleteJob = async (req,res,next) => {
   
    const {user:{userId}, params:{id:jobId}} = req

    const job = await Job.findByIdAndRemove({_id: jobId, createdBy: userId})

    if (!job) throw new NotFoundError(`No job with id ${jobId}`)

    res.status(StatusCodes.OK).json({success:true})
}