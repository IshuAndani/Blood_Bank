const { Hospital } = require('../models/Hospital');
const { AppError } = require('../utils/error.handler');
const { isValidCity } = require('../utils/validator')

exports.createHospital = async (name, city, coordinates) => {
  if (!name || !city) {
    throw new AppError('Name and city are required', 400);
  }

  if(!isValidCity(city)) throw new AppError('Invalid city', 400);

  const existingHospital = await Hospital.findOne({ name: name });
  if (existingHospital) {
    throw new AppError('Hospital of this name already exists, pick a different name', 400);
  }

  // Validate and destructure coordinates
    const { lat, lng } = coordinates || {};
    if (
      typeof lat !== 'number' || lat < -90 || lat > 90 ||
      typeof lng !== 'number' || lng < -180 || lng > 180
    ) {
      throw new AppError('Invalid coordinates: latitude must be between -90 and 90, longitude between -180 and 180', 400);
    }

  const newHospital = new Hospital({
    name: name,
    city: city,
    employees: {
      headadmin: [],
      admin: []
    },
    location: {
      type: 'Point',
      coordinates: [lng, lat]  // GeoJSON format: [longitude, latitude]
    }
  });

  await newHospital.save();
  return newHospital;
};

exports.getHospitals = async() => {
  return await Hospital.find({});
}
