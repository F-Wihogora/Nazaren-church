import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nazarene-church";

const SermonSchema = new mongoose.Schema(
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

const Sermon = mongoose.models.Sermon || mongoose.model("Sermon", SermonSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB for sermons seed.");

  // Remove any duplicates or outdated placeholders
  await Sermon.deleteMany({
    $or: [
      { videoUrl: { $regex: "Sd8jl1pmf3M" } },
      { videoUrl: { $regex: "rshZX6XLpyM" } },
    ],
  });

  await Sermon.create({
    title: "Sunday Celebration Service — Walking in Holiness",
    preacher: "Pastor Jacques Niyonsaba",
    date: new Date("2026-09-27T08:00:00Z"),
    videoUrl: "https://www.youtube.com/watch?v=Sd8jl1pmf3M",
    notes: "Live Sunday worship and ministry of the Word from Remera Church of the Nazarene.",
  });

  await Sermon.create({
    title: "Friday Intercession & Revival Gathering",
    preacher: "Pastoral Leadership Team",
    date: new Date("2026-09-25T17:00:00Z"),
    videoUrl: "https://www.youtube.com/watch?v=rshZX6XLpyM",
    notes: "Friday service dedicated to prayer, renewal in the Holy Spirit, and fellowship.",
  });

  const count = await Sermon.countDocuments();
  console.log("✅ Sermons successfully seeded! Total count:", count);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
