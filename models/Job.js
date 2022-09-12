const { mongoose, Schema } = require('mongoose')


const jobSchema = new Schema({

    company: {
        type: String,
        required: [true, 'Please provide company name']
    },
    position:{
        type:String,
        required: [true, 'Please provide job position']
    },
    status: {
        type: String,
        enum: ['interview', 'declined','pending'],
        default: 'pending'
    },
    createdBy :{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user']
    }
}, {
    timestamps:true
})


module.exports = new mongoose.model('Job', jobSchema)