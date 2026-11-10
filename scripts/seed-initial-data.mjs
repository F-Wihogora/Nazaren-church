import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nazarene-church';

async function seedData() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  // Seed Ministries
  const ministryCount = await mongoose.connection.collection('ministries').countDocuments();
  if (ministryCount === 0) {
    const ministries = [
      {
        name: 'NDI – Nazarene Discipleship International',
        leader: 'Pastor Jacques Niyonsaba & Discipleship Committee',
        description: 'Learning the Word of God and preparing believers to grow as committed disciples and teachers of Christ.',
        meetingSchedule: 'Sundays 8:00 AM – 9:00 AM',
        division: 'Discipleship & Christian Education',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'NYI – Nazarene Youth International',
        leader: 'Youth Leadership Council',
        description: 'Vibrant youth community focused on spiritual growth, worship, fellowship, talent development, and servant leadership.',
        meetingSchedule: 'Saturdays 3:00 PM – 5:30 PM',
        division: 'Youth & Young Adults',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'NMI – Nazarene Missions International',
        leader: 'Missions Director',
        description: 'Mobilizing our congregation for prayer, outreach into Kigali communities, and world evangelism partnerships.',
        meetingSchedule: '1st Sunday of every month & Outreach Saturdays',
        division: 'Global & Local Missions',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'NCM – Nazarene Compassionate Ministries',
        leader: 'Compassion Ministry Team',
        description: "Demonstrating Christ's love through practical community assistance, vulnerable family support, and educational care.",
        meetingSchedule: 'Bi-weekly Thursdays 4:00 PM',
        division: 'Community Care & Relief',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Worship & Music Ministry',
        leader: 'Choir Leadership & Musicians',
        description: 'Leading our congregation into deep, reverent, and vibrant worship in spirit and truth during weekly services.',
        meetingSchedule: 'Saturdays 2:00 PM & Sundays 7:30 AM',
        division: 'Worship & Creative Arts',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Children’s Ministry',
        leader: 'Children’s Department Coordinator',
        description: 'Nurturing the faith of our children in a safe, fun, and Christ-centered environment where they discover the Bible.',
        meetingSchedule: 'Sundays during Main Service (8:30 AM – 11:30 AM)',
        division: 'Children & Family Care',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await mongoose.connection.collection('ministries').insertMany(ministries);
    console.log(`Seeded ${ministries.length} ministries`);
  } else {
    console.log(`Ministries already exist: ${ministryCount}`);
  }

  // Seed Events
  const eventCount = await mongoose.connection.collection('events').countDocuments();
  if (eventCount === 0) {
    const now = new Date();
    const sunday = new Date(now);
    sunday.setDate(now.getDate() + ((7 - now.getDay()) % 7 || 7));
    sunday.setHours(8, 0, 0, 0);

    const friday = new Date(now);
    friday.setDate(now.getDate() + ((5 - now.getDay() + 7) % 7 || 7));
    friday.setHours(17, 0, 0, 0);

    const saturday = new Date(now);
    saturday.setDate(now.getDate() + ((6 - now.getDay() + 7) % 7 || 7));
    saturday.setHours(15, 0, 0, 0);

    const events = [
      {
        title: 'Sunday Celebration Worship & Word',
        description: 'Join our full church family for a powerful morning of worship, communion, and biblical teaching from our pastoral team.',
        date: sunday,
        time: '8:00 AM – 12:00 PM',
        location: 'Remera Church Sanctuary, Kigali',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Friday Evening Intercession & Revival',
        description: 'A dedicated gathering of prayer, praise, and intercession for families, our community, and personal breakthroughs.',
        date: friday,
        time: '5:00 PM – 7:00 PM',
        location: 'Main Sanctuary & YouTube Live',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Youth & Young Adults Fellowship (NYI)',
        description: 'An uplifting gathering with praise, transparent conversation, career mentoring, and peer fellowship.',
        date: saturday,
        time: '3:00 PM – 5:30 PM',
        location: 'Remera Fellowship Hall',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await mongoose.connection.collection('events').insertMany(events);
    console.log(`Seeded ${events.length} events`);
  } else {
    console.log(`Events already exist: ${eventCount}`);
  }

  // Seed Announcements
  const announcementCount = await mongoose.connection.collection('announcements').countDocuments();
  if (announcementCount === 0) {
    const announcements = [
      {
        type: 'general',
        title: 'Welcome Home to Remera Church of the Nazarene',
        content: 'Whether you are joining us in Kigali or connecting through our YouTube broadcasts across the world, we are blessed to have you with us.',
        bibleVerse: 'I was glad when they said to me, "Let us go into the house of the Lord." — Psalm 122:1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: 'service',
        title: 'Friday Intercession & Revival Gathering',
        content: 'Every Friday from 5:00 PM to 7:00 PM, we gather to seek the Lord in prayer for our families, church, and nation.',
        bibleVerse: 'The prayer of a righteous person is powerful and effective. — James 5:16',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await mongoose.connection.collection('announcements').insertMany(announcements);
    console.log(`Seeded ${announcements.length} announcements`);
  } else {
    console.log(`Announcements already exist: ${announcementCount}`);
  }

  await mongoose.disconnect();
  console.log('Finished database seeding successfully');
}

seedData().catch(console.error);
