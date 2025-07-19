const env = require('./utils/env');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { seedDatabase } = require('./utils/seeder');
const { setupSupabaseBucket } = require('./utils/supabaseSetup');

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
    
    // Setup Supabase bucket if configuration is available
    if (env.SUPABASE_URL && env.SUPABASE_KEY) {
      await setupSupabaseBucket();
    } else {
      console.log('Supabase configuration not found, skipping bucket setup');
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
