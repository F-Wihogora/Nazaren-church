import mongoose, { Schema, Document } from "mongoose";

export interface IMinistry extends Document {
  name: string;
  leader: string;
  description: string;
  members: mongoose.Types.ObjectId[];
  meetingSchedule?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MinistrySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    leader: { type: String, required: true },
    description: { type: String, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "Member" }],
    meetingSchedule: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Ministry || mongoose.model<IMinistry>("Ministry", MinistrySchema);

