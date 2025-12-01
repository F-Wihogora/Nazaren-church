import mongoose, { Schema, Document } from "mongoose";

export interface ISmallGroup extends Document {
  name: string;
  leader: string;
  members: mongoose.Types.ObjectId[];
  location: string;
  meetingTime: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const SmallGroupSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    leader: { type: String, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "Member" }],
    location: { type: String, required: true },
    meetingTime: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.SmallGroup || mongoose.model<ISmallGroup>("SmallGroup", SmallGroupSchema);

