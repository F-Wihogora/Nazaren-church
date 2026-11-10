# Remera Church of the Nazarene — System Handover Guide

This document is for church staff who will operate the website and admin dashboard day to day.

## What the system does

| Area | Public website | Admin dashboard |
|------|----------------|-----------------|
| Sermons | Browse and watch/listen | Add, edit, remove |
| Events | View upcoming events, RSVP | Manage events, view RSVPs |
| Members | Self-register at `/account` | Full member database, CSV export |
| Ministries & small groups | — | Manage groups and assignments |
| Announcements | Shown on home when **Active** | Create weekly notices and verses |
| Prayer requests | Submit at `/prayer-request` | Review, mark answered/archived |
| Visitors | Registration form | Review follow-ups |
| Contact | Contact form | **Contact Messages** inbox |
| Giving | Information only (no online payments) | Record tithes/offerings, CSV export |

## First-time setup (technical volunteer)

1. Copy `.env.example` to `.env.local` and set:
   - `MONGODB_URI` — MongoDB Atlas connection string
   - `NEXTAUTH_SECRET` — at least 32 random characters (unique per environment)
   - `NEXTAUTH_URL` — e.g. `http://localhost:3001` locally, or your live URL in production
2. Create the first admin: set `ADMIN_EMAIL`, `ADMIN_PASSWORD` (12+ chars), `ADMIN_NAME`, then run `npm run seed`.
3. Start locally: `npm install` then `npm run dev` → open [http://localhost:3001](http://localhost:3001).
4. Deploy to [Vercel](https://vercel.com) with the same environment variables; whitelist MongoDB network access for the host.

## Daily staff workflows

### Public service schedule

- Sunday service: **9:00 AM–12:30 PM**
- Morning prayer (Nibature): **Monday–Friday, 5:00–7:00 AM**
- Tuesday prayer: **10:30 AM–4:00 PM**
- Friday service: **5:00–8:30 PM**

Times are shown in Rwanda local time.

### Admin login

- Go to **Staff Login** in the site menu or `/admin/login`.
- Use the email and password created during seeding (or provided by your IT volunteer).
- Members who sign in at `/account` are **not** admins and cannot change church data.

### Dashboard

- Overview counts for sermons, events, members, giving total, pending prayer requests, and new contact messages.
- Click any card to open that section.

### Announcements on the home page

- Admin → **Announcements** → create an item and set **Active** so it appears on the home page.

### Events and RSVPs

- Admin → **Events** → add date, time, location, description.
- Public users open the event and submit **RSVP** (name, email, guests).
- Admin → **Events** → **RSVPs** on a card to see who is coming.

### Members

- **Admin-added members**: Admin → **Members** → Add Member (set **division**: Children, Youth, Women, Men, General and **church roles** such as Usher, Choir Member, Media Team Member).
- **Families**: Admin → **Families** — group parents, youth, and children in one household (children without email stay on the family record only).
- **Member login** (`/account` or **Member Portal** in the menu):
  1. **Sign in** with email + password if they already created an account.
  2. **Create account** if new — use the same email the church office has on file; the system will **link** to an existing member record when the email matches.
  3. **Staff** use **Staff Login** (`/admin/login`), not the member form.
- **Export**: **Export CSV** on the Members page.

### Attendance, milestones, reports

- **Attendance**: Admin → **Attendance** — record Sunday services, youth meetings, etc.
- **Milestones & Care**: baptisms, dedications, pastoral visits (admin only).
- **Reports**: division counts, role counts, giving summaries.

### Giving

- Record each gift with name, amount (RWF), purpose, and date.
- **Export CSV** for finance reconciliation (no payment gateway is built in).

### Prayer requests

- Pastoral team: Pastors Jacques, Agnes, Dieudonne, and Marcelin. Check the inbox regularly and aim to respond within **24–48 hours** where possible.
- Prayer request access is restricted to staff accounts whose email addresses are listed in `PASTORAL_TEAM_EMAILS` in the production environment.
- Update status to **In Progress**, **Completed**, or **Archived** when handled.

### Contact messages

- Owner: **Byumvuhore Frederic**; backup: **Wihogora Florissa**. Check every working day and aim to respond within **24–48 hours** where possible.
- Admin → **Contact Messages** — read and delete after follow-up.

### Visitor registrations

- Owner: **Byumvuhore Frederic**; backup: **Wihogora Florissa**. Check every working day and aim to respond within **24–48 hours** where possible.
- Admin → **Visitors** — review each registration and follow up only when the visitor asks for it.

### Notifications

- SMS alerts are requested but are not active yet. Configure an SMS provider and add the authorized recipients’ phone numbers before relying on alerts. Until then, staff should check the admin inboxes on the schedule above.

### Member privacy

- The public site does not display a member directory. Member profiles are available to the member after sign-in and to authorized staff.
- Birthdays are private by default. Members aged 16 or older can opt in from **Member Portal → My Profile → Edit**. Only their first name and month/day are shown to signed-in members; the public homepage does not show birthdays.
- Prayer requests are limited to the configured pastoral team accounts.
- The site’s privacy notice is a draft until the production data host/location, DPO contact channel, and post-resolution retention rule are confirmed.
- The church has identified **Byumvuhore Frederic** as its Data Protection Officer and reports that registration is complete; a public contact channel for the DPO is still needed.

## Customizing church details

Update these files when address, phone, or service times change:

- `components/Footer.tsx`
- `app/contact/page.tsx`
- `app/page.tsx` (hero service times)

Optional hero photos: place images in `public/images/` and update the home page slide list in `app/page.tsx`.
Ministry photos can be added through Admin → **Ministries** by setting a photo path after the image has been added to `public/images/`.

## Security reminders

- Never commit `.env.local` or share `NEXTAUTH_SECRET`.
- Use strong unique admin passwords; rotate if shared during setup.
- Only trusted staff should have admin accounts.

## Support and future enhancements

Built-in but not included yet: online payments, email/SMS notifications, password reset email, live streaming embeds. These can be added in a later phase with your hosting and email provider.

For technical issues, contact whoever deployed the site or open an issue in the project repository.
