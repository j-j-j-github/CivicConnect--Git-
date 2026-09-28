const { Client } = require('pg');
require('dotenv').config();

async function check() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  
  const res = await client.query(`
    SELECT d.name as dept_name, count(c.id) as complaint_count
    FROM "Department" d
    LEFT JOIN "Complaint" c ON c.department_id = d.id
    GROUP BY d.name
    ORDER BY d.name
  `);
  
  console.log("=== COMPLAINTS PER DEPARTMENT ===");
  res.rows.forEach(r => console.log(`- ${r.dept_name}: ${r.complaint_count} complaints`));
  
  await client.end();
}
check().catch(console.error);
