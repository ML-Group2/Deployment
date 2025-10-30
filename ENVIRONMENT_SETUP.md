# Environment Setup Guide

## Development Environment

### Prerequisites
- Node.js 18+ (recommended 20+)
- npm or pnpm
- Git

### Setup Steps

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd ml-prediction-platform
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
# or
pnpm install
\`\`\`

3. Create `.env.local` file
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Configure environment variables
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_USE_MOCK_DATA=true
\`\`\`

5. Start development server
\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:3000

## Production Environment

### Environment Variables Required

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API endpoint | `https://api.yourdomain.com/api` |
| `NEXT_PUBLIC_USE_MOCK_DATA` | Use mock data (dev only) | `false` |
| `NEXT_PUBLIC_ANALYTICS_ID` | Analytics tracking ID | `UA-XXXXXXXXX-X` |
| `NEXT_PUBLIC_ENABLE_BATCH_UPLOAD` | Enable batch features | `true` |
| `NEXT_PUBLIC_ENABLE_MODEL_COMPARISON` | Enable model comparison | `true` |

### Deployment Checklist

- [ ] All environment variables configured
- [ ] Backend API deployed and tested
- [ ] Database migrations completed
- [ ] SSL/HTTPS enabled
- [ ] CORS configured correctly
- [ ] Rate limiting configured
- [ ] Monitoring and logging set up
- [ ] Backup procedures tested
- [ ] Security audit completed
- [ ] Performance testing done

## Troubleshooting

### Build Issues
\`\`\`bash
# Clear cache and reinstall
rm -rf node_modules .next
npm ci
npm run build
\`\`\`

### API Connection Issues
- Verify API URL is correct
- Check CORS headers
- Test API endpoint directly
- Check network connectivity

### Performance Issues
- Check API response times
- Review database queries
- Analyze bundle size
- Monitor memory usage

## Support
Contact DevOps team for deployment assistance.
