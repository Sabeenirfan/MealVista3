# 🚀 Quick Guide: How to Login as Admin

## Step 1: Create Admin Account

### Option A: Using the Script (EASIEST) ⭐

1. **Open the script file:** `create-admin.js`
2. **Edit the admin details** (lines 14-16):
   ```javascript
   const adminEmail = 'admin@gmail.com';      // Change if needed
   const adminPassword = 'Admin123456';       // CHANGE THIS PASSWORD!
   const adminName = 'Admin User';            // Change if needed
   ```

3. **Run the script:**
   ```bash
   cd my-auth-backend/my-auth-backend
   node create-admin.js
   ```

4. **You'll see:**
   ```
   ✅ Admin created successfully!
   
   📋 Login Credentials:
   Email: admin@gmail.com
   Password: Admin123456
   
   🔐 Now you can login with these credentials!
   ```

### Option B: Using MongoDB Shell

1. **Open MongoDB Compass** or **MongoDB Shell**

2. **Hash the password first:**
   ```bash
   node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('Admin123456', 10).then(h=>console.log(h))"
   ```

3. **Copy the hashed password**, then in MongoDB:
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

### Option C: Convert Existing User to Admin

If you already have a user account:

```javascript
// In MongoDB shell
db.users.updateOne(
  { email: "your-email@gmail.com" },
  { 
    $set: { 
      role: "admin",
      isAdmin: true
    }
  }
)
```

---

## Step 2: Login as Admin

1. **Open your app**
2. **Go to Sign In page**
3. **Enter admin credentials:**
   - Email: `admin@gmail.com` (or the email you set)
   - Password: `Admin123456` (or the password you set)
4. **Click "Sign In"**
5. **You'll be automatically redirected to `/admin/dashboard`** 🎉

---

## Step 3: Access Admin Panel

Once logged in as admin, you'll see:
- **Admin Dashboard** - Overview and stats
- **User Management** - View and manage all users
- **Inventory Management** - Manage meals and inventory

---

## 🔒 Default Admin Credentials (After Running Script)

**Email:** `admin@gmail.com`  
**Password:** `Admin123456`

⚠️ **IMPORTANT:** Change the password in the script before running it in production!

---

## 🛠️ Troubleshooting

### "Invalid email or password"
- Make sure you created the admin account correctly
- Check that email is exactly as stored in MongoDB
- Verify password is correct

### "Not routing to admin dashboard"
- Check that `isAdmin: true` in MongoDB
- Check that `role: "admin"` in MongoDB
- Restart your backend server

### "Can't find admin account"
- Check MongoDB connection
- Verify database name is correct
- Check collection name is `users`

---

## 📝 Verify Admin Account

To verify your admin account exists:

```javascript
// In MongoDB shell
db.users.findOne({ email: "admin@gmail.com" })
```

You should see:
- `role: "admin"`
- `isAdmin: true`

---

## 🎯 Quick Test

1. Run: `node create-admin.js`
2. Login with: `admin@gmail.com` / `Admin123456`
3. You should see Admin Dashboard! ✅







