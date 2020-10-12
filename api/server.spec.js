// intergration tests - different from the unit tests ( these test just a small part of your code)
//  while intergration tests will be testing how different parts of the system work in tandem
// end-to-end tests 

// 3 libraries in particular:
// 1. jest
// 2. supertest - http assertions library
// 3. cross-env - npm module that lets us us deal with OS inconsistencies
// provides a uniform away of setting env variables across ALL OSes
// since setting & using env variables is defferent across OSes

// you can avoid polluting the development database by using a SEPARATE 
// database for testing!

const request = require('supertest');
const server = require('./server');
const db = require('../database/dbConfig.js');
const { expectCt } = require('helmet');
const testUser = { username: 'testing', password: "testing"};

describe("server.js", () => {
    describe("GET request for weather", () => {
        it("should return a status code of 400 when not logged in", async () => {
            const res = await request(server).get("/api/weather");
            expect(res.status).toBe(400);
        });
        it("should return json", async () => {
            const res = await request(server).get("/api/weather");
            expect(res.type).toBe("application/json")
        });
    });
    describe("registering new user", () => {
        it("should return with a status code of 201 when adding new user", async () => {
            await db("users").truncate() // clearing the tables
            const res = await request(server)
            .post("/api/auth/register")
            .send(testUser);
            expect(res.status).toBe(201)
        });
        it("should return a status of 500 with an invalid user", async () => {
            const res = await request(server)
            .post("/api/auth/register")
            .send({ user: "test", pass: "test" });
            expect(res.status).toBe(500);
        });
    });
    describe("login with user", () => {
        it("should return a status code of 200 with test user", async () => {
            const res = await request(server)
            .post("/api/auth/login")
            .send(testUser);
            expect(res.status).toBe(200)
        });
        it("should return a status code of 401 when given a non-valid user", async () => {
            const res = await request(server)
            .post("/api/auth/login")
            .send({ username: "does not exist", password: "does not exist" })
            expect(res.status).toBe(401)
        })
    })
})