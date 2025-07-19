const env = require('./utils/env');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { seedDatabase } = require('./utils/seeder');

const projectRoutes = require('./routes/project');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/course');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(errorHandler);

// Routes
app.use('/api/project', projectRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/course', courseRoutes);

// MongoDB Connection
mongoose.connect(env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('MongoDB connected');
    await seedDatabase();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    console.log('Environment Variables:');
    console.log('MONGODB_URI:', env.MONGODB_URI);
    console.log('JWT_SECRET:', env.JWT_SECRET );
    console.log('UPLOAD_DIR:', env.UPLOAD_DIR);
    console.log('MAX_FILE_SIZE:', env.MAX_FILE_SIZE);
    console.log('PORT:', env.PORT);
  });

const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment Variables:');
  console.log('MONGODB_URI:', env.MONGODB_URI);
  console.log('JWT_SECRET:', env.JWT_SECRET );
  console.log('UPLOAD_DIR:', env.UPLOAD_DIR);
  console.log('MAX_FILE_SIZE:', env.MAX_FILE_SIZE);
  console.log('PORT:', env.PORT);
}); 
