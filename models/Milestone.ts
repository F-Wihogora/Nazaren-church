import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMilestone extends Document {
  member: Types.ObjectId;
  type: string;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneSchema: Schema = new Schema(
  {
    member: { type: Schema.Types.ObjectId, ref: "Member", required: true, index: true },
    type: { type: String, required: true },
    date: { type: Date, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Milestone || mongoose.model<IMilestone>("Milestone", MilestoneSchema);
