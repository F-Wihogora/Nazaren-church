import mongoose, { Schema, Document, Types } from "mongoose";
import type { ChurchDivision } from "@/lib/church-constants";

export type Gender = "Male" | "Female" | "Other";

export interface IMemberRoleAssignment {
  role: string;
  department?: string;
  status: "active" | "inactive";
  assignedAt: Date;
}

export interface IMember extends Document {
  fullName: string;
  gender: Gender;
  phone?: string;
  email?: string;
  address?: string;
  birthday?: Date;
  shareBirthdayWithMembers: boolean;
  dateJoined?: Date;
  baptismStatus: boolean;
  /** Primary label (legacy + quick filters). */
  role: string;
  churchRoles: IMemberRoleAssignment[];
  division: ChurchDivision;
  family?: Types.ObjectId;
  ministries: Types.ObjectId[];
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MemberRoleAssignmentSchema = new Schema(
  {
    role: { type: String, required: true },
    department: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    assignedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const MemberSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    phone: { type: String },
    email: { type: String, index: true },
    address: { type: String },
    birthday: { type: Date },
    shareBirthdayWithMembers: { type: Boolean, default: false },
    dateJoined: { type: Date },
    baptismStatus: { type: Boolean, default: false },
    role: { type: String, default: "Member" },
    churchRoles: { type: [MemberRoleAssignmentSchema], default: [] },
    division: {
      type: String,
      enum: ["Children", "Youth", "Women", "Men", "General"],
      default: "General",
    },
    family: { type: Schema.Types.ObjectId, ref: "Family" },
    ministries: [{ type: Schema.Types.ObjectId, ref: "Ministry" }],
    isActive: { type: Boolean, default: true },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Member || mongoose.model<IMember>("Member", MemberSchema);
