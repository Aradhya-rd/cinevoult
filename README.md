# CineVault — Movie Collection Management System

A beginner-friendly, clean and complete full-stack Movie Collection Management System built with **Node.js**, **Express.js**, **MongoDB Atlas**, **Mongoose**, and **Vanilla JavaScript (HTML5/CSS3)**.

Designed for college assignments and live teacher demonstrations with clean architecture, robust validation, full REST API CRUD support, and zero unnecessary complex frameworks.

---

## 📁 Project Structure

```text
CineVault/
│
├── config/
│   └── db.js                        # Mongoose connection logic & Atlas validation
│
├── controllers/
│   └── movieController.js           # CRUD controllers (POST, GET, PUT, DELETE)
│
├── models/
│   └── Movie.js                     # Mongoose schema with field validation
│
├── routes/
│   └── movieRoutes.js               # Express route definitions for /api/movies
│
├── public/                          # Frontend client files (served by Express)
│   ├── index.html                   # Semantic HTML5 user interface
│   ├── style.css                    # Clean, minimal, responsive CSS3 styling
│   └── script.js                    # Vanilla JS DOM & fetch() API integration
│
├── .env                             # Environment variables (Credentials - ignored by Git)
├── .env.example                     # Sample template for environment variables
├── .gitignore                       # Git ignore rules (.env, node_modules, etc.)
├── package.json                     # Project scripts and dependencies
├── server.js                        # Main Express application entry point
├── automated-test.js                # Repeatable end-to-end automated API test script
├── CineVault.postman_collection.json# Postman desktop testing collection
└── README.md                        # Complete project documentation
```

---

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (Fetch API)
- **Backend:** Node.js, Express.js (REST API architecture)
- **Database:** MongoDB Atlas (Cloud NoSQL), Mongoose ODM
- **Testing:** Postman Desktop, Native Node.js Automated Test Suite (`automated-test.js`)

---

## 🎬 Movie Data Model

Every movie stored in MongoDB has the following schema:

| Field | Type | Validation Rules | Description |
|---|---|---|---|
| `title` | String | Required, trimmed | Name of the movie |
| `genre` | String | Required, trimmed | Movie genre (e.g. Action, Sci-Fi) |
| `releaseYear` | Number | Required | Release year (e.g. 2010) |
| `director` | String | Required, trimmed | Director name |
| `rating` | Number | Required, Min: 0, Max: 10 | IMDb-style rating |
| `createdAt` | Date | Managed by Mongoose | Timestamp of creation |
| `updatedAt` | Date | Managed by Mongoose | Timestamp of last update |

---

## 🚀 Prerequisites & Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
- [Git](https://git-scm.com/)
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account

### 2. Clone or Navigate to the Project Directory
```bash
cd "CineVault"
```

### 3. Install Dependencies
```bash
npm install
```
*(On Windows PowerShell, if execution policy causes issues, run `npm.cmd install`)*

---

## 🌐 MongoDB Atlas Setup (Crucial Step)

To connect your project to the cloud database:

1. Log in to [MongoDB Atlas](https://account.mongodb.com/).
2. Create or open your free **M0 cluster**.
3. **Configure Database User:**
   - Go to **Security** → **Database Access**.
   - Click **Add New Database User**.
   - Create a user (e.g. `admin`) and set a password. Note these credentials.
4. **Configure Network Access (Whitelist IP):**
   - Go to **Security** → **Network Access**.
   - Click **Add IP Address**.
   - Click **Allow Access from Anywhere** (`0.0.0.0/0`) or add your current public IP address.
   - Click **Confirm**.
5. **Obtain Connection String:**
   - Under **Deployment** → **Database**, click **Connect**.
   - Select **Drivers** (Node.js).
   - Copy the connection string.
6. **Set up `.env`:**
   - Create or edit the `.env` file in the project root:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/cinevault?retryWrites=true&w=majority
   ```
   - Replace `<username>` and `<password>` with your database user credentials.
   - Ensure the database name is `/cinevault`.

---

## 💻 Running the Application

### Start in Development Mode (with nodemon auto-restart):
```bash
npm run dev
```

### Start in Production Mode:
```bash
npm start
```

When connected successfully, the terminal will log:
```text
MongoDB Connected: cluster0-shard-xx.mongodb.net
Server running on port 5000
Frontend accessible at http://localhost:5000
```

### Open the Application
Open your web browser and navigate to:
```
http://localhost:5000
```

---

## 📡 REST API Endpoints

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/api/movies` | Retrieve all movies | `200`, `500` |
| `POST` | `/api/movies` | Add a new movie | `201`, `400`, `500` |
| `GET` | `/api/movies/:id` | Get single movie by MongoDB ID | `200`, `400`, `404`, `500` |
| `PUT` | `/api/movies/:id` | Update existing movie by ID | `200`, `400`, `404`, `500` |
| `DELETE` | `/api/movies/:id` | Delete a movie by ID | `200`, `400`, `404`, `500` |

### Example Request Payloads

#### Create Movie (`POST /api/movies`):
```json
{
  "title": "Interstellar",
  "genre": "Sci-Fi",
  "releaseYear": 2014,
  "director": "Christopher Nolan",
  "rating": 8.7
}
```

#### Update Movie (`PUT /api/movies/:id`):
```json
{
  "title": "Interstellar (IMAX Edition)",
  "genre": "Sci-Fi",
  "releaseYear": 2014,
  "director": "Christopher Nolan",
  "rating": 9.1
}
```

---

## 🧪 Testing

### 1. Automated API Test Suite
Run the built-in automated test script that tests all 5 CRUD operations end-to-end against the server and verifies MongoDB persistence:
```bash
npm test
```

### 2. Postman Desktop
1. Open **Postman Desktop**.
2. Click **Import** (top left).
3. Select `CineVault.postman_collection.json` located in the root folder.
4. Execute the requests sequentially:
   - `1. Create Movie (POST)`
   - `2. Get All Movies (GET)`
   - Copy the `_id` of the created movie into the collection variable `movie_id`
   - `3. Get Movie by ID (GET)`
   - `4. Update Movie by ID (PUT)`
   - `5. Delete Movie by ID (DELETE)`

---

## ❓ Common Issues & Troubleshooting

| Error | Root Cause | Solution |
|---|---|---|
| `MongoServerSelectionError` / `ETIMEOUT` / `tlsv1 alert internal error` | Atlas Network Access IP whitelist is blocking your connection | Go to Atlas → **Network Access** → Click **Add IP Address** → Choose **Allow Access From Anywhere** (`0.0.0.0/0`) or add your current IP. |
| `MongoServerError: bad auth : Authentication failed` | Incorrect database username or password in `.env` | Verify user credentials in MongoDB Atlas **Database Access** and update `.env`. |
| `EADDRINUSE: address already in use :::5000` | Port 5000 is occupied by another process | Change `PORT=5001` in `.env` or terminate the process holding port 5000. |
| `ValidationError: Rating cannot exceed 10` | Invalid input value submitted | Rating must be a number between 0 and 10. |
