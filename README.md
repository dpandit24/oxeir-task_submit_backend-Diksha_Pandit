# TaskSubmit Backend

This is the backend API for the Project Submission & Evaluation platform, built with Node.js, Express, and MongoDB.

## Features

### Core Functionality
- **Learner project submission** (file + GitHub link)
- **Instructor evaluation** (rating, tags, comments)
- **JWT authentication** for learners and instructors
- **File upload** with sanitization and size limits
- **MongoDB** for data storage
- **Dashboard analytics** for instructors (total, pending, evaluated submissions)
- **Filtered submissions** with course and status filters
- **Database seeding** with initial data (20 courses, 4 users)

### Technical Architecture & Best Practices

#### **Layered Architecture**
- **Routes Layer**: Request/response handling, validation
- **Services Layer**: Business logic and orchestration
- **Repository Layer**: Data access abstraction
- **Models Layer**: Database schemas and validation

#### **Security & Authentication**
- **JWT-based authentication** with role-based access control
- **Password hashing** using bcryptjs (salt rounds: 10)
- **Helmet.js** for security headers
- **CORS** configuration for cross-origin requests
- **File upload security** (type validation, size limits, sanitization)
- **Supabase storage integration** (cloud file storage with signed URLs)

#### **Data Validation & Sanitization**
- **Joi validation** for request body and query parameters
- **Mongoose schema validation** for database integrity
- **File type validation** (PDF only)
- **File size limits** (configurable via environment variables)
- **Input sanitization** and error handling

#### **Middleware Stack**
- **Authentication middleware** (JWT verification)
- **Authorization middleware** (role-based access)
- **Error handling middleware** (centralized error responses)
- **File upload middleware** (Multer configuration)
- **Request logging** and debugging

#### **Database Design**
- **MongoDB with Mongoose ODM**
- **Referential integrity** with population
- **Indexed fields** for performance
- **Schema validation** at database level
- **Proper data relationships** (User → ProjectSubmission → Course)

#### **API Design Patterns**
- **RESTful endpoints** with proper HTTP methods
- **Consistent response formats** and error codes
- **Query parameter filtering** and sorting
- **File serving** via static middleware
- **Environment-based configuration**

#### **Development & Deployment**
- **Environment variables** for configuration
- **Nodemon** for development hot-reloading
- **Modular code structure** for maintainability
- **Comprehensive error handling**
- **Postman collection** for API testing
- **Database seeding** for development

#### **Code Quality**
- **Separation of concerns** (routes, services, repositories)
- **Async/await** for clean asynchronous code
- **Proper error propagation** and handling
- **Consistent naming conventions**
- **Modular imports** and exports
- **Type safety** through schema validation

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd oxeir-task_submit_frontend-Diksha_Pandit
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/project_submission
JWT_SECRET=your_jwt_secret
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
PORT=5000

# Supabase Configuration (for file uploads)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your_supabase_anon_key_here
```

**Note**: You need to set up a Supabase project and create a storage bucket named `uploads` for file uploads to work.

### 3.1. Supabase Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Get your project URL and anon key** from the project settings
3. **Create a storage bucket** named `uploads` in your Supabase dashboard
4. **Set bucket permissions** to private (signed URLs will be used for access)
5. **Add the credentials** to your `.env` file

The server will automatically create the bucket if it doesn't exist when you start the application.

**Test Supabase Integration:**
```bash
npm run test-supabase
```

### 4. Start MongoDB

Make sure MongoDB is running locally or update the `MONGODB_URI` in your `.env` file to point to your MongoDB instance.

### 5. Start Development Server

```bash
npm run dev
```

The API server will be available at `http://localhost:5000`

**Note**: The server will automatically seed the database with initial data (20 courses, 4 users) on first startup.

## API Endpoints

### Authentication
- `POST /api/auth/register` — User registration (learner/instructor)
- `POST /api/auth/login` — User login with JWT token

### Courses
- `GET /api/course` — Get all courses
- `GET /api/course/:id` — Get course by ID

### Projects
- `POST /api/project/submit` — Learner submits project (file upload to Supabase)
- `GET /api/project/dashboard` — Instructor dashboard stats
- `GET /api/project/submissions` — Filtered submissions (course, status)
- `GET /api/project/:courseId` — Instructor fetches submissions by course
- `POST /api/project/evaluate` — Instructor evaluates submission
- `GET /api/project/evaluation/:userId` — Learner views feedback