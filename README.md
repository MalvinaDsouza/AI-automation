# Dealership Creative Automation Tool

A web-based tool to generate dealership creatives using:

- Brand selection
- Dealership selection
- Background image upload
- Dynamic logo + dealer details
- Bulk creative generation
- Automatic image download

---

# Project Structure

AI-automation/
│
├── backend/
│ ├── app.py
│ ├── uploads/
│ ├── outputs/
│ └── static/
│ └── logos/
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Creative.jsx
│ │ │ └── Creativepanels.jsx
│ │ ├── css/
│ │ │ ├── creative.css
│ │ │ └── common.css
│ │ ├── App.jsx
│ │ └── main.jsx
│ │
│ └── package.json
│
└── README.md

---

# Prerequisites

Install:

- Python 3.10+
- React.js 18+
- MongoDB

---

# Backend Setup

Navigate to backend:

cd backend

Create virtual environment:

python -m venv venv

Activate environment:

Mac/Linux:

source venv/bin/activate

Windows:

venv\Scripts\activate

Install dependencies:

pip install flask flask-cors pymongo pillow

Start MongoDB:

mongod

Run backend:

python app.py

Backend runs on:

http://127.0.0.1:5000

---

# Frontend Setup

Navigate to frontend:

cd frontend

Install dependencies:

npm install

Install routing:

npm install react-router-dom axios

Run frontend:

npm run dev

Frontend runs on:

http://localhost:5173

---

# MongoDB Setup

Database:

creative_db

Collections:

## accounts

Example:

{
"name": "Tata"
}

## dealerships

Example:

{
"name": "Bellad Tata",
"account_id": "ACCOUNT_ID",
"logo": "logo-dark.png",
"phone": "8238883535",
"location": "Bommasandra | Sarjapur"
}

Place logos inside:

backend/static/logos/

---

# How to Run

Step 1:

Start MongoDB.

Step 2:

Run Flask backend.

python app.py

Step 3:

Run React frontend.

npm run dev

Step 4:

Open browser:

http://localhost:5173

---

# Usage

1. Select brand
2. Select one or multiple dealerships
3. Upload PNG/JPG image
4. Click Generate
5. Preview creatives
6. Download generated images

---

# Supported File Types

- .png
- .jpg
- .jpeg

---

# APIs

## Get brands

GET /accounts

## Get dealerships

GET /dealerships/<account_id>

## Get dealer details

GET /dealer/<dealer_id>

## Generate creatives

POST /generate

## Download image

GET /download/<filename>

---

# Author

Malvina Dsouza
