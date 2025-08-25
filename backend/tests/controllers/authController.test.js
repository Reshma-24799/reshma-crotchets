import { describe, test, expect } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { register, login, forgotPassword } from '../../controllers/authController.js';
import User from "../../models/User.js"
import { validateRegister, validateLogin } from "../../middleware/validation.js"

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.post('/register',validateRegister, register);
app.post("/login", validateLogin, login);
app.post("/forgot-password", forgotPassword)

describe('Auth Controller', () => {
    describe('POST /register', () => {
        test('should register a new user', async () => {
            const userData = {
                name: "Test User3",
                email: "user3@gmail.com",
                password: "Password123"
            };
            const res =  await request(app).post('/register').send(userData);
            expect(res.body.success).toBeTruthy();
            expect(res.body.token).toBeDefined();
            expect(res.body.user.email).toBe(userData.email);
            expect(res.body.user.name).toBe(userData.name);
        });
        test('should not register user with existing email', async () => {
            const userData = {
                name: "Test User4",
                email: "user4@gmail.com",
                password: "Password123"
            };
            await request(app).post('/register').send(userData);
            const userData1 = {
                name: "Test User4",
                email: "user4@gmail.com",
                password: "Password123"
            };
            const res =  await request(app).post('/register').send(userData1);
            expect(res.body.success).toBeFalsy();
            expect(res.body.message).toBe('User already exists with this email');
        });
        test("should not register user with invalid data", async () => {
            const userData = {
                name: "A", // Too short
                email: "invalid-email",
                password: "123", // Too short
            };
            const res = await request(app).post("/register").send(userData).expect(400)
            expect(res.body.success).toBe(false)
            expect(res.body.message).toBe("Validation failed")
        });
    });

    describe('POST /login', () => {
        test('should login an existing user', async () => {
            const userData = {
                name: "Test User4",
                email: "user4@gmail.com",
                password: "Password123"
            };
            await request(app).post('/register').send(userData);
            const res = await request(app).post('/login').send(userData);
            expect(res.body.success).toBeTruthy();
            expect(res.body.token).toBeDefined();   
        
        });
        test('should not login with invalid credentials', async () => {
            const userData = {
                name: "Test User4",
                email: "user4@gmail.com",
                password: "Password123"
            };
            await request(app).post('/register').send(userData);
            const userData1 = {
                name: "Test User4",
                email: "user4@gmail.com",
                password: "Password"
            };
            const res = await request(app).post('/login').send(userData1);
            expect(res.body.success).toBeFalsy();
            expect(res.body.message).toBe("Invalid email or password")
        
        });
    });

    describe("POST /forgot-password", () => {
        test("should initiate password reset for existing user", async () => {
            const userData = {
                name: "Test User4",
                email: "user4@gmail.com",
                password: "Password123"
            };
            let res = await request(app).post('/register').send(userData);
            const response = await request(app).post("/forgot-password").send({ email: "user4@gmail.com" }).expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Password reset email sent");
            const updatedUser = await User.findById(res.body.user.id)
            expect(updatedUser.resetPasswordToken).toBeDefined();
            expect(updatedUser.resetPasswordExpire).toBeDefined();
        });
        test("should return error for non-existing user", async () => {
            const response = await request(app).post("/forgot-password").send({ email: "nonexistent@example.com" }).expect(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("No user found with that email");
        });
     });

});


