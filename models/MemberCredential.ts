import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IMemberCredential extends Document {
  member: mongoose.Types.ObjectId;
  email: string;
  passwordHash: string;
  comparePassword(password: string): Promise<boolean>;
}

const MemberCredentialSchema = new Schema<IMemberCredential>({
  member: { type: Schema.Types.ObjectId, ref: "Member", required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
}, { timestamps: true });
MemberCredentialSchema.methods.comparePassword = function (password: string) { return bcrypt.compare(password, this.passwordHash); };
export default mongoose.models.MemberCredential || mongoose.model<IMemberCredential>("MemberCredential", MemberCredentialSchema);
