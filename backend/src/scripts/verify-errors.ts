import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

const login = async (email: string) => {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password: 'password123'
    });
    return res.data;
};

const verify = async () => {
    try {
        console.log('🔄 Logging in to get token...');
        const loginData = await login('admin@example.com');
        const token = loginData.token;
        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
        const invalidTokenHeaders = { headers: { Authorization: `Bearer invalid.token.here` } };

        console.log('--- TEST 1: Invalid ID (CastError) ---');
        try {
            // Use PUT /users/:id so it hits a route that expects an ID
            await axios.put(`${BASE_URL}/users/invalid-id-format`, {}, authHeaders);
        } catch (error: any) {
            if (error.response?.status === 400 && error.response?.data?.message.startsWith('Invalid')) {
                console.log('✅ Passed: Invalid ID returns 400');
            } else {
                console.error('❌ Failed: Invalid ID', error.response?.data || error.message);
            }
        }

        console.log('--- TEST 2: Invalid Token (JsonWebTokenError) ---');
        try {
            await axios.get(`${BASE_URL}/users`, invalidTokenHeaders);
        } catch (error: any) {
            if (error.response?.status === 401 && error.response?.data?.message.includes('Invalid token')) {
                console.log('✅ Passed: Invalid Token returns 401');
            } else {
                console.error('❌ Failed: Invalid Token', error.response?.data || error.message);
            }
        }

        // Creating a user with duplicate email requires unique email in schema.
        // Assuming User schema has unique: true for email.
        console.log('--- TEST 3: Duplicate Email (MongoError 11000) ---');
        try {
            // Trying to create a user that already exists (admin@example.com)
            await axios.post(`${BASE_URL}/users`, {
                email: 'admin@example.com',
                password: 'password123',
                // Need valid fields for other required checks
                teamId: loginData.data.user.teamId,
                roles: [loginData.data.user.roles[0]]
            }, authHeaders);
        } catch (error: any) {
            if (error.response?.status === 400 && error.response?.data?.message.includes('Duplicate field value')) {
                console.log('✅ Passed: Duplicate Email returns 400');
            } else {
                console.error('❌ Failed: Duplicate Email', error.response?.data || error.message);
            }
        }

    } catch (error: any) {
        console.error('❌ Verification Setup Failed:', error.message);
    }
};

verify();
