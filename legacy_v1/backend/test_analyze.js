const jwt = require('jsonwebtoken');

async function test() {
    try {
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@hiresense.ai', password: 'adminpassword123' })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;

        const response = await fetch('http://localhost:5000/api/resumes/analyze', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullName: 'Jane Doe',
                targetRole: 'Software Engineer',
                experience: 'Experienced dev',
                projects: 'A few things',
                skills: 'react node'
            })
        });

        const data = await response.json();
        console.log('STATUS:', response.status);
        console.log('DATA:', data);
    } catch (err) {
        console.error('ERROR:', err);
    }
}

test();
