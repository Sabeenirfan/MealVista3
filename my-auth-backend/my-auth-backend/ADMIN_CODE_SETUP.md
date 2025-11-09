# Admin Code Setup Instructions

## 📍 Where to Put the Admin Code

**Location:** Create a `.env` file in your backend folder:
```
my-auth-backend/my-auth-backend/.env
```

## 🔑 Admin Code Format

**Type:** The admin code can be **any string** - letters, numbers, or both. Examples:
- `ADMIN123456` (letters + numbers)
- `MySecretCode2024` (mixed case)
- `12345` (numbers only)
- `admin-secret-key` (with dashes)

**For testing, I've set the default code to:** `ADMIN123456`

## 📝 Create .env File

Create a file named `.env` in `my-auth-backend/my-auth-backend/` with this content:

```env
ADMIN_REGISTRATION_CODE=ADMIN123456
JWT_SECRET=your-jwt-secret-here
```

## ✅ How to Test

1. **Start your backend server:**
   ```bash
   cd my-auth-backend/my-auth-backend
   npm start
   ```

2. **In the frontend app:**
   - Go to Sign Up
   - Select "Admin" role
   - Fill in: Name, Email, Password
   - Enter admin code: `ADMIN123456`
   - Click "Sign Up"
   - You should be redirected to Admin Dashboard!

## 🔒 Security Note

- The code is stored in `.env` file (never commit this to Git!)
- Backend validates the code before creating admin account
- Change the code to something stronger in production

## 🎯 Current Test Code

**Use this code to test:** `ADMIN123456`

This code is set as a fallback in the backend code, but it's better to put it in `.env` file.







