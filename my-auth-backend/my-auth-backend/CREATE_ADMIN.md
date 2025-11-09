# How to Create Admin Account in MongoDB

## 🔐 Admin Accounts are Created Manually

Admin accounts are **NOT** created through the signup form. They must be created directly in MongoDB.

## 📝 Steps to Create an Admin Account

### Option 1: Using MongoDB Compass (GUI)

1. **Open MongoDB Compass** and connect to your database
2. **Navigate to your database** (e.g., `authDB`)
3. **Go to the `users` collection**
4. **Click "Add Data" → "Insert Document"**
5. **Create a new user document** with these fields:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "$2a$10$hashedPasswordHere",
  "role": "admin",
  "isAdmin": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Important:** You need to hash the password first! See Option 2 below.

### Option 2: Using MongoDB Shell (Recommended)

1. **Connect to MongoDB:**
   ```bash
   mongosh
   use authDB
   ```

2. **Create a script to hash password and create admin:**

You can use Node.js to hash the password:

```javascript
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const password = 'YourAdminPassword123';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  console.log('Hashed Password:', hashedPassword);
  console.log('\nNow run this in MongoDB:');
  console.log(`
db.users.insertOne({
  name: "Admin User",
  email: "admin@gmail.com",
  password: "${hashedPassword}",
  role: "admin",
  isAdmin: true,
  createdAt: new Date()
})
  `);
}

createAdmin();
```

3. **Or use this one-liner in MongoDB shell:**

First, hash the password using Node.js:
```bash
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('YourPassword123', 10).then(h=>console.log(h))"
```

Then insert in MongoDB:
```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@gmail.com",
  password: "PASTE_HASHED_PASSWORD_HERE",
  role: "admin",
  isAdmin: true,
  createdAt: new Date()
})
```

### Option 3: Convert Existing User to Admin

If you already have a user account and want to make it admin:

```javascript
// In MongoDB shell
db.users.updateOne(
  { email: "user@gmail.com" },
  { 
    $set: { 
      role: "admin",
      isAdmin: true
    }
  }
)
```

## ✅ Verify Admin Account

After creating the admin, verify it:

```javascript
db.users.findOne({ email: "admin@gmail.com" })
```

You should see:
- `role: "admin"`
- `isAdmin: true`

## 🔑 Login as Admin

1. **Open the app**
2. **Go to Sign In**
3. **Enter admin email and password**
4. **You'll be automatically routed to `/admin/dashboard`**

## 🔒 Security Notes

- **Never** create admin accounts through the signup form
- Always use strong passwords for admin accounts
- Only create admin accounts for trusted personnel
- Keep admin credentials secure

## 📋 Quick Reference

**Required fields for admin:**
- `name`: Admin's full name
- `email`: Must be @gmail.com (based on your validation)
- `password`: Hashed with bcrypt (10 rounds)
- `role`: "admin"
- `isAdmin`: true
- `createdAt`: Current date

**Example MongoDB Command:**
```javascript
db.users.insertOne({
  name: "John Admin",
  email: "admin@gmail.com",
  password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  role: "admin",
  isAdmin: true,
  createdAt: new Date()
})
```







