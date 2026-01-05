# ChickenTinders - Deployment Guide

## ✅ Phase 1 Complete!

Your ChickenTinders project is now ready for deployment.

## 🚀 Deploy to Vercel

### Option 1: Using Vercel CLI (Recommended)

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N**
   - Project name? **chickentinders**
   - Directory? **.** (current directory)
   - Override settings? **N**

5. Your app will be deployed! You'll get a URL like: `https://chickentinders.vercel.app`

6. For production deployment:
   ```bash
   vercel --prod
   ```

### Option 2: Using Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your Git repository
3. Configure build settings:
   - **Framework Preset:** Other
   - **Build Command:** `npm run export`
   - **Output Directory:** `dist`
4. Click "Deploy"

## 🌐 Custom Domain Setup

Once deployed, add your custom domain:

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add `chickentinders.com`
4. Follow Vercel's DNS instructions

## 📦 What's Included

### ✅ Completed Features

- Expo project with TypeScript
- NativeWind v4 (Tailwind CSS)
- Expo Router with file-based routing
- Error boundaries
- Landing page with hero and CTA
- Privacy and Terms pages
- 404 page
- Meta tags for SEO and social sharing
- Vercel configuration
- Production-ready build

### 🎨 Design Assets

All your design files are ready:
- Logos in `/public`
- Mockups in `/design/mockups`
- Brand guidelines in `/design/LOGO-GUIDE.md`

## 🔧 Development Commands

```bash
# Start development server
npm start

# Start web development
npm run web

# Build for production
npm run export

# Test production build locally
npx serve dist
```

## 📋 Next Steps

Now that Phase 1 is complete, you can:

1. **Deploy to Vercel** (follow instructions above)
2. **Set up Supabase** for backend
3. **Build the Create Group page** (Phase 2)
4. **Implement the Lobby** (Phase 3)
5. **Build the swipe interface** (Phase 4)

See [The Plan.md](The%20Plan.md) for detailed implementation phases.

## 🔑 Environment Variables

When deploying, add these environment variables in Vercel:

```
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Copy `.env.local.example` to `.env.local` for local development.

## 🐛 Troubleshooting

**Build fails:**
- Clear cache: `npx expo start -c`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

**Styles not working:**
- Make sure `global.css` is imported in `app/_layout.tsx`
- Check that Tailwind classes are in the `content` array in `tailwind.config.js`

**Routes not working:**
- Verify file structure in `/app` folder
- Check that files have proper exports

## 📊 Current Status

- **Design:** ✅ Complete
- **Setup:** ✅ Complete
- **Landing Page:** ✅ Complete
- **Build Pipeline:** ✅ Working
- **Deployment Config:** ✅ Ready
- **Development:** 🔄 Ready to continue with Phase 2

---

**You're ready to go viral!** 🍗🚀
