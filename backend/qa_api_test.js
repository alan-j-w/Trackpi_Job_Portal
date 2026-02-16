
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';
// Use a random timestamp to ensure unique email
const timestamp = Date.now();
const user = {
    name: 'QA User',
    email: `qa_${timestamp}@test.com`,
    password: 'password123'
};

let token = '';

async function runTest() {
    console.log('🚀 Starting QA API Test...');

    try {
        // 1. Register
        console.log('1. Registering User...');
        try {
            const regRes = await axios.post(`${API_URL}/auth/register`, user);
            console.log('✅ Registration Successful:', regRes.data.message);
        } catch (e) {
            console.error('❌ Registration Failed:', e.response?.data || e.message);
            // If user already exists (unlikely with timestamp), try login
            if (e.response?.status === 400 && e.response?.data?.message === "User already exists") {
                console.log('User exists, proceeding to login...');
            } else {
                throw e;
            }
        }

        // 2. Login
        console.log('2. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: user.email,
            password: user.password
        });
        token = loginRes.data.token;
        console.log('✅ Login Successful. Token received.');


        // 3. Submit Profile
        console.log('3. Submitting Profile (Simulating CreateProfile.jsx)...');
        const profilePayload = {
            fullName: user.name,
            phone: '9876543210',
            altPhone: '9876543211',
            email: user.email,
            country: 'India',
            state: 'Kerala',
            city: 'Kochi',
            pincode: '682001',
            dob: '1995-01-01',
            gender: 'Male',
            maritalStatus: 'Single',
            workStatus: 'Experienced',
            // Structure matches what frontend sends
            education: [
                {
                    degree: 'Bachelor',
                    institution: 'Test University',
                    year: '2016',
                    domain: 'Computer Science',
                    description: 'B.Tech (Full time)'
                }
            ],
            workExperience: [
                {
                    jobTitle: 'Software Engineer',
                    company: 'Tech Corp',
                    startDate: '2017-01-01',
                    endDate: '2020-01-01',
                    description: 'Worked on backend'
                }
            ],
            skills: ['Node.js', 'React', 'MongoDB'],
            languages: [{ name: 'English', proficiency: 'Fluent', read: true, write: true, speak: true }],
            preferredLocations: ['Kochi', 'Bangalore'],
            willRelocate: true,
            preferredWorkMode: 'remote',
            expectedSalary: '1000000',
            isFinalSubmission: true
        };

        const profileRes = await axios.post(`${API_URL}/profile`, profilePayload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Profile Submission Successful:', profileRes.data.message);
        if (profileRes.data.profile) {
            console.log('   Profile ID:', profileRes.data.profile._id);
        }

        // 4. Verify Profile
        console.log('4. Verifying Profile Data...');
        const meRes = await axios.get(`${API_URL}/profile/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const p = meRes.data.profile;

        let errors = [];
        if (p.fullName !== profilePayload.fullName) errors.push(`Name mismatch: expected ${profilePayload.fullName}, got ${p.fullName}`);

        // Check nested location
        if (p.location?.country !== profilePayload.country) errors.push(`Country mismatch`);
        if (p.location?.city !== profilePayload.city) errors.push(`City mismatch`);

        // Arrays might perform full match or length match
        if (p.education.length !== 1) errors.push(`Education length mismatch: expected 1, got ${p.education.length}`);
        if (p.workExperience.length !== 1) errors.push(`Experience length mismatch: expected 1, got ${p.workExperience.length}`);
        if (p.skills.length !== 3) errors.push(`Skills length mismatch: expected 3, got ${p.skills.length}`);

        if (errors.length === 0) {
            console.log('✅ Data Verification Passed! All fields match.');
        } else {
            console.error('❌ Data Verification Failed:');
            errors.forEach(e => console.error('   -', e));
        }

    } catch (err) {
        console.error('❌ Unexpected Error during test:', err.message);
        if (err.response) {
            console.error('   Status:', err.response.status);
            console.error('   Data:', JSON.stringify(err.response.data, null, 2));
        }
    }
}

runTest();
