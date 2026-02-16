
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'http://localhost:8000/api';
// Use a random timestamp to ensure unique email
const timestamp = Date.now();
const user = {
    name: 'QA User 2',
    email: `qa_resume_${timestamp}@test.com`,
    password: 'password123'
};

let token = '';

async function runTest() {
    console.log('🚀 Starting QA API Test (Round 2 - With Resume Upload)...');

    try {
        // 1. Register
        console.log('1. Registering User...');
        try {
            const regRes = await axios.post(`${API_URL}/auth/register`, user);
            console.log('✅ Registration Successful:', regRes.data.message);
        } catch (e) {
            console.error('❌ Registration Failed:', e.response?.data || e.message);
            throw e;
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
        console.log('3. Submitting Profile...');
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
            education: [{
                degree: 'Master',
                institution: 'Test University',
                year: '2018',
                domain: 'Data Science',
                description: 'M.Tech'
            }],
            workExperience: [],
            skills: ['Python', 'TensorFlow'],
            languages: [],
            preferredLocations: [],
            willRelocate: false,
            preferredWorkMode: 'onsite',
            expectedSalary: '1500000',
            isFinalSubmission: true
        };

        const profileRes = await axios.post(`${API_URL}/profile`, profilePayload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Profile Submission Successful:', profileRes.data.message);


        // 4. Resume Upload
        console.log('4. Uploading Resume...');
        try {
            const resumePath = path.join(__dirname, 'dummy_resume.txt');
            if (!fs.existsSync(resumePath)) {
                fs.writeFileSync(resumePath, 'Dummy Resume Content');
            }

            const formData = new FormData();
            formData.append('resume', fs.createReadStream(resumePath));

            const resumeRes = await axios.post(`${API_URL}/profile/resume`, formData, {
                headers: {
                    ...formData.getHeaders(),
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('✅ Resume Upload Successful:', resumeRes.status === 200 ? 'OK' : resumeRes.status);

            // Allow DB update time
            await new Promise(r => setTimeout(r, 1000));

        } catch (e) {
            console.error('❌ Resume Upload Failed:', e.response?.data || e.message);
            throw e;
        }

        // 5. Verify Profile & Resume
        console.log('5. Verifying Profile & Resume...');
        const meRes = await axios.get(`${API_URL}/profile/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const p = meRes.data.profile;

        let errors = [];
        if (p.fullName !== profilePayload.fullName) errors.push(`Name mismatch`);
        if (!p.resume) errors.push(`Resume field is empty in DB!`);

        if (errors.length === 0) {
            console.log('✅ Data Verification Passed! Profile created and resume linked.');
        } else {
            console.error('❌ Data Verification Failed:');
            errors.forEach(e => console.error('   -', e));
        }

    } catch (err) {
        console.error('❌ Unexpected Error during test:', err.message);
    }
}

runTest();
