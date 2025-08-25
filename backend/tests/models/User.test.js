import { describe, test, expect, beforeEach } from '@jest/globals';
import User from '../../models/User.js';
import { createTestUser } from '../utils/testHelpers.js';

describe('User Model', () => {
    describe('UserCreation', () => {
        test('should create a user with valid data', async () => {
            const userData = {
                name: "Test User1",
                email: "user1@gmail.com",
                password: "Password123"
            };
            const user = await createTestUser(userData);
            expect(user.name).toBe(userData.name);
            expect(user.email).toBe(userData.email);
            expect(user.role).toBe('customer'); // default role
            expect(user.password).not.toBe(userData.password); 
        });
        test('should not create an user with invalid email', async () => {
            const userData = {
                name: "Test User2",
                email: "user2gmail.com",
                password: "Password123"
            };
            await expect(createTestUser(userData)).rejects.toThrow();
        });
        test('should not create an user with short password', async () => {
            const userData = {
                name: "Test User3",
                email: "user2gmail.com",
                password: "Pass"
            };
            await expect(createTestUser(userData)).rejects.toThrow();
        });
        test('should not create a duplicate user', async() => {
             const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                 password: 'password123'
            };
            const user = await User.create(userData);
            await expect(createTestUser(userData)).rejects.toThrow();
        });
    });
    describe('Password Methods', () => {
        let user;
        beforeEach(async () => {
            user = await createTestUser();
        });
        test('should hash password before saving', async () => {
            expect(user.password).not.toBe('password123');
        });
        test('should compare password correctly', async () => {
            const isMatch = await user.comparePassword('password123');
            expect(isMatch).toBeTruthy();
            const isNotMatch = await user.comparePassword('wrongpassword');
            expect(isNotMatch).toBeFalsy();
        });
        test('should generate password reset token', async () => {
            const resetToken = user.getResetPasswordToken();
            expect(resetToken).toBeDefined();   
            expect(user.resetPasswordToken).toBeDefined();
            expect(user.resetPasswordExpire).toBeDefined();
        });
        test('should generate email verification token', async () => {
            const verificationToken = user.getEmailVerificationToken();
            expect(verificationToken).toBeDefined();   
            expect(user.emailVerificationToken).toBeDefined();
        });
    });
    describe('Address Methods' , () => {
        let user;
        beforeEach(async () => {
            user = await createTestUser();
        });
        test('should add address', async () => {
            const addressData = {
                name: 'John Doe',
                phone: '+48123456789',
                address: '123 Test Street',
                city: 'Warsaw',
                state: 'Mazowieckie',
                country: 'Poland',
                postalCode: '00-001',
                isDefault: true
            };
            await user.addAddress(addressData);
            expect(user.addresses.length).toBe(1);
            expect(user.addresses[0].name).toBe(addressData.name);
            expect(user.addresses[0].isDefault).toBeTruthy();
           
        });
        test('should set only one default address', async () => {
            const addressData1 = {
                name: 'John Doe',
                phone: '+48123456789',
                address: '123 Test Street',
                city: 'Warsaw',
                state: 'Mazowieckie',
                country: 'Poland',
                postalCode: '00-001',
                isDefault: true
            };
            const addressData2 = {
                name: 'Jane Smith',
                phone: '+48987654321',
                address: '456 Another St',
                city: 'Krakow',
                state: 'Malopolskie',
                country: 'Poland',
                postalCode: '30-001',
                isDefault: true
            };
            await user.addAddress(addressData1);
            await user.addAddress(addressData2);
            expect(user.addresses.length).toBe(2);
            const defaultAddresses = user.addresses.filter(addr => addr.isDefault);
            expect(defaultAddresses.length).toBe(1);
            expect(defaultAddresses[0].name).toBe(addressData2.name);
        });
    })
});