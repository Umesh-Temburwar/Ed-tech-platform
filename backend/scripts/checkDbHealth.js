/**
 * Database Schema & Table Health Checker
 * Verifies connectivity and presence of core tables in Supabase
 */
const supabase = require('../config/supabase');

const CORE_TABLES = [
  'profiles',
  'courses',
  'sections',
  'course_lessons',
  'orders',
  'enrollments',
  'notifications',
  'categories',
  'reviews',
];

async function checkDatabaseHealth() {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("EDTECH DATABASE SCHEMA HEALTH CHECK");
  console.log("═══════════════════════════════════════════════════════════════\n");

  let healthyCount = 0;
  let totalCount = CORE_TABLES.length;

  for (const table of CORE_TABLES) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('id', { count: 'exact', head: true });

      if (error) {
        console.warn(`⚠️ Table [${table}]: Not accessible or missing (${error.message})`);
      } else {
        console.log(`✅ Table [${table}]: Healthy (Record count: ${count ?? 0})`);
        healthyCount++;
      }
    } catch (err) {
      console.error(`❌ Table [${table}]: Check exception: ${err.message}`);
    }
  }

  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log(`RESULT: ${healthyCount}/${totalCount} core tables accessible`);
  console.log("═══════════════════════════════════════════════════════════════");
}

if (require.main === module) {
  checkDatabaseHealth()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Health check error:", err);
      process.exit(1);
    });
}

module.exports = { checkDatabaseHealth };
