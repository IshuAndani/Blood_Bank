const mongoose = require('mongoose');

const shortageSchema = new mongoose.Schema({
    bloodBank: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'BloodBank', 
        required: true 
    },
    bloodGroup: { 
        type: String, 
        required: true,
        enum : {
            values : ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            message : '{VALUE} is not a valid blood group'
        }
    },
    donorsNotified: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Donor' 
        }
    ],
    resolved: { 
        type: Boolean, 
        default: false 
    },
}, {timestamps: true});

module.exports = mongoose.model('Shortage', shortageSchema);
