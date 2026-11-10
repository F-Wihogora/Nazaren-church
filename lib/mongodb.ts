import mongoose from "mongoose";

// Pre-register all models to prevent MissingSchemaError during .populate() calls
import "@/models/AdminUser";
import "@/models/Member";
import "@/models/MemberCredential";
import "@/models/Family";
import "@/models/Ministry";
import "@/models/Event";
import "@/models/EventRsvp";
import "@/models/Sermon";
import "@/models/Announcement";
import "@/models/Attendance";
import "@/models/Milestone";
import "@/models/PastoralVisit";
import "@/models/PrayerRequest";
import "@/models/GivingRecord";
import "@/models/SmallGroup";
import "@/models/Contact";
import "@/models/Visitor";
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env or Vercel settings");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;

