import "dotenv/config";

import connectDB from "../config/db.js";
import seedAdmin from "./admin.seed.js";

const runSeeder = async () => {
  try {
    await connectDB();

    console.log("🌱 Seeder started...");

    await seedAdmin();

    console.log("🌱 Seeder completed successfully");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeder failed:", error.message);

    process.exit(1);
  }
};

runSeeder();