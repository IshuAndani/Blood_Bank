const mongoose = require('mongoose');
const cleanString = require('../utils/cleanString');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["superadmin", "bankadmin", "hospitaladmin"],
        required: true
    },
    bloodBank: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BloodBank',
        required: function() {
            return this.role === 'bankadmin';
        }
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: function() {
            return this.role === 'hospitaladmin';
        }
    }
}, {timestamps: true});

adminSchema.pre('save', function (next) {
    if (this.name) {
      this.name = cleanString(this.name);
    }
    // Clear irrelevant references based on role
    if (this.role === 'bankadmin') {
        this.hospital = undefined;
    } else if (this.role === 'hospitaladmin') {
        this.bloodBank = undefined;
    } else if (this.role === 'superadmin') {
        this.hospital = undefined;
        this.bloodBank = undefined;
    }
    next();
});

// Static method to find admins by workplace
adminSchema.statics.findByWorkplace = function(workplaceType, workplaceId) {
    if (workplaceType === 'hospital') {
        return this.find({ hospital: workplaceId });
    } else if (workplaceType === 'bloodBank') {
        return this.find({ bloodBank: workplaceId });
    }
    return null;
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;