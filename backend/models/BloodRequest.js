const mongoose = require('mongoose');

const BloodRequestSchema = new mongoose.Schema({
    bloodGroup : {
        type : String,
        required : true,
        enum : {
            values : ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            message : '{VALUE} is not a valid blood group'
        }
    },
    Hospital : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Hospital',
        required : true
    },
    BloodBank : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'BloodBank',
        required : true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        required: true,
        default: 'pending'
    },
    rejectReason : {
        type : String
    }
},{timestamps : true});

exports.BloodRequest = mongoose.model('BloodRequest', BloodRequestSchema);