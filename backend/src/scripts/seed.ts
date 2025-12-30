import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { Team } from '../models/Team';
import { Role } from '../models/Role';
import { User } from '../models/User';
import { AuditLog } from '../models/AuditLog';
import { PERMISSIONS, SCOPES } from '../permissions/constants';

const seed = async () => {
    console.log('🌱 Starting Database Seeding...');
    await connectDB();

    try {
        // Clean up
        await Team.deleteMany({});
        await Role.deleteMany({});
        await User.deleteMany({});

        // Cleanup Audit Logs (Direct MongoDB access for system collection)
        if (mongoose.connection.db) {
            await mongoose.connection.db.collection('auditlogs').deleteMany({});
        }

        console.log('🧹 Cleaned existing data');

        // 1. Create Teams
        const engineeringTeam = await Team.create({ name: 'Engineering' });
        const marketingTeam = await Team.create({ name: 'Marketing' });
        console.log('✅ Teams Created');

        // 2. Create Roles
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
                { permissionKey: PERMISSIONS.AUDIT_READ, scope: SCOPES.GLOBAL },
                { permissionKey: PERMISSIONS.TEAMS_READ, scope: SCOPES.GLOBAL },
                { permissionKey: PERMISSIONS.TEAMS_CREATE, scope: SCOPES.GLOBAL },
            ],
        });

        const managerRole = await Role.create({
            name: 'Manager',
            permissions: [
                { permissionKey: PERMISSIONS.USERS_READ, scope: SCOPES.TEAM },
                { permissionKey: PERMISSIONS.USERS_UPDATE, scope: SCOPES.TEAM },
            ],
        });

        const employeeRole = await Role.create({
            name: 'Employee',
            permissions: [
                { permissionKey: PERMISSIONS.USERS_READ, scope: SCOPES.SELF },
            ],
        });
        console.log('✅ Roles Created');

        // 3. Create Users
        const password = 'password123'; // User model pre-save hook handles hashing

        // Admin User
        await User.create({
            email: 'admin@example.com',
            passwordHash: password,
            roles: [adminRole._id],
            teamId: engineeringTeam._id,
        });

        // Team Manager
        await User.create({
            email: 'manager@example.com',
            passwordHash: password,
            roles: [managerRole._id],
            teamId: engineeringTeam._id,
        });

        // Team Employees
        await User.create({
            email: 'dev1@example.com',
            passwordHash: password,
            roles: [employeeRole._id],
            teamId: engineeringTeam._id,
        });

        await User.create({
            email: 'marketer1@example.com',
            passwordHash: password,
            roles: [employeeRole._id],
            teamId: marketingTeam._id,
        });

        console.log('✅ Example Users Created');

        // 4. Initial Audit Entry
        const systemAdmin = await User.findOne({ email: 'admin@example.com' });
        await AuditLog.create({
            action: 'SYSTEM_INIT',
            performedBy: systemAdmin?._id,
            targetResource: 'system',
            details: { message: 'Database seeded with professional default states' },
        });
        console.log('✅ Audit Logs Initialized');

        console.log('⭐ Seeding Completed Successfully!');
    } catch (error) {
        console.error('❌ Seeding Failed:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

seed();
