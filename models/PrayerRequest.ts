import mongoose, { Schema, Document } from "mongoose";

export interface IPrayerRequest extends Document {
  name?: string;
  email?: string;
  phone?: string;
  request: string;
  isPublic: boolean;
  status: "pending" | "in_progress" | "completed" | "answered" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const PrayerRequestSchema: Schema = new Schema(
  {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    request: { type: String, required: true },
    isPublic: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "answered", "archived"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.PrayerRequest || mongoose.model<IPrayerRequest>("PrayerRequest", PrayerRequestSchema);

