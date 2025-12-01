import mongoose, { Schema, Document } from "mongoose";

export type MemberRole = "Pastor" | "Elder" | "Usher" | "Choir" | "Media" | "Member" | "Visitor";
export type Gender = "Male" | "Female" | "Other";

export interface IMember extends Document {
  fullName: string;
  gender: Gender;
  phone?: string;
  email?: string;
  birthday?: Date;
  baptismStatus: boolean;
  role: MemberRole;
  ministries: mongoose.Types.ObjectId[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MemberSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    phone: { type: String },
    email: { type: String },
    birthday: { type: Date },
    baptismStatus: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["Pastor", "Elder", "Usher", "Choir", "Media", "Member", "Visitor"],
      default: "Member",
    },
    ministries: [{ type: Schema.Types.ObjectId, ref: "Ministry" }],
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Member || mongoose.model<IMember>("Member", MemberSchema);

