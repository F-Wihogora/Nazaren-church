# Quick Start Guide

## 🚀 Getting Up and Running in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment Variables
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/nazarene-church
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-key-here
```

**For MongoDB Atlas (Cloud):**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Replace `MONGODB_URI` with your Atlas connection string

### Step 3: Start MongoDB (if using local MongoDB)
If you're using local MongoDB, make sure it's running:
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
# Start MongoDB service from Services panel
```

### Step 4: Create Admin User
```bash
npm run seed-admin
```

This creates an admin user with:
- Email: `admin@nazarenechurch.com`
- Password: `admin123`

**⚠️ Change this password immediately after first login!**

### Step 5: Start Development Server
```bash
npm run dev
```

### Step 6: Open Your Browser
Navigate to [http://localhost:3000](http://localhost:3000)

### Step 7: Access Admin Dashboard
1. Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Login with the credentials from Step 4
3. Start managing your church website!

## 📝 Next Steps

1. **Customize Church Information**
   - Update contact details in `components/Footer.tsx`
   - Update service times in `app/page.tsx`
   - Add your church address in `app/contact/page.tsx`

2. **Add Content**
   - Create your first sermon in Admin → Sermons
   - Add upcoming events in Admin → Events
   - Create announcements in Admin → Announcements

3. **Set Up Members**
   - Add church members in Admin → Members
   - Create ministries in Admin → Ministries
   - Link members to ministries

4. **Customize Design** (Optional)
   - Edit colors in `app/globals.css`
   - Update logo/branding in `components/Navbar.tsx`

## 🎨 Features Overview

### Public Pages
- **Home**: Hero section, latest sermons, events, announcements
- **Sermons**: Browse and filter all sermons
- **Events**: View upcoming church events
- **About**: Mission, vision, leadership
- **Contact**: Contact form and church info
- **Prayer Request**: Public form for prayer requests
- **Visitor Registration**: Form for new visitors

### Admin Dashboard
- **Dashboard**: Overview statistics
- **Sermons**: Manage all sermons (CRUD)
- **Events**: Manage church events (CRUD)
- **Members**: Complete member database with search
- **Ministries**: Manage church ministries
- **Announcements**: Create weekly announcements and Bible verses
- **Prayer Requests**: View and manage prayer requests
- **Visitors**: View visitor registrations
- **Giving Records**: Track donations
- **Small Groups**: Manage home cells/small groups

## 🔒 Security Notes

1. **Change Default Admin Password**: Immediately after first login
2. **Use Strong NEXTAUTH_SECRET**: Generate a random string for production
3. **Secure MongoDB**: Use MongoDB Atlas with proper authentication
4. **Environment Variables**: Never commit `.env.local` to git

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running (local) or connection string is correct (Atlas)
- Verify `MONGODB_URI` in `.env.local`
- For Atlas: Check IP whitelist and database user permissions

### Admin Login Not Working
- Make sure you ran `npm run seed-admin`
- Check MongoDB connection
- Verify admin user exists in database

### Build Errors
- Delete `node_modules` and `.next` folder
- Run `npm install` again
- Check Node.js version (should be 18+)

## 📚 Need Help?

Check the full [README.md](./README.md) for detailed documentation.

---

Happy building! 🙏

