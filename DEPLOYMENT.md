# Production Deployment Guide

## Overview
This ML prediction platform is built with Next.js and can be deployed to Vercel, AWS, or any Node.js hosting provider.

## Pre-Deployment Checklist

### 1. Environment Variables
Set up the following environment variables in your deployment platform:

\`\`\`
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
\`\`\`

### 2. Backend API Setup
Ensure your FastAPI backend is deployed and accessible:
- Verify all endpoints are working: `/api/predict`, `/api/batch-predict`, `/api/models`
- Set up CORS properly to allow requests from your frontend domain
- Configure rate limiting and authentication if needed

### 3. Database Configuration
- Ensure your database is properly configured and accessible
- Run any pending migrations
- Verify backup and recovery procedures

## Deployment Options

### Option 1: Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy with one click

\`\`\`bash
# Local testing before deployment
npm run build
npm run start
\`\`\`

### Option 2: Docker Deployment
\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

Build and run:
\`\`\`bash
docker build -t ml-predictor .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api ml-predictor
\`\`\`

### Option 3: AWS Deployment
1. Use AWS Amplify for easy Next.js deployment
2. Or use EC2 with PM2 for process management
3. Use CloudFront for CDN distribution

## Post-Deployment

### 1. Monitoring
- Set up error tracking (Sentry, LogRocket)
- Monitor API response times
- Track user analytics

### 2. Performance Optimization
- Enable caching headers
- Use CDN for static assets
- Monitor Core Web Vitals

### 3. Security
- Enable HTTPS/SSL
- Set up WAF rules
- Regular security audits
- Keep dependencies updated

## Troubleshooting

### API Connection Issues
- Verify CORS headers are set correctly
- Check API_URL environment variable
- Test API endpoints directly

### Build Failures
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `npm ci`
- Check Node.js version compatibility

### Performance Issues
- Check database query performance
- Optimize API response times
- Review bundle size with `npm run analyze`

## Rollback Procedure
1. Revert to previous deployment
2. Verify all services are operational
3. Check logs for errors
4. Notify users if necessary

## Support
For issues or questions, contact your DevOps team or refer to Next.js documentation.
