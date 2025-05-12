const request = require('supertest');
const app = require('../../../app');
// const { Donor } = require('../../models/Donor');

describe('Donor Login', () => {
  let testDonor;

  beforeEach(async () => {
    testDonor = {
      name: 'Login User',
      email: 'loginuser@example.com',
      password: 'testpass123',
      bloodGroup: 'O+',
      city: 'Bhopal',
      dob: new Date(Date.now() - 20 * 365 * 24 * 60 * 60 * 1000)
    };
    await request(app).post('/api/public/donor/register').send(testDonor);
  });

  it('logs in successfully with correct credentials', async () => {
    const res = await request(app)
      .post('/api/public/donor/login')
      .send({
        email: testDonor.email,
        password: testDonor.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toMatch(/^Bearer/);
    // expect(res.body.donorEmail).toBe(testDonor.email);
  });

  it('fails with incorrect password', async () => {
    const res = await request(app)
      .post('/api/public/donor/login')
      .send({
        email: testDonor.email,
        password: 'wrongpassword'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it('fails with unregistered email', async () => {
    const res = await request(app)
      .post('/api/public/donor/login')
      .send({
        email: 'unknown@example.com',
        password: 'whatever123'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it('fails with missing fields', async () => {
    const res = await request(app)
      .post('/api/public/donor/login')
      .send({ email: testDonor.email });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('All fields are required');
  });
});
