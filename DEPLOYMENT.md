# Production Deployment Guide

## Overview

This ML prediction platform consists of:
- **Frontend**: Next.js application (this repo)
- **Backend**: FastAPI/Python application (separate repo)

Both need to be deployed for the full system to work.

---

## Pre-Deployment Checklist

### Frontend Checklist
- [ ] Environment variables configured
- [ ] Backend API URL is set correctly
- [ ] Mock data is disabled (`NEXT_PUBLIC_USE_MOCK_DATA=false`)
- [ ] Build passes locally (`npm run build`)
- [ ] All tests pass

### Backend Checklist
- [ ] All 4 endpoints are implemented (see `BACKEND_INTEGRATION_GUIDE.md`)
- [ ] Models are loaded and tested
- [ ] CORS is configured for frontend domain
- [ ] Error handling is in place
- [ ] Logging is configured

---

## Step 1: Environment Variables

### Frontend Environment Variables

Create `.env.production` or set in your deployment platform:

```
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id  # Optional
```

**Important:** 
- Use `NEXT_PUBLIC_` prefix for client-side variables
- API URL should end with `/api` (e.g., `https://api.example.com/api`)
- Don't commit `.env` files to git

### Backend Environment Variables

```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
SECRET_KEY=your-secret-key-here
ALLOWED_ORIGINS=https://your-frontend-domain.com
PORT=8000
```

---

## Step 2: Deploy Backend API

Your backend needs to be deployed first since the frontend depends on it.

### Option A: Deploy to Railway (Recommended for Quick Setup)

1. **Create Railway account** at https://railway.app
2. **Create new project** and connect your backend repo
3. **Add environment variables** (see above)
4. **Deploy**: Railway auto-detects Python and deploys
5. **Get your API URL**: `https://your-project.railway.app`
6. **Configure CORS**: Add frontend domain to allowed origins

### Option B: Deploy to Heroku

1. **Install Heroku CLI**: `brew install heroku` (Mac) or [download](https://devcenter.heroku.com/articles/heroku-cli)
2. **Login**: `heroku login`
3. **Create app**: `heroku create your-app-name`
4. **Set environment variables**:
   ```bash
   heroku config:set DATABASE_URL=...
   heroku config:set SECRET_KEY=...
   heroku config:set ALLOWED_ORIGINS=https://your-frontend.com
   ```
5. **Deploy**: `git push heroku main`
6. **Check logs**: `heroku logs --tail`

### Option C: Deploy to AWS (Production-Ready)

#### Using AWS Elastic Beanstalk

1. **Install EB CLI**:
   ```bash
   pip install awsebcli
   ```

2. **Initialize EB**:
   ```bash
   eb init -p python-3.11 your-app-name
   ```

3. **Create environment**:
   ```bash
   eb create production-env
   ```

4. **Set environment variables** in AWS Console or via CLI:
   ```bash
   eb setenv DATABASE_URL=... SECRET_KEY=...
   ```

5. **Deploy**:
   ```bash
   eb deploy
   ```

#### Using Docker on AWS EC2

1. **Build Docker image**:
   ```dockerfile
   # Dockerfile
   FROM python:3.11-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   COPY . .
   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

2. **Build and run**:
   ```bash
   docker build -t ml-backend .
   docker run -p 8000:8000 -e DATABASE_URL=... ml-backend
   ```

### Backend Deployment Verification

After deploying, test your backend:

```bash
# Test models endpoint
curl https://your-api-domain.com/api/models

# Test prediction endpoint
curl -X POST https://your-api-domain.com/api/predict \
  -H "Content-Type: application/json" \
  -d '{"sentence": "Test sentence"}'
```

---

## Step 3: Deploy Frontend

### Option 1: Vercel (Recommended - Easiest)

1. **Push code to GitHub**
2. **Go to** https://vercel.com and sign in with GitHub
3. **Click "New Project"** and import your repository
4. **Set environment variables**:
   - `NEXT_PUBLIC_API_BASE_URL`: Your backend URL
   - `NEXT_PUBLIC_USE_MOCK_DATA`: `false`
5. **Deploy**: Click "Deploy" (takes ~2 minutes)
6. **Done!** Your site is live at `https://your-project.vercel.app`

**Advantages:**
- Automatic deployments on git push
- Free tier available
- Global CDN
- SSL certificates included

### Option 2: Netlify

1. **Push code to GitHub**
2. **Go to** https://netlify.com and sign in
3. **Click "New site from Git"** and connect repository
4. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. **Set environment variables** in Site settings
6. **Deploy**: Click "Deploy site"

### Option 3: AWS Amplify

1. **Go to** AWS Amplify Console
2. **Click "New app"** → "Host web app"
3. **Connect GitHub** and select repository
4. **Configure build settings** (auto-detected for Next.js)
5. **Set environment variables**
6. **Deploy**

### Option 4: Docker Deployment

#### Build Docker Image

Create `Dockerfile`:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
EXPOSE 3000
CMD ["npm", "start"]
```

#### Build and Run

```bash
# Build
docker build -t ml-frontend .

# Run
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=https://api.example.com/api \
  -e NEXT_PUBLIC_USE_MOCK_DATA=false \
  ml-frontend
```

#### Deploy to AWS ECS

1. **Push image to ECR**:
   ```bash
   aws ecr create-repository --repository-name ml-frontend
   docker tag ml-frontend:latest YOUR_ACCOUNT.dkr.ecr.REGION.amazonaws.com/ml-frontend:latest
   docker push YOUR_ACCOUNT.dkr.ecr.REGION.amazonaws.com/ml-frontend:latest
   ```

2. **Create ECS task definition** with environment variables
3. **Create ECS service** and deploy

---

## Step 4: Post-Deployment

### 1. Update CORS Settings

Ensure your backend allows requests from your frontend domain:

**FastAPI Example:**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. Test End-to-End

1. ✅ **Single Prediction**: Test with different sentences
2. ✅ **Model Selection**: Try different models
3. ✅ **Batch Upload**: Upload a CSV file
4. ✅ **Model Comparison**: Verify metrics display correctly

### 3. Monitor Performance

**Frontend Monitoring:**
- Set up error tracking (Sentry, LogRocket)
- Monitor Core Web Vitals
- Track API response times

**Backend Monitoring:**
- Set up application logs
- Monitor API latency
- Track error rates
- Monitor model inference time

### 4. Performance Optimization

**Frontend:**
- Enable Next.js Image Optimization
- Use CDN for static assets
- Enable compression
- Cache API responses where appropriate

**Backend:**
- Use connection pooling for database
- Cache model predictions if needed
- Implement rate limiting
- Use async processing for batch jobs

---

## Step 5: SSL/HTTPS Setup

### Vercel/Netlify
SSL certificates are automatically provisioned. No action needed.

### AWS CloudFront
1. **Request SSL certificate** in AWS Certificate Manager
2. **Create CloudFront distribution**
3. **Attach certificate** to distribution

### Manual Setup (Nginx)
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
    }
}
```

---

## Troubleshooting

### API Connection Issues

**Problem**: Frontend shows "Failed to fetch" or CORS errors

**Solutions:**
1. Check `NEXT_PUBLIC_API_BASE_URL` is correct
2. Verify backend CORS allows your frontend domain
3. Check backend is running and accessible
4. Test API endpoints directly with curl/Postman

### Build Failures

**Problem**: Build fails on Vercel/Netlify

**Solutions:**
```bash
# Test build locally first
npm run build

# Common fixes:
# 1. Clear .next directory
rm -rf .next

# 2. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 3. Check Node.js version compatibility
node --version  # Should be 18+ or 20+
```

### Performance Issues

**Problem**: Slow API responses

**Solutions:**
1. Check backend logs for bottlenecks
2. Optimize model inference (batch processing, caching)
3. Use CDN for static assets
4. Enable compression
5. Monitor database query performance

### Environment Variables Not Working

**Problem**: Variables not available in frontend

**Solutions:**
1. Ensure variables start with `NEXT_PUBLIC_` prefix
2. Restart development server after changing `.env`
3. Rebuild after changing production env vars
4. Check deployment platform's env var settings

---

## Rollback Procedure

If something goes wrong:

### Vercel
1. Go to Deployments tab
2. Click "..." on previous deployment
3. Select "Promote to Production"

### Heroku
```bash
heroku rollback v123  # Replace with version number
```

### Docker
```bash
docker run -p 3000:3000 ml-frontend:previous-tag
```

---

## Production Best Practices

1. **Security**
   - Never commit API keys or secrets
   - Use environment variables for all sensitive data
   - Enable rate limiting on API
   - Validate all inputs
   - Use HTTPS everywhere

2. **Monitoring**
   - Set up error alerts
   - Monitor API response times
   - Track user analytics
   - Log important events

3. **Backup**
   - Regular database backups
   - Version control for models
   - Document deployment procedures

4. **Scaling**
   - Use load balancers for multiple instances
   - Implement caching strategies
   - Consider CDN for static assets
   - Plan for horizontal scaling

---

## Quick Reference

### Frontend Deployment (Vercel - Fastest)
```bash
# 1. Push to GitHub
git push origin main

# 2. Go to vercel.com
# 3. Import repo
# 4. Set env vars
# 5. Deploy
```

### Backend Deployment (Railway - Easiest)
```bash
# 1. Connect GitHub repo to Railway
# 2. Add env vars
# 3. Deploy automatically
```

### Local Testing Before Deployment
```bash
# Frontend
npm run build
npm run start

# Backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## Support

For issues:
1. Check logs (frontend and backend)
2. Test endpoints independently
3. Verify environment variables
4. Check CORS configuration
5. Review `BACKEND_INTEGRATION_GUIDE.md`

---

**You're all set!** Your ML prediction platform should now be live and ready to use. 🚀
