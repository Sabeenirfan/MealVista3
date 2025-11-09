# MealVista App Flow - Complete User Journey

## 🚀 App Startup Flow

1. **Splash Screen (index.tsx)**
   - App always starts here
   - Shows MealVista branding
   - Two options:
     - "Get Started" → Navigate to Sign Up
     - "Already have an account? Sign In" → Navigate to Sign In

## 👤 Authentication Flow

### For New Users:
1. **Splash** → Click "Get Started"
2. **Sign Up** → Enter name, email, password
   - After successful signup → **Dietary Preference** (onboarding)
3. **Dietary Preference** → Select dietary preferences → **BMI Calculator**
4. **BMI Calculator** → Enter BMI info → **Allergen Preference**
5. **Allergen Preference** → Select allergens → Save → **Home Screen**

### For Existing Users:
1. **Splash** → Click "Sign In"
2. **Sign In** → Enter email, password
   - If onboarding not complete → **Dietary Preference** (onboarding)
   - If onboarding complete → **Home Screen**

### Google Authentication:
- Works from both Sign Up and Sign In screens
- After successful Google auth:
  - New users → **Dietary Preference** (onboarding)
  - Existing users (onboarding complete) → **Home Screen**
  - Existing users (onboarding incomplete) → **Dietary Preference**

## 🏠 Main App Flow (After Authentication)

### Home Screen
- Browse meal cards
- Click meal card → **Recipe Details**
- Cart icon with badge count (top right)

### Recipe Details Screen
- **View Instructions** button → **Instructions Screen**
- **View Nutrients** button → **Nutritional Breakdown** → **Macronutrients** → **Micronutrients**
- **View Allergens** button → **See Allergens Screen**
- **Ingredients Section** (NEW):
  - Select ingredients with checkboxes
  - "Add to Cart" button appears when ingredients selected
  - Click "Add to Cart" → Adds selected ingredients to cart
- Cart icon with badge count (top right)

### See Allergens Screen
- Shows detected allergens
- **See Substitutions** button → **Save Substitution Screen**
- No cart functionality here (moved to Recipe Details)

### Save Substitution Screen
- Select substitution alternatives
- **Apply Substitutions** button → Success dialog → Returns to Recipe Details

### Cart Flow
1. **View Cart** (from Home or Recipe Details cart icon)
   - Shows all cart items
   - Update quantities
   - Remove items
   - **Proceed to Checkout** button

2. **Checkout Summary**
   - Review order items
   - Delivery information
   - Payment method selection
   - **Proceed to Payment** button

3. **Payment Method**
   - Select payment method (Credit/Debit Card)
   - **Continue with Credit/Debit Card** button

4. **Card Details**
   - Enter card number, expiry, CVV, name
   - **Pay Now** button

5. **Payment Successful**
   - Success message
   - Order details
   - **View Order History** button

6. **Order History**
   - View past orders
   - Order status tracking
   - Order details

## 📱 Key Features

### Cart Functionality
- **Global Cart State**: Managed by CartContext
- **Real-time Badge**: Shows item count on Home and Recipe Details
- **Add to Cart**: Available in Recipe Details (ingredients section)
- **Cart Management**: Add, remove, update quantities in View Cart

### Navigation
- All screens use Expo Router
- Proper back navigation
- Stack navigation for deep linking

### User Flow Protection
- Splash screen always shown first (no auto-navigation)
- Onboarding required for new users
- Onboarding status stored in AsyncStorage
- Proper routing based on authentication and onboarding status

## 🔄 Complete Flow Diagram

```
Splash Screen
    ├─ Get Started → Sign Up → Dietary Preference → BMI Calculator → Allergen Preference → Home
    └─ Sign In → (Check Onboarding)
                    ├─ Not Complete → Dietary Preference → BMI Calculator → Allergen Preference → Home
                    └─ Complete → Home

Home
    └─ Meal Card → Recipe Details
                      ├─ View Instructions → Instructions
                      ├─ View Nutrients → Nutritional Breakdown → Macronutrients → Micronutrients
                      ├─ View Allergens → See Allergens → Save Substitution
                      ├─ Ingredients (Select & Add to Cart)
                      └─ Cart Icon → View Cart → Checkout Summary → Payment Method → Card Details → Payment Successful → Order History
```

## ✅ Implementation Status

- ✅ Splash screen with proper navigation
- ✅ Sign Up / Sign In flow
- ✅ Onboarding flow (Dietary → BMI → Allergen)
- ✅ Home screen with meal cards
- ✅ Recipe Details with ingredients selection and cart
- ✅ Cart functionality with global state
- ✅ Complete checkout flow
- ✅ Order history
- ✅ All navigation routes connected
- ✅ Cart badge updates in real-time

