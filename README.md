# ⚡ Spark Backend API

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose%209-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Nginx-Reverse%20Proxy-009639?style=for-the-badge&logo=nginx&logoColor=white" alt="Nginx" />
</p>

> **Spark Backend** is a high-performance RESTful API service powering the Spark matchmaking and tech networking platform. Built on Node.js, Express, and MongoDB, it provides robust user authentication, encrypted passwords, JWT cookie-based session management, complex feed filtering algorithms, connection request workflows, and profile management.

---

## 🚀 Key Architectural Highlights

* 🔐 **Secure Authentication & Session Management**:
  * Password hashing via `bcrypt` (10 rounds).
  * Cookie-based stateless JWT authentication with HTTP-Only and `SameSite` policies.
  * Extensible Bearer token support via authorization headers.
* 🛡️ **Data Integrity & Validation**:
  * Strict Schema validations using `mongoose` & `validator` library.
  * Strong password policy enforcement (minimum 8 chars, uppercase, lowercase, numbers, and symbols).
  * Pre-save hooks preventing self-connection requests.
* 🎛️ **Complex Discovery Feed Algorithm**:
  * Dynamic exclusion set building: Hides logged-in user and any profiles with pre-existing interactions (*interested*, *ignored*, *accepted*, *rejected*).
  * Paginated querying (`page` & `limit` params capped at 50 records) for scalable feed retrieval.
* 🤝 **Bi-directional Connection Workflows**:
  * Dual-state request initiation (`interested` or `ignored`).
  * Structured review flow (`accepted` or `rejected`).
  * Index-optimized query lookups (`{ fromUserId: 1, toUserId: 1 }`).
* 🌐 **Production-Ready Proxy & CORS Setup**:
  * Pre-configured CORS middleware with white-listed origins and credentials support.
  * Includes production Nginx configuration (`ngnix`) for reverse proxying `/api/` traffic.

---

## 🛠️ Tech Stack

* **Runtime**: [Node.js](https://nodejs.org/) (v18+)
* **Framework**: [Express 5](https://expressjs.com/)
* **Database & ORM**: [MongoDB](https://www.mongodb.com/) with [Mongoose 9](https://mongoosejs.com/)
* **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) & [Cookie Parser](https://www.npmjs.com/package/cookie-parser)
* **Security & Hashing**: [Bcrypt](https://www.npmjs.com/package/bcrypt) & [Validator](https://www.npmjs.com/package/validator)
* **Environment Configuration**: [dotenv](https://www.npmjs.com/package/dotenv)
* **Development Server**: [Nodemon](https://nodemon.io/)

---

## 📁 Directory Structure

```text
spark-backend/
├── ngnix                  # Production Nginx reverse proxy configuration
├── package.json           # Dependencies and scripts
├── .env                   # Environment variable definitions
└── src/
    ├── app.js             # Express application initialization & server entry
    ├── config/
    │   └── database.js    # MongoDB Atlas connection setup
    ├── middlewares/
    │   └── auth.js        # JWT verification & route protection middleware
    ├── models/
    │   ├── user.js        # Mongoose User schema & helper methods
    │   └── connectionRequest.js # Mongoose ConnectionRequest schema & compound index
    ├── routes/
    │   ├── auth.js        # Signup, login, logout, password reset routes
    │   ├── profile.js     # Profile view, profile edit, password update routes
    │   ├── request.js     # Send connection request & review request routes
    │   └── user.js        # Feed algorithm, connection list, pending request routes
    └── utils/
        └── validation.js  # Input sanitization & field validation logic
```

---

## ⚙️ Environment Variables

Create or update the `.env` file in the root of `spark-backend`:

```env
PORT = 3000
DB_CONNECTION_SECRET = "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/spark"
JWT_SECRET = "YourSuperSecretJWTKey"
CLIENT_URL = "https://spark.scalewithabhi.in"
```

### Environment Variable Descriptions:
* `PORT`: Server port (defaults to `3000`).
* `DB_CONNECTION_SECRET`: MongoDB Atlas connection URI string.
* `JWT_SECRET`: Secret key used for signing and verifying JWT tokens.
* `CLIENT_URL`: Primary client domain for CORS headers.

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **MongoDB**: A running MongoDB instance or MongoDB Atlas connection string.

### Installation Steps

1. **Navigate to the backend directory**:
   ```bash
   cd spark-backend
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server with hot-reload**:
   ```bash
   npm run dev
   ```

4. **Start the production server**:
   ```bash
   npm start
   ```

---

## 🔌 Complete API Documentation

### 1. Authentication Routes (`/routes/auth.js`)

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/signup` or `/api/signup` | ❌ | Register new account with email, name, and strong password. |
| `POST` | `/login` or `/api/login` | ❌ | Authenticate credentials & receive HTTP-Only JWT cookie. |
| `POST` | `/logout` or `/api/logout` | ❌ | Invalidate session by clearing JWT cookie. |
| `POST` | `/password/reset` or `/api/password/reset` | ❌ | Reset user password via verified email address. |

### 2. Profile Management Routes (`/routes/profile.js`)

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/profile/view` or `/api/profile/view` | ✅ | Fetch currently logged-in user profile details. |
| `PATCH` | `/profile/edit` or `/api/profile/edit` | ✅ | Update user profile fields (`photoUrl`, `about`, `skills`, etc.). |
| `PATCH` | `/profile/password` or `/api/profile/password` | ✅ | Update password after current password verification. |

### 3. Connection Requests Routes (`/routes/request.js`)

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `POST` / `GET` | `/request/send/:status/:toUserId` | ✅ | Send request (`interested` / `ignored`) to target user. |
| `POST` / `GET` | `/request/review/:status/:requestId` | ✅ | Accept or reject a received connection request (`accepted` / `rejected`). |

### 4. User & Feed Operations (`/routes/user.js`)

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/feed` or `/api/feed` | ✅ | Get discovery feed stack (paginated via `page` & `limit` query params). |
| `GET` | `/user/requests/received` | ✅ | Get list of pending incoming connection requests (`interested`). |
| `GET` | `/user/connections` | ✅ | Get list of established mutual connections (`accepted`). |

---

## 🗄️ Database Schemas

### User Schema (`models/user.js`)
```javascript
{
  firstName: { type: String, required: true, minLength: 4, maxLength: 50 },
  lastName: { type: String },
  emailId: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  age: { type: Number, min: 18 },
  gender: { type: String, enum: ["male", "female", "other"] },
  photoUrl: { type: String, default: "..." },
  about: { type: String, default: "This is a default about of the user!" },
  skills: { type: [String] },
  isPremium: { type: Boolean, default: false },
  membershipType: { type: String }
}
```

### ConnectionRequest Schema (`models/connectionRequest.js`)
```javascript
{
  fromUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  toUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["ignored", "interested", "accepted", "rejected"], required: true }
}
// Compound Index: { fromUserId: 1, toUserId: 1 }
```

---

## 🌐 Production Nginx Setup

The repository includes a ready-to-use Nginx server configuration (`ngnix`):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name sparkv1.scalewithabhi.in;

    location /api/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 📄 License & Author

Developed by **Abhishek Gujar** for the **Spark Platform**.  
© 2026 **Spark Backend API**. Powered by [ScaleWithAbhi](https://scalewithabhi.in).
