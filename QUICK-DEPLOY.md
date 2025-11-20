# Quick Deploy Checklist

Follow these steps in order to deploy your e-commerce app to Vercel + Render.

## ✅ Step-by-Step Deployment

### 1️⃣ Create Render PostgreSQL Database (5 minutes)

1. Go to https://render.com and sign up
2. Click **"New +"** → **"PostgreSQL"**
3. Settings:
   - Name: `ecommerce-db`
   - Database: `ecommerce`
   - Region: Choose closest to you
   - Plan: **Free**
4. Click **"Create Database"**
5. **COPY** the "External Database URL" (looks like `postgresql://user:pass@host/db`)

### 2️⃣ Update Your Local Project (2 minutes)

The `prisma/schema.prisma` has already been updated to use PostgreSQL.

Create `.env.local` file:
```bash
DATABASE_URL="paste-your-render-database-url-here"
JWT_SECRET="your-secret-key-change-in-production"
```

### 3️⃣ Test Locally with PostgreSQL (3 minutes)

```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
npm run dev
```

Visit http://localhost:3000 and test login.

### 4️⃣ Push to GitHub (2 minutes)

```bash
git init
git add .
git commit -m "Ready for deployment"
```

Create repo on GitHub, then:
```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git branch -M main
git push -u origin main
```

### 5️⃣ Deploy to Vercel (5 minutes)

1. Go to https://vercel.com and sign up
2. Click **"New Project"**
3. Import your GitHub repository
4. **Before deploying**, add Environment Variables:
   - Click **"Environment Variables"**
   - Add `DATABASE_URL` = your Render PostgreSQL URL
   - Add `JWT_SECRET` = a secure random string
5. Click **"Deploy"**
6. Wait 2-3 minutes

### 6️⃣ Seed Production Database (1 minute)

After deployment completes, seed your production database **from your local machine**:

Make sure `.env.local` has your production database URL:
```bash
DATABASE_URL="your-render-postgres-url"
JWT_SECRET="your-jwt-secret"
```

Then run:
```bash
npm run seed:production
```

You should see: `✅ Created 3 users` and `✅ Created 40 products`

### 7️⃣ Test Your Live App! 🎉

1. Visit your Vercel URL: `https://YOUR-APP.vercel.app`
2. Login with:
   - Admin: `admin@example.com` / `password123`
   - Manager: `manager@example.com` / `password123`
   - User: `user@example.com` / `password123`

---

## 📝 Command Summary

```bash
# Local PostgreSQL setup
npm run prisma:generate
npm run prisma:push
npm run prisma:seed

# Git setup
git init
git add .
git commit -m "Ready for deployment"
git remote add origin YOUR-GITHUB-REPO-URL
git push -u origin main

# Seed production (after Vercel deployment - run locally)
npm run seed:production
```

---

## 🔧 Generate Secure JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## ⚠️ Common Issues

**"Can't reach database"**
- Double-check DATABASE_URL in Vercel environment variables
- Make sure you copied the EXTERNAL database URL from Render

**"Seeding failed"**
- Check JWT_SECRET matches in both request and Vercel environment
- Verify database is running in Render dashboard

**Build failed**
- Run `npm run build` locally first to catch errors
- Check Vercel logs for specific error messages

---

## 🎯 What You Get

✅ Live e-commerce store at `your-app.vercel.app`
✅ PostgreSQL database on Render (free tier)
✅ 40 products (15 with 15% discount)
✅ 3 demo user accounts
✅ Full CRUD operations
✅ Role-based access control
✅ Automatic deployments on git push

---

## 💰 Cost

**Free Forever:**
- Vercel: Unlimited deployments
- Render: PostgreSQL free tier (sufficient for demo/small projects)
- **Total: $0/month**

---

## 🚀 Next Steps After Deployment

- [ ] Change default user passwords
- [ ] Add your own products
- [ ] Customize branding/colors
- [ ] Add shopping cart
- [ ] Integrate payment (Stripe)
- [ ] Set up custom domain

