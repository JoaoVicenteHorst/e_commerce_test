# Deployment Guide: Vercel + Render PostgreSQL

This guide will help you deploy your e-commerce application to Vercel (frontend/backend) with a PostgreSQL database on Render.

## Why PostgreSQL Instead of SQLite?

Vercel uses serverless functions which don't support file-based databases like SQLite. PostgreSQL is a production-ready database that works perfectly with Vercel.

---

## Part 1: Setup PostgreSQL on Render

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up for a free account
3. Verify your email

### Step 2: Create PostgreSQL Database
1. Click **"New +"** → **"PostgreSQL"**
2. Fill in the details:
   - **Name:** `ecommerce-db` (or your preferred name)
   - **Database:** `ecommerce`
   - **User:** `ecommerce_user`
   - **Region:** Choose closest to your users
   - **Instance Type:** **Free** (for testing)
3. Click **"Create Database"**
4. Wait 1-2 minutes for database to be created

### Step 3: Get Database Connection String
1. Once created, click on your database
2. Scroll down to **"Connections"** section
3. Copy the **"External Database URL"** - it looks like:
   ```
   postgresql://username:password@hostname:port/database
   ```
4. **Save this URL** - you'll need it for both local development and Vercel

---

## Part 2: Update Your Project for PostgreSQL

### Step 1: Update Prisma Schema

Open `prisma/schema.prisma` and update the datasource:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Step 2: Update Environment Variables

Create/update `.env.local` (this file is gitignored):

```bash
DATABASE_URL="your-render-postgres-url-here"
JWT_SECRET="your-secret-key-change-in-production"
```

**Important:** Replace `your-render-postgres-url-here` with the URL from Render.

### Step 3: Update Dependencies

The project already has Prisma, but let's ensure it's ready:

```bash
npm install
```

### Step 4: Push Schema to PostgreSQL

```bash
npm run prisma:generate
npm run prisma:push
```

### Step 5: Seed the Database

```bash
npm run prisma:seed
```

This creates your 3 demo users and 40 products on PostgreSQL.

### Step 6: Test Locally

```bash
npm run dev
```

Visit http://localhost:3000 and test that everything works with PostgreSQL.

---

## Part 3: Deploy to Vercel

### Step 1: Prepare for Deployment

1. Create `.env.local` (already done above)
2. Make sure `.gitignore` includes:
   ```
   .env
   .env*.local
   prisma/dev.db
   ```

### Step 2: Push to GitHub

1. Initialize git (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - E-commerce app"
   ```

2. Create a new repository on GitHub
3. Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/your-repo.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login (use GitHub account)
3. Click **"Add New..."** → **"Project"**
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### Step 4: Add Environment Variables on Vercel

In the Vercel project settings, add these environment variables:

1. Click **"Environment Variables"** tab
2. Add:
   - **Key:** `DATABASE_URL`
   - **Value:** Your Render PostgreSQL URL
   - **Environments:** Production, Preview, Development

3. Add:
   - **Key:** `JWT_SECRET`
   - **Value:** A secure random string (generate one!)
   - **Environments:** Production, Preview, Development

**Generate a secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for deployment
3. Vercel will give you a URL like: `https://your-app.vercel.app`

### Step 6: Initialize Production Database

After first deployment, you need to seed the production database:

**Option A: Using Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel env pull .env.production
npm run prisma:seed
```

**Option B: Run seed script manually**
1. Go to your Vercel project dashboard
2. Go to **Settings** → **Functions**
3. Create a temporary API route to seed:

Create `app/api/admin/seed/route.ts`:
```typescript
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  // Add a secret key check for security
  const { secret } = await request.json();
  
  if (secret !== process.env.JWT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Your seed logic here (copy from prisma/seed.ts)
    // ... seed users and products ...
    
    return NextResponse.json({ success: true, message: 'Database seeded' });
  } catch (error) {
    return NextResponse.json({ error: 'Seeding failed' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
```

Then call it once:
```bash
curl -X POST https://your-app.vercel.app/api/admin/seed \
  -H "Content-Type: application/json" \
  -d '{"secret": "your-jwt-secret"}'
```

**Delete this route after seeding for security!**

---

## Part 4: Verify Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Test login with demo credentials:
   - Admin: `admin@example.com` / `password123`
   - Manager: `manager@example.com` / `password123`
   - User: `user@example.com` / `password123`
3. Test creating products (as Admin/Manager)
4. Test creating users (as Admin/Manager)
5. Test profile updates

---

## Troubleshooting

### Database Connection Issues

**Error:** "Can't reach database server"
- Check your DATABASE_URL is correct in Vercel environment variables
- Ensure Render PostgreSQL is running (check Render dashboard)
- Verify the database allows external connections

**Solution:**
```bash
# Test connection locally first
npx prisma db push
```

### Build Failures

**Error:** "Module not found" or TypeScript errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall: `rm -rf node_modules && npm install`
- Try building locally: `npm run build`

### Prisma Client Issues

**Error:** "PrismaClient is unable to run in the browser"
- Make sure you're not importing Prisma in client components
- Use `'use client'` directive properly
- API routes should handle all database operations

**Fix:** Add to `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      '@prisma/client': 'commonjs @prisma/client'
    });
    return config;
  },
}

module.exports = nextConfig
```

### Environment Variables Not Working

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Make sure variables are set for all environments
3. Redeploy after adding variables

---

## Alternative: Deploy Database to Vercel Postgres

Instead of Render, you can use Vercel's built-in PostgreSQL:

1. In Vercel dashboard, go to **Storage** tab
2. Create **Postgres** database
3. Copy connection strings to environment variables
4. Vercel automatically adds `POSTGRES_URL` variable
5. Use `POSTGRES_URL` as your `DATABASE_URL`

**Pros:**
- Integrated with Vercel
- Automatic connection strings
- Same dashboard

**Cons:**
- Paid feature (free tier limited)
- Render free tier might be more generous

---

## Production Checklist

- [ ] PostgreSQL database created on Render
- [ ] Database seeded with initial data
- [ ] Environment variables set on Vercel
- [ ] JWT_SECRET is secure (not "your-secret-key")
- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel successfully
- [ ] Login/Register tested on production
- [ ] CRUD operations tested
- [ ] Admin/Manager/User roles working
- [ ] `.env` and `.env.local` in `.gitignore`
- [ ] Remove seed API route if created

---

## Monitoring

### Vercel
- **Analytics:** View traffic and performance
- **Logs:** Real-time function logs
- **Deployments:** History of all deployments

### Render
- **Metrics:** Database performance
- **Logs:** Database logs
- **Backups:** Configure automatic backups (paid)

---

## Updating Your App

Whenever you push to GitHub:
1. Vercel automatically rebuilds and deploys
2. Schema changes require manual migration:
   ```bash
   # Make schema changes
   npm run prisma:generate
   npm run prisma:push
   ```

---

## Cost Breakdown

### Free Tier
- **Vercel:** Free for personal projects, unlimited deployments
- **Render:** Free tier includes PostgreSQL with limitations
- **Total:** $0/month for hobby projects

### Paid Upgrades (Optional)
- **Vercel Pro:** $20/month (better performance, team features)
- **Render:** $7/month (more database resources, backups)

---

## Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **Next.js Docs:** https://nextjs.org/docs

---

## Security Reminders

1. ✅ Never commit `.env` files
2. ✅ Use strong JWT_SECRET in production
3. ✅ Regularly update dependencies
4. ✅ Monitor Vercel logs for suspicious activity
5. ✅ Use Render's backup features for database
6. ✅ Enable 2FA on Vercel and Render accounts

