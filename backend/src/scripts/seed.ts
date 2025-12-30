import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { Team } from '../models/Team';
import { Role } from '../models/Role';
import { User } from '../models/User';
import { AuditLog } from '../models/AuditLog';
import bcrypt from 'bcryptjs';

import { PERMISSIONS, SCOPES } from '../permissions/constants';

const seed = async () => {
    await connectDB();

    try {
        // Clean up
        await Team.deleteMany({});
        await Role.deleteMany({});
        await User.deleteMany({});
        // Bypass middleware for cleanup
        if (mongoose.connection.db) {
            await mongoose.connection.db.collection('auditlogs').deleteMany({});
        }

        console.log('🧹 Cleaned DB');

        // Create Team
        const engineeringTeam = await Team.create({ name: 'Engineering' });
        console.log('✅ Team Created:', engineeringTeam.name);

        // Create Role
        const adminRole = await Role.create({
            name: 'Admin',
            permissions: [{ permissionKey: PERMISSIONS.USERS_READ, scope: SCOPES.GLOBAL }],
        });
        console.log('✅ Role Created:', adminRole.name);

        // Create User
        const user = await User.create({
            email: 'admin@example.com',
            passwordHash: 'password123',
            roles: [adminRole._id],
            teamId: engineeringTeam._id,
            directPermissions: [],
        });
        console.log('✅ User Created:', user.email);

        // Create Audit Log
        const log = await AuditLog.create({
            action: 'USER_CREATED',
            performedBy: user._id,
            targetResource: 'system',
            details: { foo: 'bar' },
        });
        console.log('✅ Audit Log Created:', log.action);

        // Verify Audit Log Immutability
        try {
            log.details = { foo: 'baz' };
            await log.save();
        } catch (err: any) {
            console.log('✅ Immutability Check Passed: Update prevented on AuditLog');
        }

    } catch (error) {
        console.error('❌ Error seeding:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

seed();
