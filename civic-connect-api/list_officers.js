const { Client } = require('pg');
require('dotenv').config();

async function listOfficers() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const res = await client.query(`
    SELECT u.email, d.name as dept_name 
    FROM "User" u 
    JOIN "Department" d ON u.department_id = d.id 
    WHERE u.role = 'OFFICER'
    ORDER BY d.name
  `);
  
  console.log("=== OFFICER ACCOUNTS BY DEPARTMENT ===");
  let currentDept = null;
  for (const row of res.rows) {
    if (row.dept_name !== currentDept) {
      console.log(`\nDepartment: ${row.dept_name}`);
      currentDept = row.dept_name;
    }
    console.log(`  - ${row.email} (Password: password123)`);
  }
  await client.end();
}
listOfficers().catch(console.error);
