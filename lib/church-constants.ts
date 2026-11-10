/** Church divisions (age / fellowship groups). */
export const CHURCH_DIVISIONS = ["Children", "Youth", "Women", "Men", "General"] as const;
export type ChurchDivision = (typeof CHURCH_DIVISIONS)[number];

/** Roles a member can hold (one person may have several). */
export const CHURCH_ROLES = [
  "Pastor",
  "Assistant Pastor",
  "Elder",
  "Deacon",
  "Treasurer",
  "Secretary",
  "Usher",
  "Choir Member",
  "Worship Leader",
  "Youth Leader",
  "Sunday School Teacher",
  "Media Team Member",
  "Prayer Team Member",
  "Ministry Leader",
  "Member",
  "Visitor",
] as const;
export type ChurchRole = (typeof CHURCH_ROLES)[number];

export const SERVICE_TYPES = [
  "Sunday Service",
  "Bible Study",
  "Prayer Meeting",
  "Youth Meeting",
  "Women Fellowship",
  "Men Fellowship",
  "Children Service",
  "Other",
] as const;

export const MILESTONE_TYPES = [
  "Baptism",
  "Confirmation",
  "Child Dedication",
  "Marriage",
  "Membership Transfer In",
  "Membership Transfer Out",
] as const;

export const PASTORAL_VISIT_TYPES = [
  "Home Visit",
  "Hospital Visit",
  "Counseling",
  "New Member Follow-up",
  "Crisis Support",
  "Other",
] as const;

/** Suggest division from age and gender (staff can override). */
export function suggestDivision(birthday: Date | undefined, gender: string): ChurchDivision {
  if (!birthday) return "General";
  const age = Math.floor((Date.now() - birthday.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  if (age < 13) return "Children";
  if (age < 18) return "Youth";
  if (gender === "Female") return "Women";
  if (gender === "Male") return "Men";
  return "General";
}
