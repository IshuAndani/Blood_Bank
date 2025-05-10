const { Hospital } = require('../models/Hospital');
const { AppError } = require('../utils/error.handler');

exports.createHospital = async (name, city) => {
  if (!name || !city) {
    throw new AppError('Name and city are required', 400);
  }

  const existingHospital = await Hospital.findOne({ name: name });
  if (existingHospital) {
    throw new AppError('Hospital of this name already exists, pick a different name', 400);
  }

  const newHospital = new Hospital({
    name: name,
    city: city,
    employees: {
      headadmin: [],
      admin: []
    }
  });

  await newHospital.save();
  return newHospital;
};
