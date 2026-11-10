"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  Heart,
  Play,
  Users,
  LogOut,
  Sparkles,
  CheckCircle2,
  Phone,
  Mail,
  Edit3,
  X,
  Quote,
  Church,
  Radio,
  FileText,
  UserCheck,
  Lock,
  Eye,
  EyeOff,
  Cake,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { ThemeToggle } from "@/components/ThemeToggle";

type SessionUser = { name: string; email: string; role: string };

type MemberProfile = {
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  gender?: string;
  birthday?: string;
  shareBirthdayWithMembers?: boolean;
  division?: string;
  role?: string;
  churchRoles?: { role: string; status?: string }[];
  family?: { name: string; members?: { fullName: string; division?: string; role?: string }[] };
  ministries?: { name: string; division?: string }[];
};

type EventItem = {
  _id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
};

type SermonItem = {
  _id: string;
  title: string;
  preacher: string;
  date: string;
  videoUrl?: string;
  audioUrl?: string;
  notes?: string;
};

type AnnouncementItem = {
  _id: string;
  title: string;
  content: string;
  type: string;
  bibleVerse?: string;
};

type BirthdayItem = {
  name: string;
  birthdayDate: string;
  isToday?: boolean;
  daysUntil?: number;
};

export default function AccountForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Sign Up Form State
  const [signUpForm, setSignUpForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "Male",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);

  // Dynamic Church Data
  const [events, setEvents] = useState<EventItem[]>([]);
  const [sermons, setSermons] = useState<SermonItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [birthdaysThisWeek, setBirthdaysThisWeek] = useState<BirthdayItem[]>([]);

  // Profile Inline Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editFields, setEditFields] = useState({ phone: "", address: "", gender: "Other", birthday: "", shareBirthdayWithMembers: false });
  const [updateMsg, setUpdateMsg] = useState("");
  const [updateBusy, setUpdateBusy] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then(({ user }) => {
        if (user?.role === "admin" || user?.role === "superadmin") {
          router.replace("/admin");
        } else if (user?.role === "member") {
          setUser(user);
          loadMemberData();
        }
      })
      .catch(() => undefined);
  }, [router]);

  function loadMemberData() {
    fetch("/api/members/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.member) {
          setProfile(d.member);
          setEditFields({
            phone: d.member.phone || "",
            address: d.member.address || "",
            gender: d.member.gender || "Other",
            birthday: d.member.birthday ? d.member.birthday.split("T")[0] : "",
            shareBirthdayWithMembers: Boolean(d.member.shareBirthdayWithMembers),
          });
        }
      })
      .catch(() => undefined);

    fetch("/api/events?upcoming=true&limit=4")
      .then((r) => r.json())
      .then((data) => setEvents(data.events || []))
      .catch(() => undefined);

    fetch("/api/sermons?limit=2")
      .then((r) => r.json())
      .then((data) => setSermons(data.sermons || []))
      .catch(() => undefined);

    fetch("/api/announcements?active=true")
      .then((r) => r.json())
      .then((data) => setAnnouncements(data.announcements || []))
      .catch(() => undefined);

    fetch("/api/birthdays")
      .then((r) => r.json())
      .then((data) => {
        if (data.thisWeek) {
          setBirthdaysThisWeek(data.thisWeek);
        }
      })
      .catch(() => undefined);
  }

  async function handleSaveProfile(e: FormEvent) {
    e.preventDefault();
    setUpdateBusy(true);
    setUpdateMsg("");
    try {
      const res = await fetch("/api/members/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFields),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile.");
      setProfile(data.member);
      setUpdateMsg("Your profile was updated successfully.");
      setIsEditing(false);
    } catch (err: any) {
      setUpdateMsg(err.message || "Could not save profile.");
    } finally {
      setUpdateBusy(false);
    }
  }

  async function signOut() {
    await fetch("/api/auth/session", { method: "DELETE" });
    setUser(null);
    setProfile(null);
  }

  async function handleSignInSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signInEmail, password: signInPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Invalid email or password.");
      if (data.user.role === "admin" || data.user.role === "superadmin") {
        router.push("/admin");
      } else {
        setUser(data.user);
        loadMemberData();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to sign in right now.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSignUpSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    // Client-side validations
    if (!signUpForm.firstName.trim() || !signUpForm.lastName.trim()) {
      setError("Please provide both your first and last name.");
      return;
    }
    if (!signUpForm.dateOfBirth) {
      setError("Date of birth is required.");
      return;
    }
    if (signUpForm.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: signUpForm.firstName.trim(),
          lastName: signUpForm.lastName.trim(),
          email: signUpForm.email.trim().toLowerCase(),
          phone: signUpForm.phone.trim(),
          birthday: signUpForm.dateOfBirth,
          gender: signUpForm.gender,
          address: signUpForm.address.trim(),
          password: signUpForm.password,
          confirmPassword: signUpForm.confirmPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create account. Please check your information.");

      setUser(data.user);
      loadMemberData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to create account right now.");
    } finally {
      setBusy(false);
    }
  }

  const todayFormatted = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const roles = profile?.churchRoles?.map((r) => r.role) || (profile?.role ? [profile.role] : []);

  // ==========================================
  // SIGNED IN: MEMBER DASHBOARD
  // ==========================================
  if (user) {
    const firstName = user.name.split(" ")[0];

    return (
      <div className="min-h-screen bg-background text-foreground pb-20">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 border-b border-border/80 bg-background/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Church Logo"
                className="h-9 w-9 object-contain rounded-full bg-white p-0.5 shadow-sm border"
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Remera Nazarene</p>
                <p className="text-[11px] text-muted-foreground">Member Community Portal</p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <span className="hidden md:inline-flex items-center text-xs text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full border border-border/50">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-primary" />
                {todayFormatted}
              </span>
              <ThemeToggle showSystem />
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-muted-foreground hover:text-foreground text-xs gap-1.5"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
          {/* Welcome Banner */}
          <section className="rounded-3xl bg-primary text-primary-foreground p-8 sm:p-10 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-wider">
                  <Church className="w-3.5 h-3.5" />
                  <span>Remera Church of the Nazarene</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Welcome back, {firstName}.
                </h1>
                <p className="text-primary-foreground/85 text-sm sm:text-base max-w-2xl leading-relaxed">
                  We are blessed to walk together in Christian fellowship, prayer, and service.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-white/15 font-medium">
                    {profile?.division || "General Member"}
                  </span>
                  {roles.map((r) => (
                    <span key={r} className="px-2.5 py-1 rounded-lg bg-white/10 font-medium">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* MAIN 2-COLUMN DASHBOARD */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: EVENTS, SERMONS & ANNOUNCEMENTS */}
            <div className="lg:col-span-8 space-y-8">
              {/* BIRTHDAYS THIS WEEK (REAL DATABASE DRIVEN) */}
              {birthdaysThisWeek.length > 0 && (
                <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-primary">
                      <Cake className="w-5 h-5 text-primary" />
                      <h2 className="text-lg font-bold text-foreground">Birthday Celebrations This Week</h2>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {birthdaysThisWeek.length} {birthdaysThisWeek.length === 1 ? "Celebrant" : "Celebrants"}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Join our pastoral team in praying for and celebrating our church family members with birthdays this week!
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {birthdaysThisWeek.map((b) => (
                      <div
                        key={`${b.name}-${b.birthdayDate}`}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/30 border border-border/60"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                            🎂
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-foreground">{b.name}</p>
                            <p className="text-xs text-muted-foreground">{b.birthdayDate}</p>
                          </div>
                        </div>
                        {b.isToday ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white">
                            Today!
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-muted-foreground">
                            {b.daysUntil === 1 ? "Tomorrow" : `In ${b.daysUntil} days`}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ANNOUNCEMENTS (REAL DATABASE DRIVEN) */}
              {announcements.length > 0 && (
                <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5 text-primary">
                    <Bell className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-foreground">Church Announcements</h2>
                  </div>
                  <div className="space-y-3">
                    {announcements.map((ann) => (
                      <div key={ann._id} className="p-4 rounded-2xl bg-secondary/20 border border-border/60 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                            {ann.type}
                          </span>
                          <h3 className="font-semibold text-sm text-foreground">{ann.title}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{ann.content}</p>
                        {ann.bibleVerse && (
                          <p className="text-[11px] italic text-primary/80 font-medium pt-0.5">{ann.bibleVerse}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* UPCOMING EVENTS */}
              <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-primary">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-foreground">Upcoming Gatherings</h2>
                  </div>
                  <Link href="/events" className="text-xs font-semibold text-primary hover:underline">
                    View calendar &rarr;
                  </Link>
                </div>

                {events.length > 0 ? (
                  <div className="space-y-4">
                    {events.map((ev) => {
                      const d = new Date(ev.date);
                      const month = d.toLocaleString("default", { month: "short" }).toUpperCase();
                      const day = d.getDate();
                      return (
                        <div
                          key={ev._id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border/60 bg-secondary/15 hover:border-primary/40 transition-colors"
                        >
                          <div className="flex items-start gap-3.5">
                            <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary font-bold shrink-0">
                              <span className="text-[10px] uppercase">{month}</span>
                              <span className="text-base leading-tight">{day}</span>
                            </div>
                            <div className="space-y-1">
                              <h3 className="font-semibold text-sm text-foreground">{ev.title}</h3>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                {ev.time && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-primary" /> {ev.time}
                                  </span>
                                )}
                                {ev.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-primary" /> {ev.location}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Link href={`/events/${ev._id}`} className="shrink-0">
                            <Button size="sm" variant="outline" className="w-full sm:w-auto text-xs h-9 rounded-xl">
                              RSVP
                            </Button>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-secondary/15 rounded-2xl text-xs text-muted-foreground">
                    No upcoming events at the moment. Please check back soon.
                  </div>
                )}
              </section>

              {/* LATEST SERMONS */}
              <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-primary">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-foreground">Recent Sermons &amp; Teachings</h2>
                  </div>
                  <Link href="/sermons" className="text-xs font-semibold text-primary hover:underline">
                    View all sermons &rarr;
                  </Link>
                </div>

                {sermons.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sermons.map((s) => (
                      <div
                        key={s._id}
                        className="p-5 rounded-2xl border border-border/60 bg-secondary/15 flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-1.5">
                          <span className="text-[11px] text-muted-foreground">
                            {new Date(s.date).toLocaleDateString()}
                          </span>
                          <h3 className="font-semibold text-sm text-foreground line-clamp-2">{s.title}</h3>
                          <p className="text-xs text-muted-foreground">{s.preacher}</p>
                        </div>
                        <Link href={`/sermons/${s._id}`}>
                          <Button size="sm" className="w-full text-xs h-9 rounded-xl gap-1.5">
                            <Play className="w-3.5 h-3.5 fill-current" /> Watch Sermon
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-secondary/15 rounded-2xl text-xs text-muted-foreground">
                    No sermons available at the moment. Please check back soon.
                  </div>
                )}
              </section>
            </div>

            {/* RIGHT COLUMN: MEMBER PROFILE & FAST ACTIONS */}
            <div className="lg:col-span-4 space-y-6">
              {/* PROFILE CARD */}
              <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-foreground">My Profile</h2>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setIsEditing(!isEditing);
                      setUpdateMsg("");
                    }}
                    className="text-xs h-8 gap-1.5 text-primary"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditing ? "Cancel" : "Edit"}</span>
                  </Button>
                </div>

                {updateMsg && (
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary font-medium">
                    {updateMsg}
                  </div>
                )}

                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="edit-phone" className="text-xs font-medium">Phone Number</Label>
                      <Input
                        id="edit-phone"
                        type="tel"
                        value={editFields.phone}
                        onChange={(e) => setEditFields({ ...editFields, phone: e.target.value })}
                        placeholder="+250 78x xxx xxx"
                        className="h-10 rounded-xl text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="edit-address" className="text-xs font-medium">Neighborhood / City</Label>
                      <Input
                        id="edit-address"
                        type="text"
                        value={editFields.address}
                        onChange={(e) => setEditFields({ ...editFields, address: e.target.value })}
                        placeholder="Remera, Kigali"
                        className="h-10 rounded-xl text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="edit-gender" className="text-xs font-medium">Gender</Label>
                        <Select
                          id="edit-gender"
                          value={editFields.gender}
                          onChange={(e) => setEditFields({ ...editFields, gender: e.target.value })}
                          className="h-10 rounded-xl text-xs"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="edit-bday" className="text-xs font-medium">Date of Birth</Label>
                        <Input
                          id="edit-bday"
                          type="date"
                          value={editFields.birthday}
                          onChange={(e) => setEditFields({ ...editFields, birthday: e.target.value })}
                          className="h-10 rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    {isAtLeastSixteen(editFields.birthday) ? (
                      <label className="flex items-start gap-2.5 rounded-xl border p-3 text-xs leading-relaxed">
                        <input
                          type="checkbox"
                          checked={editFields.shareBirthdayWithMembers}
                          onChange={(e) => setEditFields({ ...editFields, shareBirthdayWithMembers: e.target.checked })}
                          className="mt-0.5 h-4 w-4 accent-primary"
                        />
                        <span>Let signed-in church members see my first name and birthday (month and day only). I can turn this off at any time.</span>
                      </label>
                    ) : (
                      <p className="rounded-xl border p-3 text-xs leading-relaxed text-muted-foreground">
                        Birthday sharing is unavailable for members under 16. Their birthday information stays private.
                      </p>
                    )}

                    <Button type="submit" disabled={updateBusy} className="w-full h-10 rounded-xl text-xs font-semibold">
                      {updateBusy ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div>
                      <p className="text-muted-foreground">Full Name</p>
                      <p className="font-semibold text-sm text-foreground">{profile?.fullName || user.name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email Address</p>
                      <p className="font-semibold text-foreground">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone Number</p>
                      <p className="font-semibold text-foreground">
                        {profile?.phone || <span className="text-muted-foreground/60 italic">Not provided</span>}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date of Birth</p>
                      <p className="font-semibold text-foreground">
                        {profile?.birthday ? new Date(profile.birthday).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : <span className="text-muted-foreground/60 italic">Not set</span>}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Address / Residence</p>
                      <p className="font-semibold text-foreground">
                        {profile?.address || <span className="text-muted-foreground/60 italic">Remera, Kigali</span>}
                      </p>
                    </div>
                  </div>
                )}
              </section>

              {/* QUICK LINKS */}
              <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-foreground">Church Community</h3>
                <div className="space-y-2 text-xs">
                  <Link href="/prayer-request" className="block p-3 rounded-2xl bg-secondary/20 hover:bg-secondary/40 transition-colors">
                    <p className="font-semibold text-foreground">Prayer Requests</p>
                    <p className="text-muted-foreground text-[11px]">Submit confidential prayers to the pastoral team.</p>
                  </Link>
                  <Link href="/contact#giving" className="block p-3 rounded-2xl bg-secondary/20 hover:bg-secondary/40 transition-colors">
                    <p className="font-semibold text-foreground">Giving &amp; Tithes</p>
                    <p className="text-muted-foreground text-[11px]">Support the church mission and community care.</p>
                  </Link>
                  <Link href="/contact" className="block p-3 rounded-2xl bg-secondary/20 hover:bg-secondary/40 transition-colors">
                    <p className="font-semibold text-foreground">Contact Pastoral Office</p>
                    <p className="text-muted-foreground text-[11px]">Boulevard de l&apos;Aeroport Rd, Remera, Kigali</p>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // SIGN IN / SIGN UP SCREEN (SPLIT SCREEN)
  // ==========================================
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center">
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT COLUMN: AUTHENTIC SANCTUARY IMAGE & WELCOMING MESSAGE */}
        <div className="relative lg:col-span-6 hidden lg:flex flex-col justify-between p-12 lg:p-16 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/church_congregation.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40" />

          {/* Top Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="Church Logo"
              className="h-11 w-11 object-contain rounded-full bg-white p-0.5 shadow-md border"
            />
            <div>
              <p className="text-white text-sm font-bold tracking-tight">
                REMERA CHURCH OF THE NAZARENE
              </p>
              <p className="text-white/70 text-[10px] font-semibold uppercase tracking-widest">
                Holiness Unto The Lord
              </p>
            </div>
          </div>

          {/* Center Message */}
          <div className="relative z-10 max-w-lg space-y-4 my-auto py-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Welcome to our church community.
            </h1>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              Sign in or create your member profile to stay connected with worship services, upcoming events, prayer requests, and church announcements.
            </p>
          </div>

          {/* Scripture Quote */}
          <div className="relative z-10 max-w-lg bg-black/50 backdrop-blur-md rounded-2xl p-5 border border-white/15 text-white/90 space-y-2">
            <Quote className="w-5 h-5 text-white/60" />
            <p className="text-xs sm:text-sm italic leading-relaxed">
              &ldquo;I was glad when they said to me, &apos;Let us go into the house of the Lord.&apos;&rdquo;
            </p>
            <p className="text-[11px] text-white/60 font-semibold tracking-wider uppercase">
              — Psalm 122:1
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: AUTHENTICATION FORM */}
        <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-background">
          {/* Top Back Navigation */}
          <div className="flex items-center justify-between w-full mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to website
            </Link>
            <ThemeToggle showSystem />
          </div>

          {/* Form Box */}
          <div className="w-full max-w-md mx-auto my-auto space-y-6">
            {/* Form Header */}
            <div className="space-y-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {mode === "signin" ? "Member Sign In" : "Create Member Account"}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {mode === "signin"
                    ? "Enter your email and password to access your member portal."
                    : "Fill in your details below to register as a church member."}
                </p>
              </div>

              {/* Segmented Mode Selector */}
              <div className="grid grid-cols-2 p-1 bg-muted rounded-xl border border-border/60">
                <button
                  type="button"
                  onClick={() => { setMode("signin"); setError(""); }}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    mode === "signin"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("signup"); setError(""); }}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    mode === "signup"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive flex items-center gap-2"
              >
                <X className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* ======================= */}
            {/* SIGN IN FORM */}
            {/* ======================= */}
            {mode === "signin" ? (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="signin-email" className="text-xs font-semibold">
                    Email Address
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    required
                    className="h-11 rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="signin-password" className="text-xs font-semibold">
                      Password
                    </Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showSignInPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      required
                      className="h-11 rounded-xl text-sm pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                      aria-label={showSignInPassword ? "Hide password" : "Show password"}
                    >
                      {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={busy}
                  className="w-full h-11 rounded-xl font-semibold text-xs sm:text-sm mt-2"
                >
                  {busy ? "Signing in..." : "Sign In to Member Portal"}
                </Button>
              </form>
            ) : (
              /* ======================= */
              /* SIGN UP FORM */
              /* ======================= */
              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-firstname" className="text-xs font-semibold">
                      First Name *
                    </Label>
                    <Input
                      id="signup-firstname"
                      placeholder="e.g. Eric"
                      value={signUpForm.firstName}
                      onChange={(e) => setSignUpForm({ ...signUpForm, firstName: e.target.value })}
                      required
                      className="h-11 rounded-xl text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-lastname" className="text-xs font-semibold">
                      Last Name *
                    </Label>
                    <Input
                      id="signup-lastname"
                      placeholder="e.g. Mugisha"
                      value={signUpForm.lastName}
                      onChange={(e) => setSignUpForm({ ...signUpForm, lastName: e.target.value })}
                      required
                      className="h-11 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <Label htmlFor="signup-email" className="text-xs font-semibold">
                    Email Address *
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    value={signUpForm.email}
                    onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                    required
                    className="h-11 rounded-xl text-sm"
                  />
                </div>

                {/* Phone & Gender */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-phone" className="text-xs font-semibold">
                      Phone Number
                    </Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="+250 788 000 000"
                      value={signUpForm.phone}
                      onChange={(e) => setSignUpForm({ ...signUpForm, phone: e.target.value })}
                      className="h-11 rounded-xl text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-gender" className="text-xs font-semibold">
                      Gender
                    </Label>
                    <Select
                      id="signup-gender"
                      value={signUpForm.gender}
                      onChange={(e) => setSignUpForm({ ...signUpForm, gender: e.target.value })}
                      className="h-11 rounded-xl text-sm"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Select>
                  </div>
                </div>

                {/* Date of Birth (REQUIRED) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="signup-dob" className="text-xs font-semibold">
                      Date of Birth *
                    </Label>
                    <span className="text-[11px] text-muted-foreground">Required for church records</span>
                  </div>
                  <Input
                    id="signup-dob"
                    type="date"
                    value={signUpForm.dateOfBirth}
                    onChange={(e) => setSignUpForm({ ...signUpForm, dateOfBirth: e.target.value })}
                    required
                    className="h-11 rounded-xl text-sm"
                  />
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <Label htmlFor="signup-address" className="text-xs font-semibold">
                    Neighborhood / City (Optional)
                  </Label>
                  <Input
                    id="signup-address"
                    placeholder="e.g. Remera, Gasabo, Kigali"
                    value={signUpForm.address}
                    onChange={(e) => setSignUpForm({ ...signUpForm, address: e.target.value })}
                    className="h-11 rounded-xl text-sm"
                  />
                </div>

                {/* Password with Visibility Toggle */}
                <div className="space-y-1.5">
                  <Label htmlFor="signup-password" className="text-xs font-semibold">
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showSignUpPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Minimum 8 characters"
                      value={signUpForm.password}
                      onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                      required
                      minLength={8}
                      className="h-11 rounded-xl text-sm pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                      aria-label={showSignUpPassword ? "Hide password" : "Show password"}
                    >
                      {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password with Visibility Toggle */}
                <div className="space-y-1.5">
                  <Label htmlFor="signup-confirmpassword" className="text-xs font-semibold">
                    Confirm Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-confirmpassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Re-enter your password"
                      value={signUpForm.confirmPassword}
                      onChange={(e) => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })}
                      required
                      minLength={8}
                      className="h-11 rounded-xl text-sm pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={busy}
                  className="w-full h-11 rounded-xl font-semibold text-xs sm:text-sm mt-2"
                >
                  {busy ? "Creating account..." : "Complete Registration"}
                </Button>
              </form>
            )}

            {/* Bottom Switcher */}
            <div className="text-center text-xs text-muted-foreground pt-2">
              {mode === "signin" ? "New to our church family? " : "Already registered? "}
              <button
                type="button"
                className="font-semibold text-primary underline-offset-4 hover:underline"
                onClick={() => {
                  setMode(mode === "signin" ? "signup" : "signin");
                  setError("");
                }}
              >
                {mode === "signin" ? "Create an account" : "Sign in here"}
              </button>
            </div>
          </div>

          {/* Bottom Footer Note */}
          <div className="pt-6 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Secure Member Portal
            </span>
            <Link href="/admin/login" className="hover:text-primary transition-colors font-medium">
              Church Staff Login &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function isAtLeastSixteen(value: string) {
  if (!value) return false;
  const birthday = new Date(`${value}T00:00:00`);
  if (Number.isNaN(birthday.getTime())) return false;
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 16);
  return birthday <= cutoff;
}
