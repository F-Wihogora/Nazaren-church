/**
 * Helper utilities for Church Member Birthday Tracking
 */

export interface BirthdayCelebrant {
  _id: string;
  name: string;
  birthdayDate: string; // e.g. "September 29"
  isToday: boolean;
  daysUntil: number;
}

export interface AdminBirthdayRecord {
  _id: string;
  fullName: string;
  email?: string;
  phone?: string;
  gender?: string;
  division?: string;
  birthday: string;
  birthdayFormatted: string; // e.g. "September 29"
  birthDateFull: string; // e.g. "September 29, 1996"
  age: number;
  daysUntil: number;
  isToday: boolean;
  isThisWeek: boolean;
  isThisMonth: boolean;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

/**
 * Calculates days until next birthday from a given base date
 */
export function getDaysUntilBirthday(birthDate: Date, fromDate: Date = new Date()): number {
  const currentYear = fromDate.getFullYear();
  const bMonth = birthDate.getMonth();
  const bDay = birthDate.getDate();

  // Midnight normalized
  const today = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  let nextBday = new Date(currentYear, bMonth, bDay);

  if (nextBday < today) {
    nextBday = new Date(currentYear + 1, bMonth, bDay);
  }

  const diffTime = nextBday.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculates current age
 */
export function calculateAge(birthDate: Date, atDate: Date = new Date()): number {
  let age = atDate.getFullYear() - birthDate.getFullYear();
  const m = atDate.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && atDate.getDate() < birthDate.getDate())) {
    age--;
  }
  return age > 0 ? age : 0;
}

/**
 * Formats month and day e.g. "September 29"
 */
export function formatMonthDay(date: Date): string {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}`;
}
