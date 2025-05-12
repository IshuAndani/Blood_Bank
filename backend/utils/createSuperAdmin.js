const { Admin } = require('../models/Admin');

async function createSuperAdmin() {
  const name = process.env.SUPERADMIN_NAME;
  const email = process.env.SUPERADMIN_EMAIL;
  const password = process.env.SUPERADMIN_PASSWORD;

  if (!name || !email || !password) {
    console.warn("Superadmin ENV variables missing. Skipping superadmin creation.");
    return;
  }

  const exists = await Admin.findOne({ email });
  if (exists) {
    console.log("Superadmin already exists.");
    return;
  }

  const superadmin = new Admin({
    name,
    email,
    password,
    role: 'superadmin'
  });

  await superadmin.save();
  console.log("✅ Superadmin created on server start.");
}

module.exports = { createSuperAdmin };
