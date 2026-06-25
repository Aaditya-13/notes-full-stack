# 🦾 INK & IRON — Full Stack Notes Application

[![Website](https://img.shields.io/website?url=https%3A%2F%2Finkandiron.vercel.app&up_message=Live&down_message=Offline&label=Live%20Demo&logo=vercel)](https://inkandiron.vercel.app) &nbsp; **|** &nbsp; **[inkandiron.vercel.app](https://inkandiron.vercel.app)**


A modern, full-stack note-taking application built with the MERN stack, featuring secure authentication, cloud-based image storage, and a clean, responsive user interface. The project follows a monorepo architecture with separate frontend and backend applications.

---

# 📖 Overview

INK & IRON is designed to provide a fast and secure workspace for managing notes, wrapped in a bold, high-contrast Neobrutalist user interface. Beyond its distinct aesthetic, it implements strict modern web development practices including JWT authentication with HTTP-only cookies, rate limiting, cloud media storage, and RESTful APIs.

---

# ✨ Features

* Secure User Authentication (JWT + Refresh Tokens)
* HTTP-only Cookie-based Authentication
* Guest Login Support
* CRUD Operations for Notes
* Pin / Unpin Notes
* Full-text Search
* Custom Color Tags
* Avatar Upload using Cloudinary
* Password Management
* Responsive UI
* RESTful API Architecture
* Rate Limiting for API Protection

---

# 🛠 Tech Stack

## Frontend

* React.js
* Vite
* React Router
* Axios
* CSS

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer
* Cloudinary

## Security

* HTTP-only Cookies
* CORS Configuration
* Password Hashing (bcrypt)
* JWT Access & Refresh Tokens
* Express Rate Limiting

---

# 📂 Project Structure

```
NOTES-FULLSTACK/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── utility/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── .env
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── .env
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone <repository-url>
cd ink-and-iron
```

---

## 2. Install dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

---

## 3. Configure Environment Variables

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3000
```

### Backend (`backend/.env`)

```env
PORT=3000

MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CORS_ORIGIN=http://localhost:5173
```

---

## 4. Start Development Servers

### Backend

```bash
npm run dev
```

### Frontend

```bash
npm run dev
```

The application will now be available at:

* Frontend: `http://localhost:5173`
* Backend: `http://localhost:3000`

---

## 📌 API Endpoints

Base URL:

```text
http://localhost:3000/api/v1
```

---

## 👤 User Endpoints

| Method    | Endpoint                 | Example Request Body                                                                                                                                   | Description                                                                   |
| --------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| **POST**  | `/users/register`        | **Form Data**<br>`username: "john123"`<br>`email: "john@example.com"`<br>`password: "Password123"`<br>`fullName: "John Doe"`<br>`avatar: <image-file>` | Register a new user account.                                                  |
| **POST**  | `/users/login`           | `json { "email":"john@example.com", "password":"Password123" } `                                                                                       | Authenticate a user and issue access & refresh tokens via HTTP-only cookies.  |
| **POST**  | `/users/refresh-token`   | *No request body*                                                                                                                                      | Generate a new access token using the refresh token stored in secure cookies. |
| **POST**  | `/users/logout`          | *No request body*                                                                                                                                      | Invalidate the current session and clear authentication cookies.              |
| **GET**   | `/users/current-user`    | *No request body*                                                                                                                                      | Retrieve the authenticated user's profile information.                        |
| **PATCH** | `/users/update-details`  | `json { "fullName":"John Doe", "email":"john@example.com" } `                                                                                          | Update the authenticated user's profile details.                              |
| **PATCH** | `/users/update-avatar`   | **Form Data**<br>`avatar: <image-file>`                                                                                                                | Upload or replace the user's profile image.                                   |
| **PATCH** | `/users/change-password` | `json { "oldPassword":"OldPassword123", "newPassword":"NewPassword123" } `                                                                             | Update the user's password after verifying the current password.              |
| **POST**  | `/users/guest-login`     | *No request body*                                                                                                                                      | Create a temporary guest session without registration.                        |

---

## 📝 Notes Endpoints

| Method     | Endpoint                    | Example Request Body                                                           | Description                                             |
| ---------- | --------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------- |
| **GET**    | `/notes`                    | *No request body*                                                              | Retrieve all notes belonging to the authenticated user. |
| **POST**   | `/notes`                    | `json { "title":"Meeting Notes", "content":"Project discussion summary..." } ` | Create a new note.                                      |
| **GET**    | `/notes/:id`                | *No request body*                                                              | Retrieve a note by its ID.                              |
| **PATCH**  | `/notes/:id`                | `json { "title":"Updated Title", "content":"Updated content" } `               | Update an existing note.                                |
| **DELETE** | `/notes/:id`                | *No request body*                                                              | Permanently delete a note.                              |
| **PATCH**  | `/notes/:id/pin`            | *No request body*                                                              | Toggle the pinned status of a note.                     |
| **GET**    | `/notes?search=meeting`     | Query Parameter:<br>`search=meeting`                                           | Search notes using a keyword.                           |
| **PATCH**  | `/notes/:noteId/add-tag`    | `json { "tagId":"684c5f61df34a5b90fdce001" } `                                 | Attach an existing tag to a note.                       |
| **PATCH**  | `/notes/:noteId/remove-tag` | `json { "tagId":"684c5f61df34a5b90fdce001" } `                                 | Remove an attached tag from a note.                     |

---

## 🏷️ Tag Endpoints

| Method     | Endpoint    | Example Request Body                             | Description                                          |
| ---------- | ----------- | ------------------------------------------------ | ---------------------------------------------------- |
| **GET**    | `/tags`     | *No request body*                                | Retrieve all tags created by the authenticated user. |
| **POST**   | `/tags`     | `json { "name":"Work", "color":"#7C3AED" } `     | Create a new tag.                                    |
| **PATCH**  | `/tags/:id` | `json { "name":"Personal", "color":"#2563EB" } ` | Update a tag's name or color.                        |
| **DELETE** | `/tags/:id` | *No request body*                                | Delete a tag permanently.                            |

# 🔒 Security

This project implements several security best practices:

* JWT Authentication
* Refresh Token Rotation
* HTTP-only Cookies
* Password Hashing with bcrypt
* CORS Protection
* Request Validation
* API Rate Limiting
* Protected Routes
* Secure Environment Variables

---

# ☁️ Deployment

This project utilizes a monorepo architecture. To deploy the application successfully, the frontend and backend must be deployed separately with specific root directory configurations to ensure proper build execution.

### 1. Backend Deployment (Render)
1. Create a new **Web Service** on Render and connect your GitHub repository.
2. **Root Directory:** Set to `backend`.
3. **Build Command:** `npm install`
4. **Start Command:** `node src/index.js` *(Note: Ensure you are using the standard Node command, not development tools like `nodemon`).*
5. **Environment Variables:** Add all required backend variables from your `.env` file. 
   * *Critical Step:* Temporarily set `CORS_ORIGIN=*` during this initial setup to allow the server to boot successfully before the frontend URL exists.
6. Deploy the service and copy the provided Render API URL.

### 2. Frontend Deployment (Vercel)
1. Import your GitHub repository into Vercel as a new project.
2. **Root Directory:** Edit and select the `frontend` folder.
3. **Framework Preset:** Ensure **Vite** is selected. Leave all build override toggles off to use default configurations (`npm run build`).
4. **Environment Variables:** Add `VITE_API_URL` and set its value to your live Render API URL (ensure there is no trailing slash).
5. Deploy the application and copy the provided Vercel frontend URL.

### 3. Final CORS Configuration
To secure the application and enable HTTP-only cookies across domains, you must restrict cross-origin access exclusively to your deployed frontend.

1. Return to your Render backend dashboard.
2. Navigate to the Environment Variables settings.
3. Update `CORS_ORIGIN` from the temporary `*` to your exact deployed Vercel URL (e.g., `https://inkandiron.vercel.app`).
4. Save the changes. Render will automatically restart the server with the secure CORS policy enforced.

---

# 📄 License

This project is intended for educational and portfolio purposes.
