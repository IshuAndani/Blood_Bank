const app = require("../../../app");
const { Admin } = require("../../../models/Admin")
const request = require('supertest');

describe("Admin Registration API using superadmin", () => {
    const password = "secure123";
    let token;
    let superAdmin;
    let bloodbankId;
    let hospitalId;
    beforeEach(async () => {
        superAdmin = await Admin.create({
            name : "superadmin",
            email : "superadmin@example.com",
            password : password,
            role : "superadmin"
        });
        let res = await request(app).post('/api/auth/login').send({
            email : superAdmin.email,
            password : password
        });
        token = res.body.token;
        
        res = await request(app)
            .post('/api/v1/bloodbank/create')
            .set('Authorization',token)
            .send({
                name : "Bhopal Blood Bank",
                city : "Bhopal"
            }
        );
        bloodbankId = res.body.BloodBank._id;


        res = await request(app)
            .post('/api/v1/hospital/create')
            .set('Authorization',token)
            .send({
                name : "Bhopal Hospital",
                city : "Bhopal"
            }
        );
        hospitalId = res.body.newHospital._id;
        console.log("superadmin : ", superAdmin);
        console.log("token : ",token);
        console.log("bloodbankId = ",bloodbankId);
        console.log("hospitalId = ",hospitalId);
        // await superAdmin.save();
        // console.log("superAdmin =" , superAdmin)
    });

    // it("successfully log in superadmin", async () => {
    //     const res = await request(app).post('/api/auth/login').send({
    //         email : superAdmin.email,
    //         password : password
    //     });
    //     expect(res.statusCode).toBe(200);
    //     expect(res.body.success).toBe(true);
    //     expect(res.body.token).toBeDefined();
    //     expect(res.body.role).toBe('superadmin');
    //     token = res.body.token;
    //     console.log("token = ", token);
    // });

    
    
    // it("should successfully create a bloodbank", async() => {
    //     console.log(await Admin.findById(superAdmin._id));
    //     const 
    //     expect(res.statusCode).toBe(201);
    //     expect(res.body.success).toBe(true);
        
    // });

    
    // it("should successfully create a hospital", async() => {
    //     const 
    //     expect(res.statusCode).toBe(201);
    //     expect(res.body.success).toBe(true);
        
    // });
    
    let hospitalHeadAdmin;
    it("should succesfully register new headadmin for hospital", async () => {
        const res = await request(app).post('/api/auth/register').set('Authorization',token).send({
            name : "hospitalHeadAdmin",
            email : "hospitalHeadAdmin@example.com",
            role : "headadmin",
            workplaceType : "Hospital",
            workplaceId : hospitalId
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        hospitalHeadAdmin = res.body.admin;
    });

    let bloodbankHeadAdmin;
    it("should succesfully register new headadmin for bloodbank", async () => {
        const res = await request(app).post('/api/auth/register').set('Authorization',token).send({
            name : "bloodbankHeadAdmin",
            email : "bloodbankHeadAdmin@example.com",
            role : "headadmin",
            workplaceType : "BloodBank",
            workplaceId : bloodbankId
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        bloodbankHeadAdmin = res.body.admin;
    });

    let hospitalAdmin1;
    it("should succesfully register new admin for hospital", async () => {
        const res = await request(app).post('/api/auth/register').set('Authorization',token).send({
            name : "hospitalAdmin1",
            email : "hospitalAdmin1@example.com",
            role : "admin",
            workplaceType : "Hospital",
            workplaceId : hospitalId
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        hospitalAdmin1 = res.body.admin;
    });

    let bloodbankAdmin1;
    it("should succesfully register new admin for bloodbank", async () => {
        const res = await request(app).post('/api/auth/register').set('Authorization',token).send({
            name : "bloodbankAdmin1",
            email : "bloodbankAdmin1@example.com",
            role : "admin",
            workplaceType : "BloodBank",
            workplaceId : bloodbankId
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        bloodbankAdmin1 = res.body.admin;
    });

    it("should fail to register superadmin", async () => {
        const res = await request(app).post('/api/auth/register').set('Authorization',token).send({
            name : "superadmin1",
            email : "superadmin1@example.com",
            role : "superadmin",
        });
        expect(res.statusCode).toBe(403);
        expect(res.body.success).toBe(false);
    })
})