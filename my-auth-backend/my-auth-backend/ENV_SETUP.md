# Environment Variables Setup

## Quick Fix for MongoDB Connection Error

If you're getting the error: `The uri parameter to openUri() must be a string, got "undefined"`

This means your `.env` file is missing or doesn't have `MONGO_URI` defined.

## Step 1: Create/Edit .env File

Create a file named `.env` in the `MealVista/my-auth-backend/my-auth-backend/` directory.

## Step 2: Add MongoDB Connection String

### Option A: Local MongoDB

If you have MongoDB installed locally:

```env
MONGO_URI=mongodb://localhost:27017/mealvista
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

### Option B: MongoDB Atlas (Cloud)

If you're using MongoDB Atlas:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mealvista?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

**Important:** Replace `username` and `password` with your actual MongoDB Atlas credentials.

## Step 3: Verify .env File Location

Make sure the `.env` file is in the same directory as `server.js`:

```
MealVista/my-auth-backend/my-auth-backend/
  ├── .env          ← Should be here
  ├── server.js
  ├── package.json
  └── ...
```

## Step 4: Restart the Server

After creating/editing the `.env` file:

1. Stop the server (Ctrl+C)
2. Start it again: `npm start`

## Common Issues

### Issue 1: .env file not being read
- Make sure the file is named exactly `.env` (not `.env.txt` or `env`)
- Make sure there are no spaces around the `=` sign
- Make sure there are no quotes around the values (unless needed)

### Issue 2: MongoDB not running (for local)
- Start MongoDB service:
  - Windows: `net start MongoDB`
  - Mac/Linux: `mongod` or `brew services start mongodb-community`

### Issue 3: Connection string format
- Local: `mongodb://localhost:27017/mealvista`
- Atlas: `mongodb+srv://user:pass@cluster.mongodb.net/mealvista`

## Example .env File

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/mealvista

# JWT Secret (use a strong random string)
JWT_SECRET=my-super-secret-jwt-key-12345

# Server Port
PORT=5000

# Optional: Google OAuth (if using Google Sign-In)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Testing the Connection

After setting up, you should see:
```
🔄 Connecting to MongoDB...
✅ MongoDB Connected successfully
✅ Server running on port 5000
```

If you see errors, check:
1. MongoDB is running (for local)
2. Connection string is correct
3. Network connectivity (for Atlas)
4. Credentials are correct (for Atlas)


