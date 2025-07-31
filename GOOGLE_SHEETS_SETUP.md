# Google Sheets Setup Instructions

## Overview
This application uses Google Sheets as a database to store products, users, and orders. Follow these steps to set up your Google Sheets integration.

## Step 1: Prepare Your Google Sheet

1. **Open your Google Sheet**: https://docs.google.com/spreadsheets/d/1NL57X8VB-xann5RmwnFP2_qHovy5hHhVeUOt7ulS2vA/edit?usp=sharing

2. **Create Required Sheets**: Your spreadsheet needs exactly 3 sheets with these names:
   - `Products`
   - `Users` 
   - `Orders`

3. **Make Sheet Public**:
   - Click "Share" button in top right
   - Change access to "Anyone with the link can view"
   - Copy the sharing link

## Step 2: Enable Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

## Step 3: Create API Key

1. In Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key
4. (Optional) Restrict the API key to Google Sheets API only for security

## Step 4: Configure Environment Variables

Your `.env` file is already configured with:
```env
VITE_GOOGLE_SHEETS_API_KEY=AIzaSyCzJE3U_XZhjVPukHjbVYmikwptj0sqY4k
VITE_GOOGLE_SHEETS_SPREADSHEET_ID=1NL57X8VB-xann5RmwnFP2_qHovy5hHhVeUOt7ulS2vA
```

## Step 5: Test the Integration

1. Open your application: http://localhost:5176
2. Login as admin (admin@oriflame.com / admin123secure)
3. Go to Admin Dashboard
4. Click on "Settings" tab
5. Use the "Test Connection" button to verify everything works

## Sheet Structure

### Products Sheet
Headers: `ID | Name | Description | Price | Image`

### Users Sheet  
Headers: `ID | Email | CreatedAt`

### Orders Sheet
Headers: `ID | UserID | ProductID | Date | Address | Total`

## Common Issues

1. **API Key Invalid**: Make sure the API key is correct and Google Sheets API is enabled
2. **Permission Denied**: Ensure the spreadsheet is shared publicly
3. **Sheet Not Found**: Check that sheet names are exactly "Products", "Users", "Orders"
4. **CORS Error**: This shouldn't happen with Google Sheets API, but if it does, check your API key restrictions

## Testing

The application will automatically:
- Initialize empty sheets with proper headers
- Fall back to mock data if Google Sheets is unavailable
- Show helpful error messages in the Settings tab

Your Google Sheets integration is now ready to use!
