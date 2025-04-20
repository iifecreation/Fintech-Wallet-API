# 💸 Fintech Wallet API (Fullstack)

A modern, powerful and secure fullstack wallet app built with **Node.js + Express + TypeScript** on the backend and **React + Vite + TypeScript** on the frontend. Supports user registration / authentication, wallet creation, wallet funding via Paystack, Paystack integration, transfers, withdrawals to commercial bank accounts, transaction tracking, and full transaction history.


---

## 📦 Features

- ✅ User Registration, Login, Forgot & Reset Password (JWT-based)
- ✅ Wallet creation on registration
- ✅ Fund wallet via Paystack payment gateway
- ✅ Webhook to auto-credit wallet on successful payment
- ✅ Transfer funds between users
- ✅ Withdraw funds to commercial bank accounts (via Paystack)
- ✅ View wallet balance and transaction history
- ✅ Email notifications (SMTP / SendGrid / Mailgun compatible)

---

## 🚀 Getting Started

### 🧾 1. Clone the Repo

```bash
git clone https://github.com/iifecreation/Fintech-Wallet-API.git
cd Fintech-Wallet-API/
```
##  🛠 Backend Setup

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Configure Environment
Create a .env file in the root of /backend:
```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/fintech_wallet
JWT_SECRET=your_jwt_secret
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=your_paystack_public_key
FRONTEND_URL=http://localhost:3000
```

### 4. Run the server
💻 Development
```bash
npm run dev
```

🏁 Build
```bash
npm run build 
```

🚀 Production
```bash
npm run start 
```

### 5. 📬 Webhook Setup (Paystack)
Go to your Paystack dashboard.
Navigate to Settings → Webhooks.
Add your webhook URL:
```bash
https://yourdomain.com/api/webhook/paystack
```
Make sure it's publicly accessible and uses HTTPS.


### 🧪 API Endpoints
```bash
Method	    Endpoint	                            Description
POST	    /api/v1/auth/register	                Register a new user
POST	    /api/v1/auth/login	                    Login and receive a JWT token
POST	    /api/v1/auth/forgot-password	        Send reset password link
POST	    /api/v1/auth/reset-password	            Reset user password
GET	        /api/v1/wallet/balance	                Get wallet balance
GET	        /api/v1/wallet/details      	        Get wallet and user details
GET	        /api/v1/wallet/transactions	            View transaction history
POST    	/api/v1/wallet/fund	                    Initiate wallet funding via Paystack
POST	    /api/v1/wallet/transfer	                Transfer funds to another user
POST    	/api/v1/wallet/withdraw	                Withdraw funds to a bank account
POST	    /api/v1/webhooks/paystack	            Handle Paystack webhook event
```

### 🧪 Testing with Postman
You can test endpoints using Postman or Insomnia. For protected routes, add your JWT token in headers:
```bash
Authorization: Bearer <your_token>
```
Generate the token by logging in via /api/v1/auth/login.

## 💻 Frontend Setup

### 📦 Install Dependencies
```bash
cd frontend
npm install
```

### Set Up Your Endpoint 
Add your backend point inside /src/services/api.ts

### Run Frontend
```bash
npm run dev
```


### 🛠️ Tech Stack
- **Backend:**
    Node.js + Express
    TypeScript
    MongoDB + Mongoose
    Paystack API
    Axios
    JWT for Auth
    bcrypt
    Zod for Validation
    cors
    Nodemailer for Emails
    uuid
    nodemon

- **Frontend:**
    React
    TypeScript
    Axios
    zod
    tailwindcss
    radix-ui
    hookform
    motion
- **Payments:** 
    Paystack