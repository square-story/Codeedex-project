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

        // 1. Create a new Role
        console.log('🔄 Creating new Role "Designer"...');
        const roleRes = await axios.post(`${BASE_URL}/roles`, {
            name: 'Designer',
            permissions: [{ permissionKey: 'users:read', scope: 'self' }]
        }, authHeaders);
        const designerRole = roleRes.data.data.role;
        console.log('✅ Role Created:', designerRole.name);

        // 2. Create a new User
        console.log('🔄 Creating new User "designer@example.com"...');
        // Need a team ID first - getting engineering team from seed admin
        const adminUserRes = await axios.get(`${BASE_URL}/auth/me`, authHeaders);
        const engineeringTeamId = adminUserRes.data.data.user.teamId;

        const userRes = await axios.post(`${BASE_URL}/users`, {
            email: 'designer@example.com',
            password: 'password123',
            teamId: engineeringTeamId,
            roles: [designerRole._id]
        }, authHeaders);
        const createdUser = userRes.data.data.user;
        console.log('✅ User Created:', createdUser.email);
        console.log('✅ User Roles:', createdUser.roles);

        // 3. Verify Admin Access (Roles API)
        console.log('🔄 Verifying Roles List...');
        const rolesListRes = await axios.get(`${BASE_URL}/roles`, authHeaders);
        console.log('✅ Roles Count:', rolesListRes.data.data.roles.length);

    } catch (error: any) {
        console.error('❌ Verification Failed:', error.message);
        if (error.response) {
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        }
    }
};
verify();
