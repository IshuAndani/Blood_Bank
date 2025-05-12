const mongoose = require('mongoose');
const { cleanString } = require('../utils/cleanString');
const { hashedPassword } = require('../utils/passwordUtils');

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
        enum: ["superadmin", "admin", "headadmin"],
        required: true
    },
    // Store references to a single workspace (BloodBank or Hospital)
    workplaceType: {
        type: String,
        enum: ['BloodBank', 'Hospital'],
        required: function () {
            return this.role !== 'superadmin';
        }
    },
    workplaceId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'workplaceType',
        required: function () {
            return this.role !== 'superadmin';
        }
    }
}, {timestamps: true});

adminSchema.pre('save', function (next) {
    if (this.name) {
      this.name = cleanString(this.name);
    }
    if (this.email){
        this.email = cleanString(this.email);
    }
    next();
});

adminSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await hashedPassword(this.password);
    }
    next();
});

exports.Admin = mongoose.model('Admin', adminSchema);