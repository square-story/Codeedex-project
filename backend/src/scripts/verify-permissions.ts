import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { resolveUserPermissions } from '../permissions/permission.service';
import { PERMISSIONS, SCOPES } from '../permissions/constants';

const verify = async () => {
    await connectDB();

    try {
        // 1. Verify Seed Admin
        const adminUser = await User.findOne({ email: 'admin@example.com' });
        if (adminUser) {
            console.log('🔍 Resolving Admin Permissions...');
            const permissions = await resolveUserPermissions(adminUser.id);
            console.log('✅ Admin Permissions:', JSON.stringify(permissions, null, 2));
        }

        // 2. Create User with Expired Permission
        // Create Role with expired permission
        const expiredRole = await Role.create({
            name: 'Expired Role',
            permissions: [{
                permissionKey: PERMISSIONS.TEAMS_READ,
                scope: SCOPES.GLOBAL,
                validTill: new Date(Date.now() - 10000) // Expired 10s ago
            }],
        });

        // Create User with this role and a valid direct permission
        const testUser = await User.create({
            email: 'test@example.com',
            passwordHash: 'dummy',
            roles: [expiredRole._id],
            directPermissions: [{
                permissionKey: PERMISSIONS.TEAMS_CREATE,
                scope: SCOPES.SELF,
                validFrom: new Date(Date.now() - 10000) // Valid from 10s ago
            }]
        });

        console.log('🔍 Resolving Test User Permissions...');
        const testPermissions = await resolveUserPermissions(testUser.id);
        console.log('✅ Test User Permissions:', JSON.stringify(testPermissions, null, 2));

        // Check constraints
        const hasExpired = testPermissions.some(p => p.key === PERMISSIONS.TEAMS_READ);
        const hasValid = testPermissions.some(p => p.key === PERMISSIONS.TEAMS_CREATE);

        if (!hasExpired && hasValid) {
            console.log('✅ Verified: Expired permission excluded, Valid permission included.');
        } else {
            console.error('❌ Verification Failed: Logic error in filtering.');
        }

        // Cleanup
        await User.deleteOne({ _id: testUser._id });
        await Role.deleteOne({ _id: expiredRole._id });

    } catch (error) {
        console.error('❌ Error verifying:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

verify();
