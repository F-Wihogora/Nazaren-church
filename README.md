# Nazarene Church Website

A modern, dynamic, fully responsive church website built with Next.js 14 (App Router), Tailwind CSS, MongoDB, Mongoose, and shadcn/ui.

## Features

### Public Pages
- **Home Page**: Hero section, latest sermons preview, upcoming events, announcements, about section, and contact information
- **Sermons Page**: Browse and filter sermons by date and preacher
- **Events Page**: View upcoming church events
- **About Page**: Mission statement, vision, leadership team, and Bible verses
- **Contact Page**: Contact form with church information and map
- **Prayer Request Form**: Public form to submit prayer requests
- **Visitor Registration**: Form for new visitors to register

### Admin Dashboard
- **Dashboard Overview**: Statistics and quick access to all sections
- **Sermon Management**: Full CRUD for sermons
- **Event Management**: Full CRUD for events
- **Member Management**: Complete member database with roles, ministries, and search
- **Ministry Management**: Create and manage church ministries
- **Announcement Management**: Create weekly announcements, Bible verses, and notices
- **Prayer Request Management**: View and manage prayer requests
- **Visitor Management**: View visitor registrations
- **Giving Records**: Record and track donations (no payment gateway)
- **Small Groups/Home Cells**: Manage small groups and home cells
- **Member Portal**: Member registration, secure sign-in, and upcoming events (`/account`)
- **Event RSVP**: Public RSVP on event detail pages; staff view RSVPs in admin
- **Contact Inbox**: Admin view for contact form submissions
- **CSV Export**: Members and giving records export for reporting

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: Custom JWT-based (can be upgraded to NextAuth)
- **Theme**: Dark mode support with next-themes

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository** (or navigate to the project directory)

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/nazarene-church
   # Or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nazarene-church
   
   NEXTAUTH_URL=http://localhost:3001
   NEXTAUTH_SECRET=generate-a-unique-random-value-at-least-32-characters
   
   # Optional: Google Maps API key for map embed
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   ```

4. **Create the first admin user** (use a unique password with at least 12 characters):
   Run the seed script to create your first admin user:
   ```bash
   ADMIN_EMAIL=admin@example.org ADMIN_PASSWORD='your-unique-password' ADMIN_NAME='Church Administrator' npm run seed
   ```
   On PowerShell, set `$env:ADMIN_EMAIL`, `$env:ADMIN_PASSWORD`, and `$env:ADMIN_NAME` first, then run `npm run seed`.

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3001](http://localhost:3001)

Member self-registration and sign-in are available at `/account`. Authentication uses a signed, HTTP-only cookie. Keep `.env.local` out of source control and use a unique `NEXTAUTH_SECRET` of at least 32 characters in every environment. Rotate database credentials that have been shared and allow the production host in MongoDB network access before deployment.

**Church staff:** see [docs/HANDOVER.md](docs/HANDOVER.md) for day-to-day operation instructions.

## Project Structure

```
├── app/
│   ├── admin/              # Admin dashboard pages
│   │   ├── login/          # Admin login page
│   │   ├── sermons/        # Sermon management
│   │   ├── events/         # Event management
│   │   ├── members/        # Member management
│   │   ├── ministries/     # Ministry management
│   │   ├── announcements/  # Announcement management
│   │   ├── prayer-requests/ # Prayer request management
│   │   ├── visitors/       # Visitor management
│   │   ├── giving/         # Giving records
│   │   └── small-groups/  # Small group management
│   ├── api/                # API routes
│   ├── about/              # About page
│   ├── contact/            # Contact page
│   ├── events/             # Events page
│   ├── sermons/            # Sermons page
│   ├── prayer-request/     # Prayer request form
│   ├── visitor-registration/ # Visitor registration
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── Navbar.tsx          # Navigation bar
│   └── Footer.tsx          # Footer component
├── models/                 # Mongoose models
├── lib/                    # Utility functions
│   ├── mongodb.ts          # MongoDB connection
│   └── utils.ts            # Utility functions
└── public/                 # Static assets
```

## MongoDB Models

The application uses the following Mongoose models:

- **Sermon**: Sermons with title, preacher, date, video/audio links
- **Event**: Church events with date, time, location
- **Member**: Church members with roles, ministries, contact info
- **Ministry**: Church ministries and departments
- **Announcement**: Weekly announcements, Bible verses, notices
- **Visitor**: Visitor registration data
- **PrayerRequest**: Prayer requests from the public
- **GivingRecord**: Donation and giving records
- **SmallGroup**: Small groups/home cells
- **AdminUser**: Admin user accounts
- **Contact**: Contact form submissions

## API Routes

All API routes are located in `app/api/`:

- `/api/sermons` - GET, POST
- `/api/sermons/[id]` - GET, PUT, DELETE
- `/api/events` - GET, POST
- `/api/events/[id]` - GET, PUT, DELETE
- `/api/members` - GET, POST
- `/api/members/[id]` - GET, PUT, DELETE
- `/api/ministries` - GET, POST
- `/api/ministries/[id]` - GET, PUT, DELETE
- `/api/announcements` - GET, POST
- `/api/announcements/[id]` - GET, PUT, DELETE
- `/api/prayer-requests` - GET, POST
- `/api/prayer-requests/[id]` - PUT, DELETE
- `/api/visitors` - GET, POST
- `/api/giving-records` - GET, POST
- `/api/giving-records/[id]` - PUT, DELETE
- `/api/small-groups` - GET, POST
- `/api/small-groups/[id]` - GET, PUT, DELETE
- `/api/contact` - GET (admin), POST
- `/api/contact/[id]` - DELETE (admin)
- `/api/admin/stats` - GET (admin dashboard)
- `/api/events/[id]/rsvp` - GET (admin), POST (public)
- `/api/auth/login` - POST (admin and member sign-in)
- `/api/auth/signup` - POST (member registration)
- `/api/auth/session` - GET, DELETE

## Deployment to Vercel

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard:
     - `MONGODB_URI`
     - `NEXTAUTH_URL` (your Vercel domain)
     - `NEXTAUTH_SECRET` (generate a secure random string)
     - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (optional)

3. **Set up MongoDB Atlas** (recommended for production):
   - Create a MongoDB Atlas account
   - Create a cluster
   - Get your connection string
   - Add it to Vercel environment variables as `MONGODB_URI`
   - Whitelist Vercel's IP addresses (or use 0.0.0.0/0 for all)

4. **Deploy**:
   - Vercel will automatically deploy on every push to main
   - Your site will be live at `your-project.vercel.app`

## Admin Access

1. Navigate to `/admin/login`
2. Sign in with the administrator account created by `npm run seed`.

## Customization

### Colors and Theme
- Edit `app/globals.css` to customize color scheme
- The design uses CSS variables for easy theming

### Church Information
- Update contact information in:
  - `components/Footer.tsx`
  - `app/contact/page.tsx`
  - `app/page.tsx` (hero section)

### Service Times
- Update service times in:
  - `app/page.tsx` (hero section)
  - `app/contact/page.tsx`

## Features to Add (Future Enhancements)

- [ ] Payment gateway integration for online giving
- [ ] Email notifications for prayer requests
- [ ] SMS notifications for events
- [ ] Member profile updates and password recovery (requires a configured email delivery provider)
- [x] Event RSVP system
- [ ] Sermon notes download
- [ ] Live streaming integration
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

## Support

For issues or questions, please create an issue in the repository or contact the development team.

## License

This project is created for Nazarene Church. All rights reserved.

---

Built with ❤️ for the Nazarene Church community

