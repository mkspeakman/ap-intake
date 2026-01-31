# Testing Checklist

**MANDATORY**: Complete this checklist before every commit that affects functionality.

## Pre-Commit Testing

### Build & Compilation
- [ ] `npm run build` - succeeds without errors
- [ ] `npx tsc --noEmit` - no TypeScript errors
- [ ] No console errors in terminal output

### Local Testing (Preview Build)
```bash
npm run build
npm run preview
# Open http://localhost:4173
```

### Core Functionality Tests

#### Navigation & Routing
- [ ] Click logo → goes to home (`/`)
- [ ] Click "History" button → navigates to `/history` AND view updates
- [ ] Click "New Request" button → navigates to `/` AND view updates
- [ ] Browser back button → returns to previous route AND view updates
- [ ] Browser forward button → advances to next route AND view updates
- [ ] Manual URL entry → `/history` → loads correct view
- [ ] Page refresh on `/history` → stays on `/history`, doesn't 404
- [ ] Page refresh on `/users` → stays on `/users`, doesn't 404
- [ ] Legacy hash URL `/#/history` → redirects to `/history`

#### Authentication
- [ ] Login modal opens when clicking user icon (not logged in)
- [ ] Login with valid credentials → success
- [ ] User info displays in header dropdown
- [ ] Logout → clears user state, returns to home
- [ ] Protected routes redirect when not authenticated
- [ ] Role-based menu items show/hide correctly

#### Quote Form (Home `/`)
- [ ] Form renders completely
- [ ] All sections expand/collapse
- [ ] Required field validation works
- [ ] File upload works (if testing with backend)
- [ ] Form submission works (if testing with backend)

#### History View (`/history`)
- [ ] Requires authentication → redirects if not logged in
- [ ] Requires `canViewHistory` permission
- [ ] Table renders with data (if testing with backend)
- [ ] Filters work (if applicable)

#### User Management (`/users`)
- [ ] Requires admin/superadmin role → redirects otherwise
- [ ] User list displays
- [ ] Add user modal opens
- [ ] Edit user modal opens
- [ ] Settings menu (superadmin only)

### API Routes (if testing with vercel dev)
```bash
# Terminal 1: vercel dev
# Terminal 2: test API
curl http://localhost:3000/api/quote-requests
curl -X POST http://localhost:3000/api/auth/login -d '{"email":"admin@example.com","password":"password123"}' -H "Content-Type: application/json"
```

- [ ] `/api/auth/login` - returns user object
- [ ] `/api/quote-requests` - returns data or error
- [ ] `/api/admin/users` - requires auth header
- [ ] API routes don't return `index.html` (not caught by SPA rewrite)

### Responsive Design
- [ ] Desktop (1920x1080) - layout looks correct
- [ ] Tablet (768px) - responsive layout
- [ ] Mobile (375px) - mobile layout

### Browser Compatibility
- [ ] Chrome/Edge - works
- [ ] Firefox - works (optional for speed)
- [ ] Safari - works (optional for speed)

## Pre-Push Checklist

- [ ] All functionality tests passed
- [ ] No `console.log` statements (except error handling)
- [ ] Git commit message is descriptive
- [ ] Changes are documented in relevant .md files
- [ ] Breaking changes are noted

## Pre-Deploy Checklist (Before `git push`)

- [ ] All pre-commit tests passed
- [ ] Database migrations documented (if applicable)
- [ ] Environment variables documented (if new ones added)
- [ ] README.md updated (if architecture changed)
- [ ] No sensitive data in code (API keys, passwords, etc.)

## Post-Deploy Verification (After Vercel Deploy)

Wait for deployment to complete (~30-60 seconds), then test production:

### Production Smoke Tests
```bash
# Get deployment URL from Vercel
vercel ls
```

- [ ] Visit production URL - site loads
- [ ] Homepage renders correctly
- [ ] Login works
- [ ] Navigation works (click through all routes)
- [ ] API endpoints respond correctly
- [ ] No console errors in browser DevTools

### Production Critical Path
1. [ ] Load homepage
2. [ ] Click "History" → view updates, URL is `/history`
3. [ ] Refresh page → stays on `/history`
4. [ ] Login → authentication works
5. [ ] Navigate to `/users` (if admin) → loads correctly
6. [ ] Logout → returns to home

### Rollback Plan
If any critical tests fail:
```bash
# Option 1: Revert last commit
git revert HEAD
git push origin main

# Option 2: Redeploy previous working commit
vercel --prod --yes <previous-commit-sha>
```

## Automated Testing (Recommended Future)

### Unit Tests
```bash
npm run test:unit  # Not yet implemented
```

### Integration Tests
```bash
npm run test:integration  # Not yet implemented
```

### E2E Tests
```bash
npm run test:e2e  # Not yet implemented
```

## Testing Tools Setup (Recommended)

```bash
# Install testing tools
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D playwright @playwright/test

# Add test scripts to package.json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

## Testing Best Practices

1. **Test before committing** - Always run preview build
2. **Test navigation changes** - Click every route when touching Router/Layout
3. **Test auth changes** - Login/logout when touching AuthContext
4. **Test API changes** - Use curl/Postman before committing API changes
5. **Test on real data** - Use development database with realistic data
6. **Test edge cases** - Empty states, error states, loading states
7. **Test mobile** - Use Chrome DevTools device emulation
8. **Document test failures** - Add to this checklist if you find gaps

## Common Issues to Watch For

- ✅ Navigation doesn't update view (custom event not dispatched)
- ✅ Page refresh returns 404 (vercel.json rewrite missing)
- ✅ API routes return HTML (incorrect rewrite regex)
- ✅ TypeScript errors in build (not caught in dev mode)
- ✅ Import errors (relative paths, missing dependencies)
- ✅ Environment variables missing in production
- ✅ CORS errors (backend proxy configuration)
- ✅ Authentication loops (token validation issues)

---

**Last Updated**: January 30, 2026
**Next Review**: Before major feature releases
