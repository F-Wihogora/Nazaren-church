import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdminUser extends Document {
  email: string;
  password: string;
  name: string;
  role: "admin" | "superadmin";
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

// Define schema
const AdminUserSchema: Schema<IAdminUser> = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["admin", "superadmin"], default: "admin" },
  },
  { timestamps: true }
);

// Pre-save hook with explicit `this: IAdminUser`
AdminUserSchema.pre("save", async function (this: IAdminUser, next) {
  if (!this.isModified("password")) return next();

  if (!this.password) return next(new Error("Password is missing"));

  try {
    const salt = await bcrypt.genSalt(10);
    // TypeScript now knows this.password is string
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// Compare password method
AdminUserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Export model
export default mongoose.models.AdminUser ||
  mongoose.model<IAdminUser>("AdminUser", AdminUserSchema);
