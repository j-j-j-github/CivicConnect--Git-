const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('Starting migration...');
    
    // Add columns to User
    await client.query(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "department_id" TEXT;`);
    console.log('User table updated.');

    // Add columns to Complaint
    await client.query(`ALTER TABLE "Complaint" ADD COLUMN IF NOT EXISTS "assigned_officer_id" TEXT;`);
    await client.query(`ALTER TABLE "Complaint" ADD COLUMN IF NOT EXISTS "resolution_media" TEXT[] DEFAULT ARRAY[]::TEXT[];`);
    await client.query(`ALTER TABLE "Complaint" ADD COLUMN IF NOT EXISTS "resolution_description" TEXT;`);
    await client.query(`ALTER TABLE "Complaint" ADD COLUMN IF NOT EXISTS "resolved_at" TIMESTAMP(3);`);
    
    // Add AI fields
    await client.query(`ALTER TABLE "Complaint" ADD COLUMN IF NOT EXISTS "ai_category" TEXT;`);
    await client.query(`ALTER TABLE "Complaint" ADD COLUMN IF NOT EXISTS "ai_department" TEXT;`);
    await client.query(`ALTER TABLE "Complaint" ADD COLUMN IF NOT EXISTS "ai_priority" TEXT;`);
    await client.query(`ALTER TABLE "Complaint" ADD COLUMN IF NOT EXISTS "ai_confidence" DOUBLE PRECISION;`);
    await client.query(`ALTER TABLE "Complaint" ADD COLUMN IF NOT EXISTS "ai_summary" TEXT;`);
    await client.query(`ALTER TABLE "Complaint" ADD COLUMN IF NOT EXISTS "is_ai_overridden" BOOLEAN NOT NULL DEFAULT false;`);
    await client.query(`ALTER TABLE "Complaint" ADD COLUMN IF NOT EXISTS "override_reason" TEXT;`);
    await client.query(`ALTER TABLE "Complaint" ADD COLUMN IF NOT EXISTS "overridden_at" TIMESTAMP(3);`);
    await client.query(`ALTER TABLE "Complaint" ADD COLUMN IF NOT EXISTS "overriddenById" TEXT;`);
    console.log('Complaint table updated.');

    // Create InternalNote table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "InternalNote" (
          "id" TEXT NOT NULL,
          "note" TEXT NOT NULL,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "complaint_id" TEXT NOT NULL,
          "officer_id" TEXT NOT NULL,

          CONSTRAINT "InternalNote_pkey" PRIMARY KEY ("id")
      );
    `);
    
    // Add Foreign Keys for InternalNote
    await client.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'InternalNote_complaint_id_fkey') THEN
              ALTER TABLE "InternalNote" ADD CONSTRAINT "InternalNote_complaint_id_fkey" FOREIGN KEY ("complaint_id") REFERENCES "Complaint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
          END IF;
      END $$;
    `);
    await client.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'InternalNote_officer_id_fkey') THEN
              ALTER TABLE "InternalNote" ADD CONSTRAINT "InternalNote_officer_id_fkey" FOREIGN KEY ("officer_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
          END IF;
      END $$;
    `);
    console.log('InternalNote table created.');

    // Create ComplaintStatusHistory table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "ComplaintStatusHistory" (
          "id" TEXT NOT NULL,
          "complaintId" TEXT NOT NULL,
          "status" TEXT NOT NULL,
          "note" TEXT,
          "changedById" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

          CONSTRAINT "ComplaintStatusHistory_pkey" PRIMARY KEY ("id")
      );
    `);
    await client.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ComplaintStatusHistory_complaintId_fkey') THEN
              ALTER TABLE "ComplaintStatusHistory" ADD CONSTRAINT "ComplaintStatusHistory_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "Complaint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
          END IF;
      END $$;
    `);
    console.log('ComplaintStatusHistory table created.');

    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
