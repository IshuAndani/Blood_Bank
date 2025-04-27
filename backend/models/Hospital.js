const mongoose = require('mongoose');
const cleanString = require('../utils/cleanString');

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    city : {
        type : String,
        required : true,
        enum : {
            values : ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain'],
            message : 'We are not operational in {VALUE} yet'  
        }
    },
    admins : {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Admin'
    }
}, {timestamps: true});

hospitalSchema.pre('save', function (next) {
    if (this.name) {
      this.name = cleanString(this.name);
    }
    next();
}, {timestamps: true});

hospitalSchema.index({ location: '2dsphere' }); // for geo-queries

module.exports = mongoose.model('Hospital', hospitalSchema);
