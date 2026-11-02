# CineVault - Movie Collection API

A simple, beginner-friendly RESTful backend API built with **Node.js**, **Express.js**, **MongoDB Atlas**, and **Mongoose** for managing a personal movie collection. Designed for college assignments with clean, readable code and clear error handling.

---

## 📁 Project Structure

```text
CineVault/
├── config/
│   └── db.js                 # MongoDB connection setup
├── controllers/
│   └── movieController.js    # Business logic for CRUD operations
├── models/
│   └── Movie.js              # Mongoose schema and model
├── routes/
│   └── movieRoutes.js        # Express route definitions
├── .env                      # Environment variables (credentials - ignored by Git)
├── .env.example              # Template for environment variables
├── .gitignore                # Git ignore configuration
├── package.json              # Project dependencies and npm scripts
├── server.js                 # Main application entry point
├── CineVault.postman_collection.json # 1-click Postman test collection
└── README.md                 # Project documentation
```

---

## 🛠️ Technologies Used

- **Node.js** - JavaScript runtime environment
- **Express.js** - Minimalist web framework for Node.js
- **MongoDB Atlas** - Cloud NoSQL database
- **Mongoose** - Object Data Modeling (ODM) library for MongoDB
- **dotenv** - Environment variable management
- **nodemon** - Development server auto-reload utility
- **Postman** - API testing tool

---

## 🎬 Movie Data Model

Each movie object contains the following fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | String | Yes | Name of the movie |
| `genre` | String | Yes | Genre (e.g., Action, Sci-Fi, Drama) |
| `releaseYear` | Number | Yes | Year of release (e.g., 2010) |
| `director` | String | Yes | Director's name |
| `rating` | Number | Yes | Rating between 0 and 10 |

---

## 🚀 Getting Started

### 1. Prerequisites

Make sure you have installed on your computer:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Git](https://git-scm.com/)
- [Postman](https://www.postman.com/downloads/)

### 2. Clone / Open Project

Open your terminal or command prompt in the project root folder:
```bash
cd "CineVault"
```

### 3. Install Dependencies

Install the required packages (`express`, `mongoose`, `dotenv`) and dev dependency (`nodemon`):
```bash
npm install
```
*(On Windows PowerShell, if script execution is restricted, use `npm.cmd install`)*

### 4. Configure MongoDB Atlas (Important Manual Step)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and log in or create a free account.
2. Create a free **M0 Shared Cluster**.
3. **Database Access**: Under *Security* > *Database Access*, create a new user (e.g., username `admin`, choose a secure password). Remember these credentials!
4. **Network Access**: Under *Security* > *Network Access*, click **Add IP Address** and select **Allow Access from Anywhere** (`0.0.0.0/0`) for testing/development.
5. **Get Connection String**:
   - Go to *Database* > *Deployments* > click **Connect**.
   - Choose **Drivers** (Node.js).
   - Copy the connection string. It looks like:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
6. Open the `.env` file in the project root and replace `<username>` and `<password>` with your database user credentials. Specify `cinevault` as the database name:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://admin:YourPassword123@cluster0.xxxxx.mongodb.net/cinevault?retryWrites=true&w=majority
   ```

> ⚠️ **Note:** Never commit the `.env` file to GitHub. It is already added to `.gitignore`.

### 5. Run the Server

Start the development server with auto-reload:
```bash
npm run dev
```

For standard production execution:
```bash
npm start
```

Expected output in console:
```
Server running on port 5000
MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
```

---

## 📡 API Endpoints

Base URL: `http://localhost:5000/api/movies`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/movies` | Create a new movie |
| `GET` | `/api/movies` | Retrieve all movies |
| `GET` | `/api/movies/:id` | Retrieve a single movie by ID |
| `PUT` | `/api/movies/:id` | Update an existing movie by ID |
| `DELETE` | `/api/movies/:id` | Delete a movie by ID |

---

## 🧪 Postman Testing Guide

### Option A: Import Pre-built Collection (Fastest)
1. Open **Postman**.
2. Click **Import** in the top-left corner.
3. Select the file `CineVault.postman_collection.json` located in this project folder.
4. All 5 requests will be automatically configured for you!

---

### Option B: Manual Testing Instructions

#### 1. Create a Movie (POST)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/movies`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "title": "Inception",
    "genre": "Sci-Fi",
    "releaseYear": 2010,
    "director": "Christopher Nolan",
    "rating": 8.8
  }
  ```
- **Expected Status:** `201 Created`
- **Sample Response:**
  ```json
  {
    "success": true,
    "message": "Movie created successfully",
    "data": {
      "_id": "67261a87e502c11451ad88b1",
      "title": "Inception",
      "genre": "Sci-Fi",
      "releaseYear": 2010,
      "director": "Christopher Nolan",
      "rating": 8.8,
      "createdAt": "2026-11-02T11:00:00.000Z",
      "updatedAt": "2026-11-02T11:00:00.000Z",
      "__v": 0
    }
  }
  ```
> 💡 *Copy the `_id` from this response to test the ID-based endpoints below!*

---

#### 2. Get All Movies (GET)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/movies`
- **Expected Status:** `200 OK`
- **Sample Response:**
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "67261a87e502c11451ad88b1",
        "title": "Inception",
        "genre": "Sci-Fi",
        "releaseYear": 2010,
        "director": "Christopher Nolan",
        "rating": 8.8
      }
    ]
  }
  ```

---

#### 3. Get Movie by ID (GET)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/movies/67261a87e502c11451ad88b1` *(use your real movie `_id`)*
- **Expected Status:** `200 OK`
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "_id": "67261a87e502c11451ad88b1",
      "title": "Inception",
      "genre": "Sci-Fi",
      "releaseYear": 2010,
      "director": "Christopher Nolan",
      "rating": 8.8
    }
  }
  ```

---

#### 4. Update a Movie (PUT)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/movies/67261a87e502c11451ad88b1` *(use your real movie `_id`)*
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "title": "Inception (Remastered)",
    "genre": "Sci-Fi / Thriller",
    "releaseYear": 2010,
    "director": "Christopher Nolan",
    "rating": 9.2
  }
  ```
- **Expected Status:** `200 OK`
- **Sample Response:**
  ```json
  {
    "success": true,
    "message": "Movie updated successfully",
    "data": {
      "_id": "67261a87e502c11451ad88b1",
      "title": "Inception (Remastered)",
      "genre": "Sci-Fi / Thriller",
      "releaseYear": 2010,
      "director": "Christopher Nolan",
      "rating": 9.2
    }
  }
  ```

---

#### 5. Delete a Movie (DELETE)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/movies/67261a87e502c11451ad88b1` *(use your real movie `_id`)*
- **Expected Status:** `200 OK`
- **Sample Response:**
  ```json
  {
    "success": true,
    "message": "Movie deleted successfully"
  }
  ```

---

### Error Handling Responses

- **Invalid MongoDB ID Format** (`400 Bad Request`):
  ```json
  {
    "success": false,
    "message": "Invalid movie ID format"
  }
  ```
- **Movie Not Found** (`404 Not Found`):
  ```json
  {
    "success": false,
    "message": "Movie not found"
  }
  ```
- **Validation Failure (Missing field / rating out of 0-10)** (`400 Bad Request`):
  ```json
  {
    "success": false,
    "message": "Movie validation failed: rating: Rating cannot exceed 10"
  }
  ```

---

## 🐙 GitHub Submission Guide

Follow these exact steps to push this project to a new **PUBLIC** GitHub repository:

### Step 1: Initialize Git
In the project root folder, open your terminal and run:
```bash
git init
```

### Step 2: Verify .gitignore
Check that `.env` and `node_modules` are not tracked:
```bash
git status
```
*(Make sure `.env` and `node_modules/` do NOT appear in the untracked list).*

### Step 3: Stage and Commit Files
```bash
git add .
git commit -m "feat: complete CineVault Movie Collection API backend"
```

### Step 4: Create a New Public Repository on GitHub
1. Log in to [GitHub](https://github.com).
2. Click the **+** icon in the upper-right corner and select **New repository**.
3. Name your repository (e.g., `CineVault-Movie-API`).
4. Set visibility to **Public**.
5. Do **not** initialize with a README, .gitignore, or license (we already created them).
6. Click **Create repository**.

### Step 5: Link and Push
Replace `<YOUR_GITHUB_USERNAME>` and `<YOUR_REPO_NAME>` with your actual GitHub info:
```bash
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
git push -u origin main
```

---

## 📋 College Assignment Checklist

- [x] Node.js project initialized with `package.json`
- [x] Dependencies installed: `express`, `mongoose`, `dotenv`
- [x] Dev dependency installed: `nodemon`
- [x] `npm run dev` configured to start the server
- [x] MongoDB Atlas connection configured via Mongoose
- [x] Connection string securely stored in `.env`
- [x] `.env` and `node_modules` added to `.gitignore`
- [x] Movie model defined with 5 required fields and validations
- [x] Separate controllers (`movieController.js`) and routes (`movieRoutes.js`)
- [x] 5 CRUD API endpoints implemented (`POST`, `GET`, `GET/:id`, `PUT/:id`, `DELETE/:id`)
- [x] `async/await` and Express JSON middleware used
- [x] Status codes (201, 200, 400, 404, 500) and error handling implemented
- [x] Invalid ObjectId and 404 missing movie scenarios handled
- [x] Postman collection and manual testing documentation provided
- [x] GitHub push instructions included
