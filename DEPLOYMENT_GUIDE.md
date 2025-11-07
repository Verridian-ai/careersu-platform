# CareerSU Platform - Deployment Guide

## Overview
This guide provides comprehensive instructions for deploying the CareerSU platform to production, including Convex integration, environment setup, and deployment procedures.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Convex Configuration](#convex-configuration)
4. [Database Setup](#database-setup)
5. [Deployment Options](#deployment-options)
6. [Post-Deployment](#post-deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher
- **Git**: For version control
- **Convex Account**: Sign up at [convex.dev](https://convex.dev)

### Required Accounts
- Convex account for backend services
- OpenAI API key (for AI features)
- Domain/Hosting provider (Vercel, Netlify, or custom)

---

## Environment Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/Verridian-ai/careersu-platform.git
cd careersu-platform

# Install dependencies
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Convex
VITE_CONVEX_URL=https://your-deployment.convex.cloud

# OpenAI (for AI features)
VITE_OPENAI_API_KEY=your-openai-api-key

# App Configuration
VITE_APP_URL=https://your-domain.com
VITE_APP_NAME=CareerSU

# Feature Flags (optional)
VITE_ENABLE_AI_CHAT=true
VITE_ENABLE_RAG=true
```

---

## Convex Configuration

### Step 1: Initialize Convex

```bash
# Install Convex CLI globally (if not already installed)
npm install -g convex

# Login to Convex
npx convex login

# Initialize Convex in your project
npx convex dev --once
```

### Step 2: Deploy Convex Schema

The schema is already defined in `/home/user/careersu-platform/convex/schema.ts`. Deploy it:

```bash
# Deploy to production
npx convex deploy --prod
```

### Step 3: Create Convex Functions

You need to create the following Convex functions (these are currently missing):

#### Required Functions:

1. **Authentication Functions** (`convex/auth.ts`)
   - `signUp`: User registration
   - `login`: User authentication
   - `logout`: Session termination
   - `getCurrentUser`: Get authenticated user

2. **Document Functions** (`convex/documents.ts`)
   - `createDocument`: Create new document
   - `updateDocument`: Update existing document
   - `deleteDocument`: Delete document
   - `getDocuments`: List user documents
   - `getDocumentById`: Get single document

3. **Job Functions** (`convex/jobs.ts`)
   - `listJobs`: Get all jobs with filters
   - `getJobById`: Get single job details
   - `applyToJob`: Submit job application
   - `getApplications`: Get user applications

4. **Chat Functions** (`convex/chat.ts`)
   - `createConversation`: Start new chat
   - `sendMessage`: Send message to AI
   - `getConversations`: List user conversations
   - `getMessages`: Get conversation messages

5. **RAG Functions** (`convex/rag.ts`)
   - `generateEmbedding`: Create vector embeddings
   - `semanticSearch`: Search documents by similarity
   - `queryKnowledgeBase`: Query career knowledge

### Step 4: Integrate Convex Client

Update `/home/user/careersu-platform/src/main.tsx`:

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import App from './App'
import './index.css'

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConvexProvider>
  </React.StrictMode>,
)
```

---

## Database Setup

### Initial Data Seeding

Create a seed script (`convex/seed.ts`):

```typescript
import { mutation } from "./_generated/server";

export default mutation(async ({ db }) => {
  // Seed demo users
  const seekerId = await db.insert("users", {
    email: "demo@careersu.com",
    name: "Demo User",
    role: "job_seeker",
    passwordHash: "hashed_password_here",
    createdAt: Date.now(),
  });

  const coachId = await db.insert("users", {
    email: "coach@careersu.com",
    name: "Demo Coach",
    role: "coach",
    passwordHash: "hashed_password_here",
    createdAt: Date.now(),
  });

  // Seed sample jobs
  const sampleJobs = [
    {
      title: "Senior Software Engineer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "full-time",
      description: "Build scalable web applications...",
      requirements: ["React", "Node.js", "TypeScript"],
      salaryMin: 120000,
      salaryMax: 180000,
      salaryCurrency: "USD",
      posted: Date.now(),
      isActive: true,
    },
    // Add more jobs...
  ];

  for (const job of sampleJobs) {
    await db.insert("jobs", job);
  }

  return { seekerId, coachId, jobCount: sampleJobs.length };
});
```

Run the seed:
```bash
npx convex run seed
```

---

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   # Login to Vercel
   vercel login

   # Deploy
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Go to Vercel Dashboard
   - Add environment variables from `.env.local`

### Option 2: Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod --dir=dist
   ```

### Option 3: Custom Server

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Serve Static Files**
   ```bash
   # Using serve
   npx serve -s dist -l 3000

   # Or using any static file server
   ```

3. **Configure Nginx** (if applicable)
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/careersu/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

---

## Post-Deployment

### 1. Verify Deployment

Check that all routes work:
- ✅ `/` - Landing page
- ✅ `/login` - Login page
- ✅ `/dashboard` - Dashboard (requires auth)
- ✅ `/documents` - Documents page (requires auth)
- ✅ `/jobs` - Jobs page (requires auth)
- ✅ `/chat` - Chat page (requires auth)

### 2. Test Core Functionality

**Authentication Flow:**
```bash
# Test with demo account
Email: demo@careersu.com
Password: demo123
```

**API Health Check:**
```bash
curl https://your-domain.com/api/health
```

### 3. Configure DNS (if using custom domain)

Point your domain to your hosting provider:
```
A Record: @ -> Your Server IP
CNAME Record: www -> your-domain.com
```

### 4. Setup SSL Certificate

Using Certbot (for custom servers):
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 5. Enable Monitoring

Set up monitoring for:
- Uptime monitoring
- Error tracking (Sentry recommended)
- Performance monitoring (New Relic or similar)
- Analytics (Google Analytics or Plausible)

---

## Troubleshooting

### Common Issues

**Issue 1: Convex Connection Error**
```
Error: Could not connect to Convex
```
**Solution:**
- Verify `VITE_CONVEX_URL` is set correctly
- Check Convex deployment status: `npx convex dashboard`
- Ensure Convex functions are deployed: `npx convex deploy`

**Issue 2: Build Fails**
```
Error: Module not found
```
**Solution:**
- Clear node_modules: `rm -rf node_modules package-lock.json`
- Reinstall: `npm install`
- Clear build cache: `rm -rf dist .vite`

**Issue 3: Routes Return 404**
```
404 Not Found on page refresh
```
**Solution:**
- Configure your hosting provider for SPA routing
- Add `_redirects` file (Netlify) or `vercel.json` (Vercel)

**Issue 4: Environment Variables Not Working**
```
Error: Environment variable undefined
```
**Solution:**
- Prefix with `VITE_` for Vite to expose them
- Rebuild after adding new variables
- Verify they're set in hosting provider dashboard

---

## Security Checklist

Before going to production:

- [ ] Enable HTTPS/SSL
- [ ] Set secure environment variables
- [ ] Implement rate limiting
- [ ] Add CORS configuration
- [ ] Enable CSP headers
- [ ] Implement authentication properly
- [ ] Hash passwords with bcrypt
- [ ] Validate all user inputs
- [ ] Set up database backups
- [ ] Configure proper error logging

---

## Performance Optimization

### Build Optimization

Current build stats:
- Bundle size: 289KB (optimized)
- CSS: 37.68 KB (gzipped: 7.09 KB)
- JS: 246.07 KB (gzipped: 73.48 KB)

**Further optimizations:**
1. Enable code splitting for routes
2. Lazy load heavy components
3. Optimize images with WebP
4. Enable compression (Brotli/Gzip)
5. Configure CDN for static assets

### Caching Strategy

```nginx
# Cache static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## Maintenance

### Regular Tasks

**Weekly:**
- Monitor error logs
- Check uptime status
- Review performance metrics

**Monthly:**
- Update dependencies: `npm update`
- Review and optimize database queries
- Check and update SSL certificates

**Quarterly:**
- Security audit
- Performance optimization review
- User feedback review and implementation

---

## Support

For deployment issues:
- Check Convex docs: https://docs.convex.dev
- Review Vite deployment guide: https://vitejs.dev/guide/static-deploy
- Contact: Verridian AI Team

---

## Changelog

### Version 1.0.0 (Current)
- Initial deployment guide
- Convex schema defined
- Build optimized to 289KB
- All UI pages implemented
- Mobile-responsive design complete

### Pending Implementation
- Convex functions integration
- Authentication backend
- RAG system implementation
- Real-time chat with AI
- Document CRUD operations

---

**Last Updated:** November 7, 2025
**Platform Version:** 1.0.0
**Build Status:** ✅ Production Ready (Frontend)
**Backend Status:** ⏳ Requires Convex Function Implementation
