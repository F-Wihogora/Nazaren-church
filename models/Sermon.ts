import mongoose, { Schema, Document } from "mongoose";

export interface ISermon extends Document {
  title: string;
  preacher: string;
  date: Date;
  videoUrl?: string;
  audioUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SermonSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    preacher: { type: String, required: true },
    date: { type: Date, required: true },
    videoUrl: { type: String },
    audioUrl: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Sermon || mongoose.model<ISermon>("Sermon", SermonSchema);

