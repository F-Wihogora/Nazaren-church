import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAttendance extends Document {
  date: Date;
  serviceType: string;
  ministry?: Types.ObjectId;
  presentMembers: Types.ObjectId[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema: Schema = new Schema(
  {
    date: { type: Date, required: true },
    serviceType: { type: String, required: true },
    ministry: { type: Schema.Types.ObjectId, ref: "Ministry" },
    presentMembers: [{ type: Schema.Types.ObjectId, ref: "Member" }],
    notes: { type: String },
  },
  { timestamps: true }
);

AttendanceSchema.index({ date: -1, serviceType: 1 });

export default mongoose.models.Attendance || mongoose.model<IAttendance>("Attendance", AttendanceSchema);
