# Admin Authentication & Security Guide

## 🔒 Security Issue Fixed

**Previous Problem:** Anyone could select "Admin" during signup, creating a major security vulnerability.

**Solution Implemented:** Admin registration now requires a **secret admin registration code** that must be provided during signup.

---

## 📋 How Admin Signup Works (Step-by-Step)

### Step 1: User Selects "Admin" Role
- User clicks on "Admin" radio button in the signup form
- An **Admin Registration Code** input field appears (hidden for regular users)

### Step 2: User Enters Admin Code
- User must enter a valid admin registration code
- Code is masked (secure text entry) for security
- Code is validated before form submission

### Step 3: Form Submission
- Frontend sends signup request with:
  - `name`, `email`, `password`
  - `role: 'admin'`
  - `adminCode: 'secret-code-here'`

### Step 4: Backend Validation
- Backend receives the signup request
- **Backend MUST validate the admin code** (see backend requirements below)
- If code is invalid → Reject signup with error
- If code is valid → Create admin account

### Step 5: Login & Routing
- After successful signup, user logs in
- Backend returns user object with `role: 'admin'`
- Frontend checks role and routes to `/admin/dashboard`

---

## 🔐 Backend Requirements

### 1. Environment Variable for Admin Code

Add to your `.env` file:
```env
ADMIN_REGISTRATION_CODE=your-secret-admin-code-here
```

**Important:** Use a strong, random code (e.g., generate with: `openssl rand -hex 32`)

### 2. Update Signup Route

In your backend `routes/auth.js`, update the signup handler:

```javascript
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role, adminCode } = req.body;

    const trimmedName = String(name || '').trim();
    const trimmedEmail = String(email || '').trim().toLowerCase();
    const rawPassword = String(password || '');
    const userRole = role || 'user';

    // SECURITY: Validate admin code if trying to register as admin
    if (userRole === 'admin') {
      const validAdminCode = process.env.ADMIN_REGISTRATION_CODE;
      
      if (!adminCode) {
        return res.status(400).json({ 
          message: 'Admin registration code is required' 
        });
      }

      if (adminCode !== validAdminCode) {
        return res.status(403).json({ 
          message: 'Invalid admin registration code' 
        });
      }
    }

    // Prevent admin code from being sent if role is user
    if (userRole === 'user' && adminCode) {
      return res.status(400).json({ 
        message: 'Admin code not allowed for user registration' 
      });
    }

    // Validation (existing code)
    if (!trimmedName || !trimmedEmail || !rawPassword) {
      return res.status(400).json({ message: 'All fields required' });
    }

    if (!gmailRegex.test(trimmedEmail)) {
      return res.status(400).json({ message: 'Email must be a valid Gmail address' });
    }

    if (!passwordRegex.test(rawPassword)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters and include uppercase, lowercase, and a number',
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    // Create user with role
    const user = new User({
      name: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,
      role: userRole // Save role to database
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role // Include role in response
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
```

### 3. Update User Model

In your `models/User.js`:

```javascript
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId;
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  googleId: {
    type: String,
    sparse: true
  },
  profilePicture: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

### 4. Update Login Route

Make sure login returns the role:

```javascript
router.post('/login', async (req, res) => {
  // ... existing validation code ...

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || 'user' // Include role
    }
  });
});
```

### 5. Create Admin Middleware (Optional but Recommended)

Create `middleware/adminAuth.js`:

```javascript
const auth = require('./auth');
const User = require('../models/User');

const adminAuth = async (req, res, next) => {
  try {
    // First check if user is authenticated
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    req.userId = decoded.userId;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = adminAuth;
```

Use it to protect admin routes:
```javascript
const adminAuth = require('../middleware/adminAuth');

router.get('/admin/users', adminAuth, async (req, res) => {
  // Only admins can access this
});
```

---

## 🔄 Authentication Flow Diagram

```
┌─────────────────┐
│  User Signup    │
└────────┬────────┘
         │
         ├─ Select "User" → No code needed → Create user account
         │
         └─ Select "Admin" → Admin code field appears
                            │
                            ├─ Enter valid code → Backend validates → Create admin account ✅
                            │
                            └─ Enter invalid code → Backend rejects → Error message ❌

┌─────────────────┐
│  User Login     │
└────────┬────────┘
         │
         ├─ role === 'admin' → Route to /admin/dashboard
         │
         └─ role === 'user' → Route to /dietaryPreference
```

---

## 🛡️ Security Best Practices

1. **Keep Admin Code Secret**
   - Never commit admin code to Git
   - Store in environment variables only
   - Rotate code periodically

2. **Additional Security Options** (Future Enhancements):
   - Email whitelist for admin registration
   - Two-factor authentication for admin accounts
   - Admin accounts can only be created by existing admins
   - IP whitelist for admin access
   - Rate limiting on admin signup attempts

3. **Backend Validation is Critical**
   - Frontend validation is for UX only
   - **Always validate admin code on backend**
   - Never trust client-side data

---

## 📝 Testing

### Test Admin Signup:
1. Select "Admin" role
2. Enter valid admin code → Should succeed
3. Enter invalid admin code → Should fail with error
4. Try to signup as admin without code → Should fail

### Test User Signup:
1. Select "User" role
2. No admin code field should appear
3. Signup should work normally

---

## ⚠️ Important Notes

- **The admin code is stored in environment variables on the backend**
- **Frontend never stores or hardcodes the admin code**
- **Backend validation is mandatory** - frontend validation is just for UX
- **Only share admin code with trusted personnel**







