import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

const login = async (email: string) => {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password: 'password123'
    });
    return res.data.token;
};

const getUsers = async (token: string) => {
    const res = await axios.get(`${BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

const verify = async () => {
    try {
        console.log('🔄 Logging in...');
        const adminToken = await login('admin@example.com');
        const managerToken = await login('manager@example.com');
        const employeeToken = await login('employee@example.com');

        console.log('🔄 Fetching Users...');

        // Admin (Global) -> Expect 4
        const adminUsers = await getUsers(adminToken);
        console.log(`Admin Users Count: ${adminUsers.count} (Expected: 4)`);
        if (adminUsers.count !== 4) throw new Error('Admin scope failed');

        // Manager (Team: Engineering) -> Expect 3 (Admin, Manager, Employee in Eng)
        // Marketer is in Marketing team, so should be excluded.
        const managerUsers = await getUsers(managerToken);
        console.log(`Manager Users Count: ${managerUsers.count} (Expected: 3)`);
        if (managerUsers.count !== 3) throw new Error('Manager scope failed');

        // Employee (Self) -> Expect 1
        const employeeUsers = await getUsers(employeeToken);
        console.log(`Employee Users Count: ${employeeUsers.count} (Expected: 1)`);
        if (employeeUsers.count !== 1) throw new Error('Employee scope failed');

        console.log('✅ All Scope Verifications Passed');
    } catch (error: any) {
        console.error('❌ Verification Failed:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
        process.exit(1);
    }
};

verify();
