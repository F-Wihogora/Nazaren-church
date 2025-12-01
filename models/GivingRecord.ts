import mongoose, { Schema, Document } from "mongoose";

export type GivingPurpose = "tithe" | "offering" | "donation" | "other";

export interface IGivingRecord extends Document {
  name: string;
  amount: number;
  purpose: GivingPurpose;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GivingRecordSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    purpose: {
      type: String,
      enum: ["tithe", "offering", "donation", "other"],
      required: true,
    },
    date: { type: Date, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.GivingRecord || mongoose.model<IGivingRecord>("GivingRecord", GivingRecordSchema);

