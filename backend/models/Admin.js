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
        enum: ["superadmin", "admin", "headadmin", "observer"],
        required: true
    },
    // Store references to a single workspace (BloodBank or Hospital)
    workplace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BloodBank', 
        required: function() {
            return this.role !== 'superadmin';// Only require workplace if the role is not superadmin
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