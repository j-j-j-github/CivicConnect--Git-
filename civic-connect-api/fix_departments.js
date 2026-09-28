const { Client } = require('pg');
require('dotenv').config();

async function fix() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  
  // Get all departments
  const res = await client.query('SELECT id, name FROM "Department"');
  const depts = res.rows;
  
  const getDeptId = (keyword) => {
    const dept = depts.find(d => d.name.toLowerCase().includes(keyword.toLowerCase()));
    return dept ? dept.id : null;
  };

  const pwdId = getDeptId('pwd') || getDeptId('public');
  const waterId = getDeptId('water');
  const elecId = getDeptId('electricity');
  const healthId = getDeptId('health');

  if (pwdId) {
    await client.query(`UPDATE "User" SET department_id = $1 WHERE email IN ('officer@pwd.gov', 'officer2@pwd.gov')`, [pwdId]);
  }
  if (waterId) {
    await client.query(`UPDATE "User" SET department_id = $1 WHERE email = 'officer@water.gov'`, [waterId]);
  }
  if (elecId) {
    await client.query(`UPDATE "User" SET department_id = $1 WHERE email = 'officer@electricity.gov'`, [elecId]);
  }
  if (healthId) {
    await client.query(`UPDATE "User" SET department_id = $1 WHERE email = 'officer@health.gov'`, [healthId]);
  }
  
  console.log("Departments reassigned for test accounts successfully!");
  
  const finalRes = await client.query(`
    SELECT u.email, d.name as dept_name 
    FROM "User" u 
    JOIN "Department" d ON u.department_id = d.id 
    WHERE u.role = 'OFFICER'
    ORDER BY d.name
  `);
  
  console.log("\n=== UPDATED OFFICER ACCOUNTS ===");
  let currentDept = null;
  for (const row of finalRes.rows) {
    if (row.dept_name !== currentDept) {
      console.log(`\nDepartment: ${row.dept_name}`);
      currentDept = row.dept_name;
    }
    console.log(`  - ${row.email} (Password: password123)`);
  }
  
  await client.end();
}
fix().catch(console.error);
