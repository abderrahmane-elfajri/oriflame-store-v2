# Google Sheets Setup Guide

This guide will help you set up Google Sheets as a database for your Oriflame Store application.

## Step 1: Create a Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Oriflame Store Database"
4. Note down the spreadsheet ID from the URL (it's the long string between `/d/` and `/edit`)

## Step 2: Create Required Sheets

Create three sheets with the following structure:

### Sheet 1: Products
Create a sheet named "Products" with these columns:
- `id` - Unique product identifier
- `name` - Product name
- `description` - Product description  
- `price` - Product price (numbers only)
- `image` - Product image URL (must be valid URL)

Example data:
```
id | name | description | price | image
1 | Oriflame Royal Velvet Lipstick | Long-lasting luxury lipstick | 25.99 | https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop
```

### Sheet 2: Users  
Create a sheet named "Users" with these columns:
- `id` - Unique user identifier
- `email` - User email address
- `createdAt` - Account creation timestamp

### Sheet 3: Orders
Create a sheet named "Orders" with these columns:
- `id` - Unique order identifier
- `userId` - ID of the user who placed the order
- `productId` - ID of the ordered product
- `date` - Order date timestamp
- `address` - Delivery address (mandatory)
- `total` - Order total amount

## Step 3: Enable Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"

## Step 4: Create API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key
4. Optionally, restrict the API key to Google Sheets API for security

## Step 5: Share Your Spreadsheet

1. Open your Google Spreadsheet
2. Click "Share" button
3. Change permissions to "Anyone with the link can view"
4. Or add specific email addresses that should have access

## Step 6: Configure Environment Variables

Add these to your `.env` file:
```env
VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
VITE_GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
```

## Step 7: Test the Connection

1. Start your development server: `npm run dev`
2. Navigate to the Products page
3. If configured correctly, you should see your products or sample data

## Sample Products Data

Here's some sample data you can add to your Products sheet:

```
1,Oriflame Royal Velvet Lipstick,Long-lasting luxury lipstick with rich pigmentation,25.99,https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop
2,Divine Anti-Aging Cream,Premium anti-aging moisturizer with 24k gold and peptides,89.99,https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop
3,Eclat Beauty Serum,Illuminating vitamin C serum for radiant complexion,45.99,https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&h=300&fit=crop
```

## Important Notes

- **Image URLs**: Must be valid, accessible URLs. Use placeholder images if needed.
- **Data Format**: Follow the exact column structure for proper functionality.
- **Permissions**: Ensure the spreadsheet is accessible with your API key.
- **Fallback**: The app includes mock data as fallback if Sheets API is unavailable.

## Troubleshooting

### Common Issues:

1. **API Key Error**: Ensure your API key has Google Sheets API enabled
2. **Permission Denied**: Check spreadsheet sharing permissions
3. **Invalid Spreadsheet ID**: Verify the ID from the spreadsheet URL
4. **CORS Issues**: Use proper image URLs from supported domains

### Testing API Connection:

You can test your setup by making a direct API call:
```
https://sheets.googleapis.com/v4/spreadsheets/YOUR_SPREADSHEET_ID/values/Products!A:E?key=YOUR_API_KEY
```

This should return your products data in JSON format.
