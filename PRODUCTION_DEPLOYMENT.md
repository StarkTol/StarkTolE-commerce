# 🚀 Production Deployment Checklist for Render

## 📋 **Before Deploying**

### ✅ **Code Changes Made:**
- [x] Added `user.deleted` event support to webhook handler
- [x] Created `userDeleted` Inngest function
- [x] Updated Inngest configuration for production/development
- [x] Registered new function in `/api/inngest/route.ts`
- [x] Added comprehensive logging and error handling

## 🔧 **Environment Variables for Render**

### **Required Environment Variables:**
```env
NODE_ENV=production
INNGEST_EVENT_KEY=MORFHu34EhuQV4TMpFchb70-KAyub_tge0cBwm1L1Z-3r52-8ZwV_c5_granHBsB3SXZ5B_z3o9QNdo832qxJw
INNGEST_SIGNING_KEY=signkey-prod-7a9f7c549b1315f38387bac63ae0ba27cd7a737a890ac454dcef931e383bf96f
CLERK_WEBHOOK_SECRET=whsec_ARLvRF9EZoJrzjnFUGIAkttl74LyNl/q
MONGODB_URI=mongodb+srv://starktol:OIprlNvZQBtnj9ar@cluster0.8i8wmya.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
CLERK_SECRET_KEY=sk_test_qjqMtymVkiahNiJzfvsjZxjG8p1coujnYGHQlccUiA
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_aW1tZW5zZS1jaXZldC0zLmNsZXJrLmFjY291bnRzLmRldiQ
```

### **How to Set in Render:**
1. Go to your Render dashboard
2. Select your service: `starktole-commerce`
3. Go to "Environment" tab
4. Add each variable above
5. Save and redeploy

## 🔗 **Clerk Webhook Configuration**

### **Update Clerk Webhook Settings:**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to "Webhooks"
3. Update/Create webhook with these settings:

```
Webhook URL: https://starktole-commerce.onrender.com/api/webhook/clerk
Events to listen for:
  ✅ user.created
  ✅ user.updated  
  ✅ user.deleted
Secret: whsec_ARLvRF9EZoJrzjnFUGIAkttl74LyNl/q
```

## 🎯 **Deployment Steps**

### **1. Deploy to Render:**
```bash
# If using Git deployment (automatic)
git add .
git commit -m "Add user deletion support and production config"
git push origin main

# Render will automatically detect and deploy
```

### **2. Verify Deployment:**
After deployment completes, test these endpoints:

```bash
# Test webhook endpoint
GET https://starktole-commerce.onrender.com/api/webhook/clerk

# Test Inngest endpoint  
GET https://starktole-commerce.onrender.com/api/inngest
```

### **3. Expected Results:**
- **Webhook endpoint** should return status info with 3 supported events
- **Inngest endpoint** should show 3 registered functions
- **Production dashboard** at https://app.inngest.com should show your app

## 🧪 **Testing Production Setup**

### **After Deployment:**
1. **Register a test user** on your live site
2. **Check Inngest production dashboard** at https://app.inngest.com
3. **Delete the test user** 
4. **Verify deletion event** appears in dashboard

### **Troubleshooting:**
If events don't appear in production dashboard:
- Check Render logs for errors
- Verify all environment variables are set
- Ensure webhook URL is correct in Clerk
- Check that `NODE_ENV=production` is set

## 📊 **Production Monitoring**

### **Inngest Production Dashboard:**
- **URL**: https://app.inngest.com
- **Functions**: Should show 3 functions
- **Events**: Should show user creation/update/deletion events
- **Runs**: Should show successful function executions

### **Expected Function Names:**
1. `sync-user-to-db` (handles user.created)
2. `delete-user-from-db` (handles user.deleted)  
3. `test-function` (handles test/event)

## ✅ **Deployment Complete When:**
- [ ] All environment variables set in Render
- [ ] Latest code deployed successfully
- [ ] Webhook endpoint returns 3 supported events
- [ ] Inngest endpoint shows 3 functions
- [ ] Clerk webhook configured with production URL
- [ ] Test user registration/deletion works
- [ ] Events appear in production Inngest dashboard

---

**Production URL**: https://starktole-commerce.onrender.com/
**Webhook URL**: https://starktole-commerce.onrender.com/api/webhook/clerk
**Inngest Dashboard**: https://app.inngest.com
