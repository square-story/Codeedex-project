import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

const login = async (email: string) => {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password: 'password123'
    });
    return res.data.token;
};

const verify = async () => {
    try {
        console.log('🔄 Logging in as Admin...');
        const adminToken = await login('admin@example.com');
        const authHeaders = { headers: { Authorization: `Bearer ${adminToken}` } };

        // 1. Create a new Role (Should trigger ROLE_CREATED)
        console.log('🔄 Creating new Role "Auditor"...');
        const roleRes = await axios.post(`${BASE_URL}/roles`, {
            name: 'Auditor',
            permissions: [{ permissionKey: 'audit:read', scope: 'global' }]
        }, authHeaders);
        console.log('✅ Role Created');

        // 2. Create a new User (Should trigger USER_CREATED)
        console.log('🔄 Creating new User "auditor@example.com"...');
        const auditorRole = roleRes.data.data.role;

        // Get Team ID (Admin's team)
        const adminUserRes = await axios.get(`${BASE_URL}/auth/me`, authHeaders);
        const engineeringTeamId = adminUserRes.data.data.user.teamId;

        await axios.post(`${BASE_URL}/users`, {
            email: 'auditor@example.com',
            password: 'password123',
            teamId: engineeringTeamId,
            roles: [auditorRole._id]
        }, authHeaders);
        console.log('✅ User Created');

        // 3. Fetch Audit Logs
        console.log('🔄 Fetching Audit Logs...');
        const logsRes = await axios.get(`${BASE_URL}/audit-logs`, authHeaders);
        const logs = logsRes.data.data.logs;

        console.log(`✅ Logs Retrieved: ${logs.length}`);

        const roleLog = logs.find((l: any) => l.action === 'ROLE_CREATED' && l.details.name === 'Auditor');
        const userLog = logs.find((l: any) => l.action === 'USER_CREATED' && l.details.email === 'auditor@example.com');

        if (roleLog) console.log('✅ Found ROLE_CREATED log');
        else console.error('❌ Missing ROLE_CREATED log');

        if (userLog) console.log('✅ Found USER_CREATED log');
        else console.error('❌ Missing USER_CREATED log');

    } catch (error: any) {
        console.error('❌ Verification Failed:', error.message);
        if (error.response) {
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        }
    }
};

verify();
