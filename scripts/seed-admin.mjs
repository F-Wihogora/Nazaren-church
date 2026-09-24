/**
 * Seed script — creates an initial admin user.
 * Usage: node scripts/seed-admin.mjs
 *
 * Requires MONGODB_URI in .env.local (or set in env before running).
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";
import { resolve } from "path";

// Read .env.local manually (dotenv not available as a standalone dep in Next.js projects)
try {
  const envPath = resolve(process.cwd(), ".env.local");
  const lines = readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) {
      process.env[key.trim()] = rest.join("=").trim();
    }
  }
} catch {
  // .env.local not found — rely on environment variables already set
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI is not set. Add it to .env.local");
  process.exit(1);
}

const AdminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["admin", "superadmin"], default: "admin" },
  },
  { timestamps: true }
);

const AdminUser =
  mongoose.models.AdminUser || mongoose.model("AdminUser", AdminUserSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅  Connected to MongoDB");

  const existing = await AdminUser.findOne({ email: "admin@nazarene.church" });
  if (existing) {
    console.log("ℹ️   Admin user already exists — skipping.");
    await mongoose.disconnect();
    return;
  }

  const hashed = await bcrypt.hash("Admin@123", 10);
  await AdminUser.create({
    email: "admin@nazarene.church",
    password: hashed,
    name: "Administrator",
    role: "superadmin",
  });

  console.log("✅  Admin user created:");
  console.log("    Email:    admin@nazarene.church");
  console.log("    Password: Admin@123");
  console.log("    ⚠️  Change the password after first login!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
