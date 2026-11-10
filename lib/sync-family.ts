import Member from "@/models/Member";
import { Types } from "mongoose";

/** Keep Member.family in sync with a household member list. */
export async function syncFamilyMembers(familyId: Types.ObjectId | string, memberIds: string[]) {
  const id = String(familyId);
  await Member.updateMany({ family: id, _id: { $nin: memberIds } }, { $unset: { family: 1 } });
  if (memberIds.length) {
    await Member.updateMany({ _id: { $in: memberIds } }, { family: id });
  }
}
