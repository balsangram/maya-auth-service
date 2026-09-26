import Admin from "../models/admin.model.js";
import { hashPassword } from "../utils/password.js";

const seedAdmin = async () => {
  try {
    const email = "admin@gmail.com";

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists");
      return existingAdmin;
    }

    // Hash password
    const hashedPassword = await hashPassword("Admin@123");

    // Create admin
    const admin = await Admin.create({
      name: "Admin",
      email,
      password: hashedPassword,
      image: null,
      phone: "9876543210",
      isActive: true,
      isVerified: true,
    });

    console.log("Admin created successfully:", admin.email);

    return admin;
  } catch (error) {
    console.error("Admin seed failed:", error.message);
    throw error;
  }
};

export default seedAdmin;