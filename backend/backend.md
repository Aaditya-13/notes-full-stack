# Notes Full Stack Application

A full-stack notes management application built using Node.js, Express.js, MongoDB, Mongoose, JWT Authentication, Cloudinary, and Multer.

## Features

### Authentication & User Management

* User Registration
* User Login
* User Logout
* Refresh Access Token
* Get Current User
* Change Password
* Update User Details
* Update User Avatar
* JWT Authentication
* Refresh Token Rotation
* Password Hashing using bcrypt

### Notes Management

* Create Note
* Get All Notes
* Get Note By ID
* Update Note
* Delete Note
* Pin / Unpin Notes
* User Ownership Validation
* Protected Routes

---

## Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Authentication

* JSON Web Tokens (JWT)
* Refresh Tokens
* HTTP Only Cookies
* bcryptjs

### File Uploads

* Multer
* Cloudinary

### Utilities

* Custom Error Handling
* Async Handler Wrapper
* API Response Wrapper

---

## Project Structure

```text
src/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── utils/
├── db/
├── app.js
└── index.js
```

---

## Environment Variables

Create a `.env` file:

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

CORS_ORIGIN=*
```

---

# API Documentation

Base URL

```http
http://localhost:3000/api/v1
```

---

## User Routes

### Register User

```http
POST /users/register
```

Content-Type:

```text
multipart/form-data
```

Body:

| Field    | Type | Required |
| -------- | ---- | -------- |
| username | text | Yes      |
| email    | text | Yes      |
| password | text | Yes      |
| fullName | text | No       |
| avatar   | file | No       |

---

### Login User

```http
POST /users/login
```

Body:

```json
{
  "username": "sun13",
  "email": "sun@sun.com",
  "password": "sun12345"
}
```

---

### Refresh Access Token

```http
POST /users/refresh-token
```

---

### Logout User

```http
POST /users/logout
```

Authentication Required

---

### Get Current User

```http
GET /users/current-user
```

Authentication Required

---

### Update User Details

```http
PATCH /users/update-details
```

Body:

```json
{
  "fullName": "Scorching Arts",
  "email": "sun@arts.com"
}
```

Authentication Required

---

### Update User Avatar

```http
PATCH /users/update-avatar
```

Content-Type:

```text
multipart/form-data
```

Body:

| Field  | Type |
| ------ | ---- |
| avatar | file |

Authentication Required

---

### Change Password

```http
PATCH /users/change-password
```

Body:

```json
{
  "oldPassword": "oldPassword",
  "newPassword": "newPassword"
}
```

Authentication Required

---

## Notes Routes

All Notes Routes Require Authentication.

---

### Create Note

```http
POST /notes
```

Body:

```json
{
  "title": "Hello",
  "content": "This is my first note"
}
```

---

### Get All Notes

```http
GET /notes
```

Returns all notes belonging to the logged-in user.

Pinned notes are displayed first.

---

### Get Note By ID

```http
GET /notes/:id
```

Returns a single note if it belongs to the authenticated user.

---

### Update Note

```http
PATCH /notes/:id
```

Body:

```json
{
  "title": "Updated Title",
  "content": "Updated Content"
}
```

Either field may be provided.

---

### Delete Note

```http
DELETE /notes/:id
```

Deletes a note owned by the authenticated user.

---

### Pin / Unpin Note

```http
PATCH /notes/:id/pin
```

Toggles the pin status of a note.

---

## Security Features

* Password Hashing using bcryptjs
* JWT Based Authentication
* Refresh Token Validation
* Protected Routes Middleware
* User Ownership Verification
* Secure Cookie Support
* Input Validation
* Centralized Error Handling

---

## Future Improvements

* Search Notes
* Pagination
* Categories & Tags
* Soft Delete (Trash)
* Archive Notes
* Rate Limiting
* Swagger/OpenAPI Documentation
* Frontend Deployment
* Backend Deployment

---

## Author

Aaditya Patil

Backend developed using Express.js, MongoDB, JWT Authentication, Cloudinary, and Mongoose.
