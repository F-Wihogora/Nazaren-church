import mongoose, { Schema, Document } from "mongoose";

export interface IMinistry extends Document {
  name: string;
  leader: string;
  description: string;
  members: mongoose.Types.ObjectId[];
  meetingSchedule?: string;
  division?: string;
  assistantLeader?: string;
  image?: string;
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
    division: { type: String },
    assistantLeader: { type: String },
    image: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

export default mongoose.models.Ministry || mongoose.model<IMinistry>("Ministry", MinistrySchema);

