# Vercel Deployment Guide

## ✅ Pre-Deployment Checklist

### Build Status
- ✅ **TypeScript compilation**: No errors
- ✅ **Production build**: Successful (339.36 kB)
- ✅ **Webhook API**: Tested and working
- ✅ **File uploads**: Verified with multipart/form-data
- ✅ **n8n integration**: Google Drive file creation confirmed

### Code Quality
- ✅ All components render without errors
- ✅ Form validation working
- ✅ File upload progress tracking implemented
- ✅ Responsive design across breakpoints
- ✅ Light/dark mode support with semantic tokens

---

## 🚀 Vercel Deployment Steps

### 1. Initial Setup

#### Option A: Deploy via Vercel CLI
```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

#### Option B: Deploy via GitHub Integration

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel auto-detects Vite configuration
   - Click "Deploy"

### 2. Configuration

Vercel will automatically:
- ✅ Detect **Vite** framework
- ✅ Use build command: `npm run build`
- ✅ Set output directory: `dist`
- ✅ Configure Node.js version: 18.x

**Critical: SPA Routing Configuration**

The `vercel.json` file must include:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "rewrites": [
    {
      "source": "/((?!api).*)",
      "destination": "/index.html"
    }
  ]
}
```

**Why this matters:**
- ✅ Enables clean URLs (`/history` vs `/#/history`)
- ✅ Page refreshes work on any route
- ✅ Direct URL navigation works
- ✅ API routes (`/api/*`) are not intercepted
- ✅ Backward compatible with old hash URLs (auto-migrate)

**Important Files:**
- `vercel.json` - Deployment and routing configuration
- `api/webhook.js` - Serverless function for CORS proxy
- `api/middleware/rbac.ts` - Authentication middleware
- `.vercelignore` - Excludes test files and docs

---

## 🔧 Environment Configuration

### Production Environment Variables

**No environment variables required!** 🎉

The app uses:
- Direct n8n webhook URL (no secrets needed)
- Client-side file processing
- Public API endpoint

### Webhook Endpoint Detection

The app automatically switches between dev and production:

```typescript
const WEBHOOK_URL = import.meta.env.DEV 
  ? '/api'                    // Dev: Vite proxy → n8n
  : '/api/webhook';           // Prod: Vercel function → n8n
```

---

## 📡 API Routes (Serverless Functions)

### `/api/webhook.js`

**Purpose:** CORS proxy for n8n webhook in production

**Configuration:**
```javascript
export const config = {
  api: {
    bodyParser: false,  // Required for file uploads
  },
};
```

**Function:**
- Receives POST requests with multipart/form-data
- Streams data to n8n webhook
- Returns n8n response to client
- Handles CORS automatically

**Endpoint:** `https://your-domain.vercel.app/api/webhook`

---

## 🌐 Domain Configuration

### Default Domain
After deployment, Vercel provides:
```
https://ap-intake-[random].vercel.app
```

### Custom Domain (Optional)

1. **Add domain in Vercel dashboard:**
   - Project Settings → Domains
   - Add your domain (e.g., `intake.yourcompany.com`)

2. **Configure DNS:**
   ```
   Type: CNAME
   Name: intake (or @)
   Value: cname.vercel-dns.com
   ```

3. **SSL:** Auto-configured by Vercel

---

## 📊 Build Output Analysis

### Production Build Stats
```
dist/index.html                   0.46 kB │ gzip:   0.29 kB
dist/assets/index-[hash].css     20.50 kB │ gzip:   4.74 kB
dist/assets/index-[hash].js     339.36 kB │ gzip: 108.21 kB
```

**Bundle Size:** Excellent ✅
- Total: ~360 kB (uncompressed)
- Gzipped: ~113 kB
- Well within Vercel's limits

### Dependencies Included
- React 19.2.0
- Radix UI components (Accordion, Select, Checkbox, Progress)
- Lucide icons
- Tailwind CSS
- Form handling & file uploads

---

## 🧪 Post-Deployment Testing

### 1. Verify Deployment URL
```bash
curl https://your-domain.vercel.app
# Should return HTML with status 200
```

### 2. Test API Endpoint
```bash
curl -X POST https://your-domain.vercel.app/api/webhook \
  -H "Content-Type: multipart/form-data" \
  -F "companyName=Test Co" \
  -F "projectName=Test Project"
```

### 3. Browser Testing Checklist

Open your deployed URL and verify:

- [ ] Form loads correctly
- [ ] All sections expand/collapse smoothly
- [ ] Client Information section animates properly
- [ ] File upload drag & drop works
- [ ] File upload progress shows during submission
- [ ] "Generate summary with Ai" checkbox disables textarea
- [ ] Form submission works (check Network tab)
- [ ] Success message appears after submission
- [ ] Responsive design works on mobile

### 4. Test Form Submission

Use browser DevTools:

1. **Open Network tab**
2. **Fill out form** with test data
3. **Upload a test file** (any CAD or PDF file)
4. **Submit form**
5. **Verify:**
   - Request URL: `https://your-domain.vercel.app/api/webhook`
   - Method: POST
   - Status: 200 OK
   - Response: JSON with Google Drive file metadata

### 5. Verify n8n Workflow

After submission, check:
- Google Drive folder for new `job-spec.md` file
- File contains all form data
- File has proper permissions
- Response includes `webViewLink`

---

## 🔍 Monitoring & Debugging

### Vercel Dashboard

**Access logs:**
1. Go to your project in Vercel
2. Click "Deployments"
3. Select latest deployment
4. View "Functions" tab for API logs

**Key metrics:**
- Build time (~1-2 seconds)
- Function executions
- Error rate
- Response times

### Common Issues & Solutions

#### Issue: Build Fails
**Solution:**
```bash
# Test build locally first
npm run build

# Check for TypeScript errors
npm run lint
```

#### Issue: API Returns 404
**Solution:**
- Ensure `api/webhook.js` exists
- Check Vercel function logs
- Verify endpoint is `/api/webhook` not `/api`

#### Issue: CORS Errors
**Solution:**
- Production uses Vercel function (no CORS issues)
- If seeing CORS errors, clear browser cache
- Check that request goes to `/api/webhook`

#### Issue: File Upload Fails
**Solution:**
- Check file size limits (Vercel: 4.5 MB default)
- Verify Content-Type: multipart/form-data
- Check n8n webhook can handle files

#### Issue: Slow Upload
**Solution:**
- Large files take time (expected)
- Progress bar shows status
- Consider chunked uploads for files >50MB

---

## 📈 Performance Optimization

### Already Optimized ✅

1. **Code Splitting:** Vite automatically chunks vendors
2. **Tree Shaking:** Unused code removed
3. **Minification:** Production build minified
4. **Compression:** Vercel serves gzip/brotli
5. **CDN:** Global edge network
6. **Caching:** Static assets cached at edge

### Optional Enhancements

#### 1. Image Optimization
If adding images later:
```javascript
import { ImageResponse } from '@vercel/og'
```

#### 2. Analytics
Add Vercel Analytics:
```bash
npm install @vercel/analytics
```

```javascript
import { Analytics } from '@vercel/analytics/react'

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  )
}
```

#### 3. Edge Functions
For faster global response:
```javascript
export const config = {
  runtime: 'edge',
}
```

---

## 🔒 Security Considerations

### Current Security Features ✅

1. **No API Keys Exposed:** Client-side only
2. **HTTPS Only:** Enforced by Vercel
3. **Content Security Policy:** Set by n8n response
4. **File Type Validation:** Client-side filtering
5. **CORS Handled:** Via serverless function

### Recommendations

#### 1. Rate Limiting (Optional)
Add to `api/webhook.js`:
```javascript
import { rateLimit } from '@/lib/rate-limit'

export default async function handler(req, res) {
  try {
    await rateLimit(req)
    // ... existing code
  } catch (error) {
    return res.status(429).json({ error: 'Too many requests' })
  }
}
```

#### 2. File Size Limits
Already handled by:
- Browser: User can see file size before upload
- n8n: Configurable limits on webhook
- Vercel: 4.5 MB payload limit (hobby), 100 MB (pro)

#### 3. Input Validation
Currently:
- Required fields enforced (HTML5)
- File type restrictions (client-side)
- Consider adding server-side validation in n8n

---

## 🚦 Deployment Workflow

### Continuous Deployment (Recommended)

**Automatic deployments on push:**

```bash
# Make changes
git add .
git commit -m "Update form styling"
git push origin main

# Vercel automatically:
# 1. Detects push
# 2. Runs build
# 3. Deploys to production
# 4. Updates domain
```

### Preview Deployments

**Every branch/PR gets a preview URL:**

```bash
git checkout -b feature/new-section
git push origin feature/new-section

# Vercel creates:
# https://ap-intake-[branch]-[random].vercel.app
```

**Benefits:**
- Test before merging
- Share with stakeholders
- No impact on production

---

## 📋 Deployment Checklist

### Before First Deploy

- [x] Build succeeds locally
- [x] All tests pass
- [x] Webhook endpoint tested
- [x] `vercel.json` configured
- [x] `api/webhook.js` exists
- [x] `.vercelignore` excludes test files
- [x] No sensitive data in code
- [x] Git repository clean

### After Deploy

- [ ] Deployment successful (check Vercel dashboard)
- [ ] Site loads at production URL
- [ ] Form renders correctly
- [ ] API endpoint responds
- [ ] File upload works
- [ ] Form submission succeeds
- [ ] n8n workflow executes
- [ ] Google Drive file created
- [ ] Mobile responsive (test on phone)
- [ ] All animations smooth
- [ ] No console errors

### Optional (Nice to Have)

- [ ] Custom domain configured
- [ ] Analytics enabled
- [ ] Error monitoring (Sentry)
- [ ] Performance monitoring
- [ ] Backup/rollback plan documented

---

## 🎯 Production URL

Once deployed, your form will be available at:
```
https://ap-intake-[your-id].vercel.app
```

Or with custom domain:
```
https://intake.yourcompany.com
```

---

## 📞 Support Resources

### Vercel Documentation
- Deployment: https://vercel.com/docs/deployments/overview
- Serverless Functions: https://vercel.com/docs/functions
- Vite Guide: https://vercel.com/docs/frameworks/vite

### Project-Specific Docs
- [WEBHOOK_TEST_RESULTS.md](./WEBHOOK_TEST_RESULTS.md) - API testing details
- [FILE_UPLOAD_PROGRESS.md](./FILE_UPLOAD_PROGRESS.md) - Upload implementation
- [README.md](./README.md) - Project overview

### Contact
- Vercel Support: support@vercel.com
- n8n Community: https://community.n8n.io

---

## ✅ Ready to Deploy!

Your application is production-ready with:
- ✅ Clean build
- ✅ Working API integration
- ✅ File upload support
- ✅ Progress tracking
- ✅ Responsive design
- ✅ Error handling
- ✅ Serverless proxy configured

**Deploy command:**
```bash
vercel --prod
```

🚀 **Your manufacturing intake form is ready for production!**
