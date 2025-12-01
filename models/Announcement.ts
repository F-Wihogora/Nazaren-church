import mongoose, { Schema, Document } from "mongoose";

export type AnnouncementType = "weekly" | "verse" | "notice";

export interface IAnnouncement extends Document {
  type: AnnouncementType;
  title: string;
  content: string;
  bibleVerse?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: ["weekly", "verse", "notice"],
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    bibleVerse: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Announcement || mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);

