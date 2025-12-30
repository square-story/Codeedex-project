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

        // Create Teams
        const engineeringTeam = await Team.create({ name: 'Engineering' });
        const marketingTeam = await Team.create({ name: 'Marketing' });
        console.log('✅ Teams Created');

        // Create Roles
        const adminRole = await Role.create({
            name: 'Admin',
            permissions: [
                { permissionKey: PERMISSIONS.USERS_READ, scope: SCOPES.GLOBAL },
                { permissionKey: PERMISSIONS.USERS_CREATE, scope: SCOPES.GLOBAL },
                { permissionKey: PERMISSIONS.USERS_UPDATE, scope: SCOPES.GLOBAL },
                { permissionKey: PERMISSIONS.USERS_DELETE, scope: SCOPES.GLOBAL },
                { permissionKey: PERMISSIONS.ROLES_READ, scope: SCOPES.GLOBAL },
                { permissionKey: PERMISSIONS.ROLES_CREATE, scope: SCOPES.GLOBAL },
                { permissionKey: PERMISSIONS.ROLES_UPDATE, scope: SCOPES.GLOBAL },
                { permissionKey: PERMISSIONS.ROLES_DELETE, scope: SCOPES.GLOBAL },
            ],
        });

        const managerRole = await Role.create({
            name: 'Manager',
            permissions: [{ permissionKey: PERMISSIONS.USERS_READ, scope: SCOPES.TEAM }],
        });

        const employeeRole = await Role.create({
            name: 'Employee',
            permissions: [{ permissionKey: PERMISSIONS.USERS_READ, scope: SCOPES.SELF }],
        });
        console.log('✅ Roles Created');

        // Create Users

        // Admin (Engineering)
        await User.create({
            email: 'admin@example.com',
            passwordHash: 'password123',
            roles: [adminRole._id],
            teamId: engineeringTeam._id,
            directPermissions: [],
        });

        // Manager (Engineering)
        await User.create({
            email: 'manager@example.com',
            passwordHash: 'password123',
            roles: [managerRole._id],
            teamId: engineeringTeam._id,
            directPermissions: [],
        });

        // Employee (Engineering)
        await User.create({
            email: 'employee@example.com',
            passwordHash: 'password123',
            roles: [employeeRole._id],
            teamId: engineeringTeam._id,
            directPermissions: [],
        });

        // Employee (Marketing) - Should not be visible to Engineering Manager
        await User.create({
            email: 'marketer@example.com',
            passwordHash: 'password123',
            roles: [employeeRole._id],
            teamId: marketingTeam._id,
            directPermissions: [],
        });

        console.log('✅ Users Created');

        // Create Audit Log
        await AuditLog.create({
            action: 'SYSTEM_INIT',
            performedBy: (await User.findOne({ email: 'admin@example.com' }))?._id,
            targetResource: 'system',
            details: { init: true },
        });
        console.log('✅ Audit Log Created');

    } catch (error) {
        console.error('❌ Error seeding:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

seed();
