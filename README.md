# 🌸 Oriflame Store - React SPA

A modern, responsive e-commerce application for Oriflame products built with React and powered by an in-memory SQLite-like database system.

## 🌟 Features

### Core Functionality
- **🛍️ Product Browsing**: Public access to view all products with professional card layout
- **👤 User Authentication**: Secure email/password registration and login system
- **🛒 Order System**: Professional modal-based ordering with mandatory address input
- **📊 Admin Dashboard**: Complete management interface for products, users, and orders
- **📱 Responsive Design**: Mobile-first approach with AliExpress-inspired UI

### Technical Features
- **⚛️ React 19** with Vite for lightning-fast development
- **🎨 Tailwind CSS** for professional, responsive styling
- **🗄️ SQLite-like Database** - In-memory database with localStorage persistence
- **🚀 GitHub Pages Ready** - No server required, deploy anywhere
- **🔄 React Router** for smooth client-side navigation
- **🧪 Testing Tools** - Comprehensive database and system testing

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS, Lucide React Icons  
- **Database**: In-Memory SQLite-like with localStorage
- **Routing**: React Router DOM
- **Deployment**: GitHub Pages Ready

## 🚀 Quick Start

### Prerequisites
- Node.js (v20+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/oriflame-store.git
cd oriflame-store

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to view the application.

## 🗄️ Database System

This application uses an innovative **in-memory SQLite-like database** that:

- ✅ Runs entirely in the browser
- ✅ Persists data using localStorage  
- ✅ Requires no external database server
- ✅ Perfect for GitHub Pages deployment
- ✅ Handles users, products, and orders efficiently

### Default Admin Account
- **Email**: `admin@oriflame.com`
- **Password**: `admin123`

### Installation

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Copy `.env.example` to `.env` and configure:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   # Google Sheets Configuration  
   VITE_GOOGLE_SHEETS_API_KEY=your_sheets_api_key
   VITE_GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id

   # Admin Configuration
   VITE_ADMIN_EMAIL=admin@oriflame.com
   VITE_ADMIN_PASSWORD=admin123secure
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## 📊 Google Sheets Setup

Create a Google Spreadsheet with three sheets:

### Products Sheet
| id | name | description | price | image |
|----|------|-------------|-------|-------|
| 1 | Product Name | Product Description | 25.99 | https://image-url.com |

### Users Sheet  
| id | email | createdAt |
|----|-------|-----------|
| 1 | user@example.com | 2025-01-01T00:00:00Z |

### Orders Sheet
| id | userId | productId | date | address | total |
|----|--------|-----------|------|---------|-------|
| 1 | user123 | 1 | 2025-01-01T00:00:00Z | 123 Main St | 25.99 |

## 🔐 Firebase Setup

1. Create a new Firebase project
2. Enable Authentication with Email/Password
3. Get your web app configuration
4. Add the config to your `.env` file

## 🎨 Design Features

### Professional UI Elements
- **Product Cards**: Hover effects, responsive images, clear pricing
- **Order Modal**: AliExpress-inspired design with product details and address input
- **Navigation**: Clean, sticky header with user authentication status
- **Admin Dashboard**: Professional data tables with management capabilities

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Touch-friendly buttons and inputs
- Optimized for all screen sizes

## 🚀 Deployment

### Netlify Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard
4. Enable form handling for contact forms

### Vercel Deployment  
1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

## 📱 Pages & Navigation

- **Home** (`/`) - Landing page with hero section and features
- **Products** (`/products`) - Product grid with search and filtering
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - New user registration  
- **Admin Dashboard** (`/admin`) - Admin-only management interface

## 🔒 Security Features

- Firebase Authentication for secure user management
- Admin-only routes protected with route guards
- Environment variables for sensitive configuration
- Input validation and sanitization
- HTTPS-ready for production deployment

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please contact the development team or create an issue in the repository.

## 🌟 Demo Credentials

- **Admin Login**: admin@oriflame.com / admin123secure
- **Regular User**: Create your own account via registration

---

Built with ❤️ for Oriflame beauty products+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
#   o r i f l a m e - s t o r e - v 2 
 
 