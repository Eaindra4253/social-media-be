# Social Media Backend – REST API

This repository implements a **backend system** for a social media application, including **user authentication, user profiles, posts, comments, and reactions**.  
The APIs are **RESTful** and support **file uploads** (images and videos).

All functions in the code are documented **inline with detailed comments** for easier understanding and maintenance.

---

## Features

- **Authentication**
  - Register, login, and logout using **JWT tokens**.
- **User Profile**
  - View authenticated user profile with post, comment, and reaction counts.
- **Posts**
  - Create, edit, delete, and list posts.
  - Supports **image and video uploads**.
- **Newsfeed**
  - Get all posts with author info, reactions, and comments.
- **Comments**
  - Add comments to posts and view all comments of a user’s post.
- **Reactions**
  - Like or unlike posts (toggle behavior).
- **Pagination**
  - Supported for listing posts.

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/backend.git
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set environment variables

Create a .env file in the root directory with the following content:

# MongoDB Connection URI

MONGO_URI="mongodb+srv://username:password/?retryWrites=true&w=majority"

# JWT Secret for token signing

JWT_SECRET="your_jwt_secret"

# Optional: Port for your server

PORT=5000

### 4. Run the server locally

```bash
npm start
The server will be available at: http://localhost:5000
```

Deployment on Railway

To deploy on Railway (free hosting for hobby projects):

1.Sign up at https://railway.app
2.Create a new project and select Deploy from GitHub
3.Connect your repository (backend)
4.Set environment variables in Railway:
MONGO_URI
JWT_SECRET
PORT (Railway will provide a dynamic port if needed) 5. Click Deploy

Your production API will be available at:
https://social-media-be.up.railway.app

### API Documentation (Swagger)

-- All endpoints are documented using Swagger with request and response examples.
-- Local Swagger UI: http://localhost:5000/api-docs

> ⚠️ **Note:** For local development, make sure to allow `localhost:3000` (frontend) and `localhost:5000` (backend) in `app.js` CORS settings.
