<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Oriflame Store - React SPA Project

This is a React JS single-page application for showcasing and selling Oriflame products. The application uses:

- **Frontend**: React JS with Vite
- **Styling**: Tailwind CSS for professional design
- **Authentication**: Firebase Authentication
- **Database**: Google Sheets API for products, users, and orders
- **Routing**: React Router for client-side navigation

## Key Features

1. **Product Browsing**: Public product viewing with professional card layout
2. **User Authentication**: Email/password registration and login
3. **Order System**: Professional modal-based ordering with address validation
4. **Admin Dashboard**: Admin-only interface for managing products, users, and orders
5. **Responsive Design**: Mobile-first approach with AliExpress-inspired UI

## Important Notes

- All product images are mandatory and validated
- Order addresses are required fields
- Admin account: admin@oriflame.com
- Uses Google Sheets as database with fallback to mock data
- Designed for static deployment on Netlify/Vercel

## Environment Variables

Configure these in .env file:
- Firebase configuration (API keys, project ID, etc.)
- Google Sheets API key and spreadsheet ID
- Admin credentials

## Development Guidelines

- Follow professional e-commerce UI patterns
- Ensure responsive design for all components
- Validate all form inputs
- Handle loading states and errors gracefully
- Use Tailwind CSS classes consistently
