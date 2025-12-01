import mongoose, { Schema, Document } from "mongoose";

export interface IPrayerRequest extends Document {
  name?: string;
  request: string;
  isPublic: boolean;
  status: "pending" | "answered" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const PrayerRequestSchema: Schema = new Schema(
  {
    name: { type: String },
    request: { type: String, required: true },
    isPublic: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["pending", "answered", "archived"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.PrayerRequest || mongoose.model<IPrayerRequest>("PrayerRequest", PrayerRequestSchema);

