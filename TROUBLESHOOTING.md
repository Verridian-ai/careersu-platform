# Troubleshooting Guide

## Common Issues and Solutions

This guide covers common problems you might encounter while developing or using CareerSU, along with their solutions.

---

## Table of Contents

- [Installation Issues](#installation-issues)
- [Development Server Issues](#development-server-issues)
- [Convex Backend Issues](#convex-backend-issues)
- [Build Issues](#build-issues)
- [TypeScript Issues](#typescript-issues)
- [Authentication Issues](#authentication-issues)
- [AI Feature Issues](#ai-feature-issues)
- [Performance Issues](#performance-issues)
- [Database Issues](#database-issues)
- [Deployment Issues](#deployment-issues)

---

## Installation Issues

### npm install fails with EACCES error

**Problem:**
```bash
npm ERR! Error: EACCES: permission denied
```

**Solution:**
```bash
# Fix npm permissions
sudo chown -R $USER ~/.npm
sudo chown -R $USER /usr/local/lib/node_modules

# Or use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

### npm install fails with network timeout

**Problem:**
```bash
npm ERR! network timeout
```

**Solutions:**
```bash
# Solution 1: Increase timeout
npm install --timeout=60000

# Solution 2: Use different registry
npm config set registry https://registry.npmjs.org/

# Solution 3: Clear cache and retry
npm cache clean --force
npm install
```

### Dependency conflicts

**Problem:**
```bash
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions:**
```bash
# Solution 1: Use legacy peer deps
npm install --legacy-peer-deps

# Solution 2: Force install
npm install --force

# Solution 3: Clean install
rm -rf node_modules package-lock.json
npm install
```

---

## Development Server Issues

### Port 5173 already in use

**Problem:**
```bash
Error: Port 5173 is already in use
```

**Solutions:**
```bash
# Solution 1: Kill process on port
lsof -ti:5173 | xargs kill -9

# Solution 2: Use different port
npm run dev -- --port 3000

# Solution 3: Find and kill manually
lsof -i :5173
kill -9 <PID>
```

### Dev server starts but shows blank page

**Problem:**
- Server runs but page is blank
- Console shows errors

**Solutions:**

1. **Check browser console for errors**
   - Open DevTools (F12)
   - Look for red error messages
   - Fix reported errors

2. **Clear browser cache**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or clear cache in DevTools

3. **Check .env.local file**
   ```bash
   # Ensure these variables are set
   cat .env.local

   # Should contain:
   VITE_CONVEX_URL=https://...
   VITE_OPENAI_API_KEY=sk-...
   ```

4. **Restart dev server**
   ```bash
   # Kill server (Ctrl+C)
   # Clear cache
   rm -rf node_modules/.vite
   # Restart
   npm run dev
   ```

### Hot Module Replacement (HMR) not working

**Problem:**
- Changes don't reflect automatically
- Need to refresh manually

**Solutions:**
```bash
# Solution 1: Restart dev server
# Ctrl+C, then npm run dev

# Solution 2: Clear Vite cache
rm -rf node_modules/.vite
npm run dev

# Solution 3: Check file watching limits (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Slow dev server startup

**Problem:**
- Dev server takes 30+ seconds to start

**Solutions:**
```bash
# Solution 1: Exclude node_modules from file watcher
# Add to vite.config.ts:
server: {
  watch: {
    ignored: ['**/node_modules/**', '**/dist/**']
  }
}

# Solution 2: Use SWC instead of esbuild (faster)
npm install -D @vitejs/plugin-react-swc

# Update vite.config.ts:
import react from '@vitejs/plugin-react-swc'
```

---

## Convex Backend Issues

### Convex dev fails to start

**Problem:**
```bash
Error: Failed to start Convex dev server
```

**Solutions:**
```bash
# Solution 1: Clear Convex cache
rm -rf node_modules/.convex
npx convex dev

# Solution 2: Recreate project
npx convex dev --create-project

# Solution 3: Check Node version
node --version  # Should be 18+
nvm use 20

# Solution 4: Update Convex
npm update convex
```

### Schema validation errors

**Problem:**
```bash
Error: Schema validation failed
```

**Solutions:**

1. **Check schema syntax**
   ```typescript
   // Common mistakes:

   // ❌ Wrong: Missing validator
   myField: v.string,

   // ✅ Correct: With validator
   myField: v.string(),

   // ❌ Wrong: Invalid type
   myField: v.union(v.literal("a"), "b"),

   // ✅ Correct: All literals
   myField: v.union(v.literal("a"), v.literal("b")),
   ```

2. **Reset schema**
   ```bash
   # Save your schema first!
   npx convex dev --reset
   ```

3. **Check Convex dashboard**
   - Open https://dashboard.convex.dev/
   - View detailed error messages
   - Check data conflicts

### Functions not updating

**Problem:**
- Changes to Convex functions don't take effect

**Solutions:**
```bash
# Solution 1: Check Convex dev is running
# You should see "Watching for changes..." in terminal

# Solution 2: Restart Convex dev
# Ctrl+C in Convex terminal
npx convex dev

# Solution 3: Force push
npx convex dev --once
```

### Type generation errors

**Problem:**
```bash
Error: Failed to generate types
```

**Solutions:**
```bash
# Solution 1: Regenerate types
npx convex dev --codegen

# Solution 2: Check TypeScript version
npm list typescript
npm install -D typescript@latest

# Solution 3: Clean and regenerate
rm -rf convex/_generated
npx convex dev
```

---

## Build Issues

### Build fails with TypeScript errors

**Problem:**
```bash
npm run build
# Error: Type errors found
```

**Solutions:**

1. **Fix type errors**
   ```bash
   # Check errors
   npm run typecheck

   # Fix reported issues
   ```

2. **Temporary: Disable strict checks** (not recommended for production)
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "strict": false,
       "skipLibCheck": true
     }
   }
   ```

3. **Regenerate Convex types**
   ```bash
   npx convex dev --codegen
   npm run build
   ```

### Build succeeds but app doesn't work

**Problem:**
- `npm run build` succeeds
- Deployed app shows errors or blank page

**Solutions:**

1. **Test production build locally**
   ```bash
   npm run build
   npm run preview
   # Open http://localhost:4173
   ```

2. **Check environment variables**
   ```bash
   # Ensure production env vars are set
   # In Vercel/Netlify dashboard, not .env.local
   ```

3. **Check browser console**
   - Open deployed site
   - Check DevTools console for errors
   - Fix reported issues

### Bundle size too large

**Problem:**
```bash
# Build output shows:
dist/index.html                  0.46 kB
dist/assets/index-abc123.js  1,200.00 kB  # Too large!
```

**Solutions:**

1. **Analyze bundle**
   ```bash
   npm install -D rollup-plugin-visualizer
   npm run build
   # Opens visualization in browser
   ```

2. **Use code splitting**
   ```typescript
   // Lazy load heavy components
   const HeavyComponent = lazy(() => import('./HeavyComponent'));
   ```

3. **Remove unused dependencies**
   ```bash
   npm uninstall unused-package
   ```

4. **Use dynamic imports**
   ```typescript
   // Instead of:
   import _ from 'lodash';

   // Use specific imports:
   import debounce from 'lodash/debounce';
   ```

---

## TypeScript Issues

### Cannot find module errors

**Problem:**
```typescript
Cannot find module '@/components/ui/Button'
```

**Solutions:**

1. **Check path alias**
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

2. **Check file exists**
   ```bash
   ls src/components/ui/Button.tsx
   ```

3. **Check file casing**
   ```bash
   # ❌ Wrong
   import { Button } from '@/components/ui/button'

   # ✅ Correct (match actual filename)
   import { Button } from '@/components/ui/Button'
   ```

4. **Restart TypeScript server**
   - VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"

### Type 'undefined' error

**Problem:**
```typescript
const user = useQuery(api.users.getUser, { userId });
// Error: Object is possibly 'undefined'
```

**Solutions:**

1. **Add undefined check**
   ```typescript
   const user = useQuery(api.users.getUser, { userId });

   if (user === undefined) {
     return <Loading />;
   }

   // Now TypeScript knows user is defined
   return <div>{user.name}</div>;
   ```

2. **Use optional chaining**
   ```typescript
   const userName = user?.name ?? 'Unknown';
   ```

3. **Use non-null assertion** (only if you're sure)
   ```typescript
   const userName = user!.name;
   ```

---

## Authentication Issues

### Login doesn't work

**Problem:**
- Clicking login does nothing
- No error messages

**Solutions:**

1. **Check browser console**
   - Open DevTools (F12)
   - Look for JavaScript errors

2. **Verify demo credentials**
   ```typescript
   // In LoginPage.tsx, check demo accounts:
   email: "demo@example.com"
   password: "password123"
   ```

3. **Check Convex functions**
   ```bash
   # Open Convex dashboard
   npx convex dashboard

   # Check auth.login function logs
   ```

### Protected routes redirect to login

**Problem:**
- Can't access protected pages
- Always redirected to login

**Solutions:**

1. **Check auth state**
   ```typescript
   // In browser console:
   localStorage.getItem('auth')
   // Should show user object if logged in
   ```

2. **Check ProtectedRoute component**
   ```typescript
   // src/components/ProtectedRoute.tsx
   // Ensure auth check logic is correct
   ```

3. **Clear localStorage and retry**
   ```javascript
   // In browser console:
   localStorage.clear()
   // Then try logging in again
   ```

---

## AI Feature Issues

### OpenAI API errors

**Problem:**
```bash
Error: 401 Unauthorized
```

**Solutions:**

1. **Verify API key**
   ```bash
   cat .env.local | grep OPENAI
   # Should show: VITE_OPENAI_API_KEY=sk-...
   ```

2. **Check API key validity**
   - Go to https://platform.openai.com/api-keys
   - Verify key exists and is active
   - Create new key if needed

3. **Check API key format**
   ```env
   # ✅ Correct
   VITE_OPENAI_API_KEY=sk-proj-abc123...

   # ❌ Wrong (quotes not needed)
   VITE_OPENAI_API_KEY="sk-proj-abc123..."
   ```

### AI responses are slow

**Problem:**
- AI chat takes 10+ seconds to respond

**Solutions:**

1. **Switch to faster model**
   ```typescript
   // In convex/ai.ts
   model: "gpt-4o-mini"  // Faster than gpt-4
   ```

2. **Reduce context size**
   ```typescript
   // Limit retrieved documents
   const context = await searchDocs(query, 5);  // Instead of 10
   ```

3. **Check OpenAI status**
   - Visit https://status.openai.com/
   - Check for outages or degraded performance

### AI responses are inaccurate

**Problem:**
- AI gives wrong or irrelevant answers

**Solutions:**

1. **Improve prompts**
   ```typescript
   // Add more context and instructions
   const systemPrompt = `You are a career advisor.
   Always provide specific, actionable advice.
   Base your answers on the user's profile and documents.`;
   ```

2. **Check embeddings**
   ```bash
   # Verify embeddings are generated
   npx convex dashboard
   # Check embeddings table has data
   ```

3. **Regenerate embeddings**
   ```typescript
   // Call embedding generation for all documents
   await generateDocumentEmbedding(documentId);
   ```

---

## Performance Issues

### Page loads slowly

**Problem:**
- Page takes 5+ seconds to load

**Solutions:**

1. **Use lazy loading**
   ```typescript
   const HeavyPage = lazy(() => import('./pages/HeavyPage'));
   ```

2. **Optimize images**
   ```bash
   # Use WebP format
   # Compress images
   # Use appropriate sizes
   ```

3. **Check Lighthouse score**
   ```bash
   # In Chrome DevTools:
   # Lighthouse tab → Generate report
   # Fix reported issues
   ```

### React app freezes

**Problem:**
- UI becomes unresponsive
- Browser tab freezes

**Solutions:**

1. **Use React DevTools Profiler**
   - Identify slow components
   - Optimize re-renders

2. **Add memoization**
   ```typescript
   const expensiveValue = useMemo(() => {
     return computeExpensiveValue(data);
   }, [data]);

   const MemoizedComponent = memo(MyComponent);
   ```

3. **Use virtualization for long lists**
   ```bash
   npm install react-virtual
   ```

### Convex queries are slow

**Problem:**
- Queries take 1+ seconds

**Solutions:**

1. **Add indexes**
   ```typescript
   // In schema.ts
   .index("by_userId", ["userId"])
   ```

2. **Limit results**
   ```typescript
   const docs = await ctx.db
     .query("documents")
     .take(20);  // Don't load all
   ```

3. **Check Convex dashboard**
   - View query performance metrics
   - Identify slow queries

---

## Database Issues

### Data not updating in real-time

**Problem:**
- Changes don't appear immediately
- Need to refresh page

**Solutions:**

1. **Check Convex connection**
   ```typescript
   // In browser console:
   // Look for WebSocket connection
   ```

2. **Verify using useQuery**
   ```typescript
   // ✅ Correct: Auto-updates
   const docs = useQuery(api.documents.list);

   // ❌ Wrong: Static data
   const docs = await client.query(api.documents.list);
   ```

3. **Check subscription**
   ```bash
   # In Convex dashboard, verify:
   # - WebSocket connections active
   # - No connection errors
   ```

### Database query returns empty

**Problem:**
- Query returns empty array when data exists

**Solutions:**

1. **Check index usage**
   ```typescript
   // ✅ Using index
   .withIndex("by_userId", (q) => q.eq("userId", userId))

   // ❌ Wrong field name
   .withIndex("by_userId", (q) => q.eq("id", userId))
   ```

2. **Verify data exists**
   ```bash
   # Open Convex dashboard
   npx convex dashboard
   # Check table has data
   ```

3. **Check permissions**
   ```typescript
   // Ensure function doesn't filter out data
   // Check authorization logic
   ```

---

## Deployment Issues

### Vercel deployment fails

**Problem:**
```bash
Error: Build failed
```

**Solutions:**

1. **Check build locally**
   ```bash
   npm run build
   # Fix any errors before deploying
   ```

2. **Verify environment variables**
   - Go to Vercel dashboard
   - Settings → Environment Variables
   - Add all required variables:
     - `VITE_CONVEX_URL`
     - `VITE_OPENAI_API_KEY`
     - etc.

3. **Check build logs**
   - In Vercel dashboard
   - View detailed error messages
   - Fix reported issues

### Deployed app shows errors

**Problem:**
- Production app shows runtime errors
- Works fine locally

**Solutions:**

1. **Check browser console**
   ```bash
   # Open deployed site
   # DevTools → Console
   # Look for errors
   ```

2. **Verify environment variables**
   ```bash
   # Check all VITE_ variables are set in Vercel
   ```

3. **Test production build locally**
   ```bash
   npm run build
   npm run preview
   # Should match deployed behavior
   ```

### Convex deployment fails

**Problem:**
```bash
npx convex deploy
Error: Deployment failed
```

**Solutions:**

1. **Check Convex dashboard**
   - View deployment logs
   - Check for schema errors

2. **Validate schema locally**
   ```bash
   npx convex dev --once
   # Fix any schema errors
   ```

3. **Force redeploy**
   ```bash
   npx convex deploy --force
   ```

---

## Getting More Help

### Still stuck?

**Check these resources:**

1. **Documentation**
   - [README](./README.md)
   - [Developer Guide](./DEVELOPER_GUIDE.md)
   - [API Documentation](./API_DOCUMENTATION.md)

2. **Search Issues**
   - [GitHub Issues](https://github.com/your-org/careersu/issues)
   - Search for similar problems

3. **Ask for Help**
   - Open new GitHub issue
   - Include:
     - Problem description
     - Steps to reproduce
     - Error messages
     - Environment (OS, Node version, etc.)

4. **External Resources**
   - [Stack Overflow](https://stackoverflow.com/)
   - [Convex Discord](https://convex.dev/community)
   - [React Discord](https://discord.gg/react)

5. **Contact Team**
   - Email: team@careersu.com
   - Include detailed description

---

## Debug Checklist

When encountering issues, run through this checklist:

- [ ] Check browser console for errors
- [ ] Check terminal for error messages
- [ ] Verify environment variables are set
- [ ] Restart dev servers (Vite + Convex)
- [ ] Clear caches (browser, npm, Vite, Convex)
- [ ] Check Convex dashboard for backend errors
- [ ] Run `npm install` to ensure dependencies are installed
- [ ] Check Node.js version (`node --version` should be 18+)
- [ ] Try in incognito/private browsing mode
- [ ] Check network tab in DevTools for failed requests
- [ ] Verify you're on the latest code (`git pull`)
- [ ] Check file permissions (especially on Linux/Mac)

---

**Last Updated**: November 7, 2025
**Version**: 1.0
