# DivyaKarya

A platform connecting users with experienced Pandits for Hindu religious ceremonies and spiritual services.

## Project Structure

```
pandit-on-demand/
├── client/          # React + Vite frontend
└── server/          # Node.js + Express backend
```

## Tech Stack

### Frontend
- React 18
- React Router
- Vite
- Axios

### Backend
- Node.js + Express
- Sequelize ORM
- PostgreSQL (Supabase)
- JWT Authentication
- Razorpay Integration

## Setup Instructions

### Prerequisites
- Node.js 18+
- Supabase account

### Backend Setup

1. Navigate to server directory:
   ```bash
   cd pandit-on-demand/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   PORT=5000
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   DATABASE_URL=your_supabase_connection_string
   ```

4. Seed database:
   ```bash
   node seed.js
   ```

5. Start server:
   ```bash
   node server.js
   ```

### Frontend Setup

1. Navigate to client directory:
   ```bash
   cd pandit-on-demand/client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Test Credentials

- **User**: `user@example.com` / `password123`
- **Admin**: `admin@example.com` / `password123`
- **Pandit**: `pandit@example.com` / `password123`

## Features

- 🕉️ Browse Hindu ceremonies (Satyanarayan Puja, Griha Pravesh, etc.)
- 👤 User authentication and authorization
- 📅 Book Pandits for ceremonies
- 💳 Payment integration with Razorpay
- 🌐 Multilingual support (English, Telugu, Tamil)
- 📱 Responsive design

## Deployment

### Backend (Render)
- Set environment variables
- Deploy from GitHub
- Auto-deploys on push

### Frontend (Vercel)
- Connect GitHub repository
- Auto-detects Vite configuration
- Set `VITE_API_URL` environment variable

## License

MIT
