# Project Submission & Evaluation Backend

This is the backend API for the Project Submission & Evaluation platform, built with Node.js, Express, and MongoDB.

## Features
- Learner project submission (file + GitHub link)
- Instructor evaluation (rating, tags, comments)
- JWT authentication for learners and instructors
- File upload with sanitization and size limits
- MongoDB for data storage

## Setup
1. Clone the repo
2. Run `npm install`
3. Set up your `.env` file (see example below)
4. Start MongoDB locally or update `MONGODB_URI` for your environment
5. Run `npm run dev` for development (with nodemon)

### .env Example
```
MONGODB_URI=mongodb://localhost:27017/project_submission
JWT_SECRET=your_jwt_secret
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

## Scripts
- `npm run dev` — Start server with nodemon
- `npm start` — Start server

## API Endpoints
- `POST /api/project/submit` — Learner submits project
- `GET /api/project/:courseId` — Instructor fetches submissions
- `POST /api/project/evaluate` — Instructor evaluates submission
- `GET /api/project/evaluation/:userId` — Learner views feedback

## License
MIT 