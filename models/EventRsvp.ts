import mongoose, { Schema, Document, Types } from "mongoose";

export interface IEventRsvp extends Document {
  event: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  guests: number;
  createdAt: Date;
  updatedAt: Date;
}

const EventRsvpSchema: Schema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    guests: { type: Number, default: 1, min: 1, max: 20 },
  },
  { timestamps: true }
);

EventRsvpSchema.index({ event: 1, email: 1 }, { unique: true });

export default mongoose.models.EventRsvp || mongoose.model<IEventRsvp>("EventRsvp", EventRsvpSchema);
