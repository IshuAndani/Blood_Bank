const request = require('supertest');
const app = require('../../../app'); 

describe('Donor Registeration', () => {
  it('registers a donor successfully', async () => {
    const res = await request(app)
      .post('/api/public/donor/register')
      .send({
        name: 'Test Donor',
        email: 'testdonor@example.com',
        password: 'test1234',
        bloodGroup: 'B+',
        city: 'Bhopal',
        dob : new Date(Date.now() - 19*365*24*60*60*1000)
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });
  it('fails if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/public/donor/register')
      .send({
        email: 'incomplete@example.com',
        password: 'test1234',
      });
  
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('All fields are required');
  });
  it('fails with invalid email format', async () => {
    const res = await request(app)
      .post('/api/public/donor/register')
      .send({
        name: 'Invalid Email',
        email: 'invalidemail',
        password: 'test1234',
        bloodGroup: 'A+',
        city: 'Bhopal',
        dob: new Date(Date.now() - 20 * 365 * 24 * 60 * 60 * 1000)
      });
  
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Invalid email format');
  });
  it('fails with invalid blood group', async () => {
    const res = await request(app)
      .post('/api/public/donor/register')
      .send({
        name: 'Wrong Blood',
        email: 'wrongblood@example.com',
        password: 'test1234',
        bloodGroup: 'Z+', // Invalid
        city: 'Ujjain',
        dob: new Date(Date.now() - 20 * 365 * 24 * 60 * 60 * 1000)
      });
  
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('is not a valid blood group');
  });
  it('fails if city is not in allowed list', async () => {
    const res = await request(app)
      .post('/api/public/donor/register')
      .send({
        name: 'Outsider',
        email: 'outsider@example.com',
        password: 'test1234',
        bloodGroup: 'A+',
        city: 'Gotham', // Not in ALLOWED_CITIES
        dob: new Date(Date.now() - 20 * 365 * 24 * 60 * 60 * 1000)
      });
  
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('We are not operational in Gotham yet');
  });
  it('fails if donor is under 18', async () => {
    const res = await request(app)
      .post('/api/public/donor/register')
      .send({
        name: 'Young Blood',
        email: 'youngblood@example.com',
        password: 'test1234',
        bloodGroup: 'O+',
        city: 'Gwalior',
        dob: new Date(Date.now() - 15 * 365 * 24 * 60 * 60 * 1000) // 15 years old
      });
  
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Donor must be at least 18 years old');
  });
  it('fails if donor email already exists', async () => {
    // First registration
    await request(app)
      .post('/api/public/donor/register')
      .send({
        name: 'First User',
        email: 'duplicate@example.com',
        password: 'test1234',
        bloodGroup: 'A+',
        city: 'Bhopal',
        dob: new Date(Date.now() - 20 * 365 * 24 * 60 * 60 * 1000)
      });
  
    // Second registration with same email
    const res = await request(app)
      .post('/api/public/donor/register')
      .send({
        name: 'Second User',
        email: 'duplicate@example.com',
        password: 'test5678',
        bloodGroup: 'B+',
        city: 'Indore',
        dob: new Date(Date.now() - 22 * 365 * 24 * 60 * 60 * 1000)
      });
  
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Donor with this email already exists');
  });
  
});
