import mongoose, { Schema, Document } from "mongoose";

export interface IVisitor extends Document {
  name: string;
  contact: string;
  howFound: string;
  wantsFollowUp: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VisitorSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    howFound: { type: String, required: true },
    wantsFollowUp: { type: Boolean, default: false },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Visitor || mongoose.model<IVisitor>("Visitor", VisitorSchema);

