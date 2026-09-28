const http = require('http');

async function test() {
  const loginRes = await fetch('http://localhost:3001/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'officer@pwd.gov', password: 'password123' })
  });
  const loginData = await loginRes.json();
  const token = loginData.access_token;
  
  const compRes = await fetch('http://localhost:3001/api/v1/complaints', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const compData = await compRes.json();
  console.log(JSON.stringify(compData[0], null, 2));
}

test();
