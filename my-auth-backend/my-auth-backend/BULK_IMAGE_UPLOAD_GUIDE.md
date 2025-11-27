# Bulk Image Upload Guide

## How to Use the Bulk Upload Feature

### Step 1: Create your CSV file
Create a CSV file with 2 columns: `item_name,image_url`

Example format:
```csv
Tomato,https://res.cloudinary.com/dqycpk9ce/image/upload/v1/mealvista/ingredients/tomato.jpg
Onion,https://res.cloudinary.com/dqycpk9ce/image/upload/v1/mealvista/ingredients/onion.jpg
Garlic,https://res.cloudinary.com/dqycpk9ce/image/upload/v1/mealvista/ingredients/garlic.jpg
```

### Step 2: Get Image URLs
You have several options:

#### Option A: Upload to Cloudinary manually
1. Go to https://cloudinary.com/console
2. Upload images to `mealvista/ingredients` folder
3. Copy the secure_url for each image
4. Add to your CSV

#### Option B: Use direct image URLs
You can use any publicly accessible image URL:
- https://images.unsplash.com/...
- https://pixabay.com/get/...
- https://www.pexels.com/photo/...

#### Option C: Use the provided script
Run the helper script to generate URLs from local images:
```bash
cd my-auth-backend/my-auth-backend
node scripts/generate-csv.js
```

### Step 3: Upload via Admin Panel
1. Open admin panel
2. Go to Inventory Management
3. Click "Bulk Upload" button (cloud icon)
4. Select your CSV file
5. Click "Upload Images"
6. Wait for processing to complete

### Important Notes
- Item names must match EXACTLY (case-sensitive)
- Invalid URLs will be skipped
- Process up to 100 items at once
- You can run multiple times for different batches

### Sample CSV Template
See `sample-image-urls.csv` for a template with the first 20 items.
