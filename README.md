# Friend Note


## 1. Overview
**FriendNote** is a full-stack web application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack, designed to help users search, add friends, manage friend lists, and receive friend recommendations. The app provides an intuitive and responsive frontend interface, along with an optimized backend to ensure scalability and performance.

### Key Objectives:
- Allow users to authenticate, search for friends, and manage their friend requests.
- Use a scalable database design separating user authentication, user details, friend management, and friend requests.
- Implement a friend recommendation system based on mutual connections and interests.
- Future-proof the application by allowing easy scaling and the transition to Redux for state management when needed.

---

## 2. Technologies Used
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **State Management**: Context API (planned future migration to Redux)
- **Deployment**: Vercel (for the frontend) and MongoDB Atlas (for the database)
- **Version Control**: Git

---

## 3. Features
### Core Features:
- **User Authentication**: Secure sign-up, login, and JWT-based authentication.
- **Search Users**: Ability to search for other registered users by name or username.
- **Friend Requests**: Send, receive, accept, and reject friend requests.
- **Friend Lists**: Manage friends list and the option to unfriend users.
- **Friend Recommendation System**: Suggest friends based on mutual connections and interests.
  
### Additional Features:
- **User Profiles**: Allow users to add avatars, bio, and interests to their profiles.
- **Weekly Block on Friend Requests**: Prevent harassment or stalking by introducing a 7-day gap between friend requests.
- **Enhanced Friend Recommendations**: Using mutual interests or hobbies for accurate friend recommendations.
- **Improved UX**: Enhanced UI/UX for mobile responsiveness and accessibility.
- **Profile Customization**: User can update avatar, bio, and interests.


---

## 4. Setup Instructions
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/hemantsoni23/friend_note.git
   cd friend_note
   ```

2. **Install Dependencies:**
   - **Frontend**:
     ```bash
     cd client
     npm install
     ```
   - **Backend**:
     ```bash
     cd server
     npm install
     ```

3. **Create Environment Files:**
   - **Frontend (.env):**
     ```plaintext
     REACT_APP_API_BASE_URL=http://localhost:5000
     ```
   - **Backend (.env):**
     ```plaintext
     NODE_ENV=development
     PORT=5000
     MONGODB_CONNECTION_STR=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```

4. **Database Configuration:**
   - Connect MongoDB: Replace `your_mongodb_connection_string` with your actual MongoDB URI (use MongoDB Atlas if deploying on Vercel or elsewhere).

---

## 5. Database Configuration
The application uses separate collections for:
- **User Authentication**: Stores user credentials and token.
- **User Details**: Stores user profile information (avatar, bio, interests).
- **Friends Management**: Manages friend lists and friend requests.

### Collections:
- **Auth**: Holds user credentials.
- **Users**: Holds user details.
- **Friends**: Stores friend relationships.
- **FriendRequests**: Tracks friend requests between users.

---

## 6. API Endpoints
### User Authentication
- **Sign Up**: `/api/auth/register`
- **Login**: `/api/auth/login`
- **Profile**: `/api/users/` (fetch logged-in user data)

### Friends
- **Search Users**: `/api/users/search`
- **Send Friend Request**: `/api/friends/send-friend-request`
- **Accept Friend Request**: `/api/user/accept-friend-request`
- **Reject Friend Request**: `/api/user/reject-friend-request`
- **Recommendations**: `/api/users/recommendations`

---

## 7. Running the Application
1. **Start the Backend Server:**
   ```bash
   cd server
   node index.js
   ```
2. **Start the Frontend Development Server:**
   ```bash
   cd client
   npm start
   ```

3. Open your browser and visit `http://localhost:3000` to access the application.

---

## 8. Project Structure
```
friendnote/
│
├── client/                // React frontend
│   ├── public/
│   ├── src/
│   │   └── components/   // React components
│   │   └── context/     // Context API or Redux
│   │   └── pages/        // Page components
│   │   └── hooks/        // Custom hooks
│   │   └── utils/        // Helper functions
│   └── .env               // Frontend environment variables
│
├── server/                // Node.js backend
│   ├── config/           // Configurations like db, passport, etc.
│   ├── models/           // MongoDB models
│   ├── routes/           // API routes
│   ├── middleware/       // Middleware like CORS, Auth
│   └── .env              // Backend environment variables
│
└── README.md             // This file
```

---

## 9. Future Work and Improvements
1. **State Management Migration**: Transition from Context API to Redux for better scalability and state management.
2. **Notifications**: Add real-time notifications for friend requests and recommendations.
3. **Friend Status**: Implement more detailed friend status (e.g., online/offline) and last seen.
4. **Scalability Improvements**: Optimize database queries and refactor backend to handle large user bases.
5. **Security Enhancements**: Implement password hashing, two-factor authentication, and rate limiting for sensitive operations.
