# 📸 Image Upload Guide

## Step 1: Sign up for Cloudinary (FREE)

1. Go to: https://cloudinary.com/users/register_free
2. Sign up (it's FREE - 25GB storage, 25GB bandwidth/month)
3. After login, go to **Dashboard**
4. Copy these 3 values:
   - Cloud Name
   - API Key
   - API Secret

## Step 2: Install Cloudinary Package

Run in terminal:
```bash
cd c:\Users\HMS\Downloads\mealvista1\my-auth-backend\my-auth-backend
npm install cloudinary
```

## Step 3: Configure Cloudinary Credentials

Open `upload-images.js` and replace:
```javascript
cloudinary.config({
  cloud_name: 'YOUR_CLOUD_NAME',  // Replace with your cloud name
  api_key: 'YOUR_API_KEY',        // Replace with your API key
  api_secret: 'YOUR_API_SECRET'   // Replace with your API secret
});
```

## Step 4: Prepare Your Images

Create a folder structure:
```
my-auth-backend/
  ├── images/
  │   ├── Onion.jpg
  │   ├── Garlic.png
  │   ├── Tomato.jpg
  │   ├── Basmati Rice.jpg
  │   ├── Chicken Breast.jpg
  │   └── ...
  └── upload-images.js
```

**Important:** 
- Image filename should EXACTLY match ingredient name in database
- Case doesn't matter: "onion.jpg" will match "Onion"
- Supported formats: .jpg, .jpeg, .png, .gif, .webp

## Step 5: Run the Upload Script

```bash
cd c:\Users\HMS\Downloads\mealvista1\my-auth-backend\my-auth-backend
node upload-images.js
```

The script will:
- ✅ Upload all images to Cloudinary
- ✅ Get secure URLs for each image
- ✅ Update database with image URLs
- ✅ Show summary of uploaded images

## Step 6: Verify Images

After upload:
1. Open admin panel
2. Go to Inventory
3. You should see images for all uploaded items!

## Troubleshooting

### "No match found for: SomeItem"
- Check if item exists in database
- Verify spelling matches exactly
- Use `node check-categories.js` to see all item names

### "Upload failed"
- Check your Cloudinary credentials
- Verify image file is not corrupted
- Check file size (max 10MB on free tier)

### "Images not showing in app"
- Clear app cache and reload
- Check if image URLs are valid
- Verify internet connection

## Tips

### Bulk Rename Images
If you have many images with wrong names, use this script:

```javascript
// rename-images.js
const fs = require('fs');
const path = require('path');

const oldName = 'onion_01.jpg';
const newName = 'Onion.jpg';

fs.renameSync(
  path.join('images', oldName),
  path.join('images', newName)
);
console.log('Renamed:', oldName, '→', newName);
```

### Download Sample Images
You can download ingredient images from:
- Unsplash.com (free, high quality)
- Pexels.com (free stock photos)
- Pixabay.com (free images)

### Batch Processing
To upload in batches (e.g., 50 at a time):
1. Move 50 images to `images/` folder
2. Run upload script
3. Move next 50 images
4. Repeat

## Need Help?
If you encounter issues, check:
1. Cloudinary dashboard for upload logs
2. MongoDB for image URLs
3. Console output for error messages
