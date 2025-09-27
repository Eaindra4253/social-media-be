Social Media Backend – REST API

This repository implements a backend system with user authentication, user profiles, posts, comments, and reactions. The APIs are RESTful and include file uploads (images and videos).

- All functions in the code are documented inline with detailed comments for easier understanding and maintenance.

Features

- Authentication: register, login, logout using JWT tokens.
- User Profile: view authenticated user profile.
- Posts: create, edit, delete and list posts. Supports image and video upload.
- Newsfeed: get all posts with author info, reactions, and comments.
- Comments: add comments to posts and can see all comments of user post.
- Reactions: like/unlike posts.
- Pagination: supported for listing posts.

Setup Instructions

1. Clone the repository:

   - git clone https://github.com/yourusername/backend.git

2. Install dependencies:

   - npm install

3. Set environment variables in .env:

   # MongoDB Connection URI

   MONGO_URI = "mongodb+srv://username:password/?retryWrites=true&w=majority"

   # JWT Secret for token signing

   JWT_SECRET = "your_jwt_secret"

   # Optional: Port for your server

   PORT = 5000

4. Run the server:

   - npm start

5. The API will be available at: http://localhost:5000
