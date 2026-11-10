import mongoose, { Schema, Document, Types } from "mongoose";
import type { ChurchDivision } from "@/lib/church-constants";

export interface IFamily extends Document {
  name: string;
  head?: Types.ObjectId;
  members: Types.ObjectId[];
  division?: ChurchDivision;
  address?: string;
  phone?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FamilySchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    head: { type: Schema.Types.ObjectId, ref: "Member" },
    members: [{ type: Schema.Types.ObjectId, ref: "Member" }],
    division: {
      type: String,
      enum: ["Children", "Youth", "Women", "Men", "General"],
      default: "General",
    },
    address: { type: String },
    phone: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Family || mongoose.model<IFamily>("Family", FamilySchema);
