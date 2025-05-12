const { ALLOWED_CITIES }= require('../../shared/constants/cities');
const { BLOOD_GROUPS } = require('../../shared/constants/bloodGroups');
const { donorEligibleTime, maxAgeForDonor, minAgeForDonor } = require('../config/constants');

const isValidDOB = (dob) => {
    const date = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    return (
      date instanceof Date &&
      !isNaN(date) &&
      age >= minAgeForDonor &&
      age <= maxAgeForDonor
    );
};

const isValidCity = (city) => {
  return ALLOWED_CITIES.includes(city);
};

const isValidBloodGroup = (bloodGroup) => {
    return BLOOD_GROUPS.includes(bloodGroup);
};

const isNotEligibleToDonate = (lastDonationDate) => {
    if(!lastDonationDate) return false;
    const lastDonation = new Date(lastDonationDate);
    const now = new Date();
    if (now - lastDonation < donorEligibleTime){
        const eligibleDate = new Date(lastDonation);
        eligibleDate.setDate(lastDonation.getDate() + donorEligibleTime / (1000 * 60 * 60 * 24));
        return eligibleDate.toISOString().split('T')[0];
    }
    return false;
}

module.exports = {isValidCity,isValidBloodGroup,isValidDOB, isNotEligibleToDonate};

  