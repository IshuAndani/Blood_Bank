const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../app');
const { Admin } = require('../../../models/Admin');

describe('Admin Login API', () => {
  const password = 'securepass123';
  let testAdmin;
  beforeEach(async () => {
    testAdmin = await Admin.create({
      name: 'Test Admin',
      email: 'admin@example.com',
      password: password,
      role: 'headadmin',
      workplaceType: 'BloodBank',
      workplaceId: new mongoose.Types.ObjectId()
    });
  });
  
  it('logs in successfully with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testAdmin.email,
        password: password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toMatch(/^Bearer /);
    expect(res.body.role).toBe('headadmin');
  });

  it('returns 401 for wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testAdmin.email,
        password: 'wrongpass'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('returns 401 for non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'notfound@example.com',
        password: 'any'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid credentials');
  });
  it('fails with missing fields', async () => {
    const res = await request(app)
      .post('/api/public/donor/login')
      .send({ email: testAdmin.email });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('All fields are required');
  });
});
