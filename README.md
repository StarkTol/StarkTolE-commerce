# StarkTol E-commerce

A modern e-commerce platform built with Next.js, featuring user authentication, product management, and automated user synchronization.

## 🚀 Features

- **Next.js 15** with App Router
- **Clerk Authentication** - Complete user management system
- **MongoDB** with Mongoose - Database storage
- **Inngest** - Background job processing and user synchronization
- **Cloudinary** - Image upload and management
- **Tailwind CSS** - Modern styling
- **TypeScript** - Type-safe development

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: Clerk
- **File Storage**: Cloudinary
- **Background Jobs**: Inngest
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/StarkTol/StarkTolE-commerce.git
   cd StarkTolE-commerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables in the `.env` file:
   - Clerk authentication keys
   - MongoDB connection string
   - Inngest keys
   - Cloudinary credentials

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Start the Inngest dev server** (in a separate terminal)
   ```bash
   npm run inngest:dev
   ```

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Database
MONGODB_URI=your_mongodb_connection_string

# Inngest
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_URL=your_cloudinary_url

# App Settings
NEXT_PUBLIC_CURRENCY=$
```

## 🏗️ Project Structure

```
├── app/
│   ├── api/
│   │   ├── inngest/          # Inngest function endpoint
│   │   ├── webhook/clerk/    # Clerk webhook handler
│   │   ├── test-db/          # Database testing endpoint
│   │   └── test-inngest/     # Inngest testing endpoint
│   ├── (auth)/               # Authentication pages
│   └── layout.js             # Root layout
├── config/
│   ├── inngest.ts           # Inngest client configuration
│   └── db.ts                # Database configuration
├── inngest/
│   ├── client.ts            # Inngest client
│   ├── handler.ts           # Function exports
│   └── functions/
│       ├── testFunction.ts  # Test function
│       └── userCreated.ts   # User synchronization
├── lib/
│   ├── mongo.ts             # MongoDB connection
│   └── cloudinary.ts        # Cloudinary configuration
├── models/
│   └── User.ts              # User model
└── middleware.ts            # Clerk middleware
```

## 🔄 Inngest Functions

### User Synchronization
Automatically syncs user data from Clerk to MongoDB when users are created or updated.

**Function**: `sync-user-to-db`
- **Trigger**: `user.created` event
- **Action**: Creates/updates user record in MongoDB

### Test Function
Simple test function for verifying Inngest integration.

**Function**: `test-function`
- **Trigger**: `test/event` event
- **Action**: Logs test data

## 🧪 Testing

### Test Database Connection
```bash
curl -X GET http://localhost:3000/api/test-db
```

### Test Inngest Functions
```bash
curl -X POST http://localhost:3000/api/test-inngest
curl -X POST http://localhost:3000/api/test-user-event
```

### View Inngest Dashboard
- **Development**: http://localhost:8288
- **Production**: https://app.inngest.com

## 📚 API Routes

### Authentication
- `/api/webhook/clerk` - Clerk webhook handler

### Testing
- `/api/test-db` - Database connection test
- `/api/test-inngest` - Inngest test event
- `/api/test-user-event` - User creation test

### Inngest
- `/api/inngest` - Inngest function endpoint

## 🚀 Deployment

### Deploy to Vercel

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy and sync Inngest functions**

## 👨‍💻 Author

**StarkTol**
- GitHub: [@StarkTol](https://github.com/StarkTol)
