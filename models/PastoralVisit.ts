import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPastoralVisit extends Document {
  member: Types.ObjectId;
  visitType: string;
  date: Date;
  leader: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PastoralVisitSchema: Schema = new Schema(
  {
    member: { type: Schema.Types.ObjectId, ref: "Member", required: true, index: true },
    visitType: { type: String, required: true },
    date: { type: Date, required: true },
    leader: { type: String, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.PastoralVisit || mongoose.model<IPastoralVisit>("PastoralVisit", PastoralVisitSchema);
