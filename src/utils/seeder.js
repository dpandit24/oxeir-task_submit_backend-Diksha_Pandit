const User = require('../models/User');
const Course = require('../models/Course');
const bcrypt = require('bcryptjs');

const courses = [
  { name: 'Introduction to JavaScript', description: 'Learn the basics of JavaScript programming' },
  { name: 'React Fundamentals', description: 'Build modern web applications with React' },
  { name: 'Node.js Backend Development', description: 'Create server-side applications with Node.js' },
  { name: 'MongoDB Database Design', description: 'Learn NoSQL database design and management' },
  { name: 'Express.js API Development', description: 'Build RESTful APIs with Express.js' },
  { name: 'Frontend Web Development', description: 'Master HTML, CSS, and JavaScript for web development' },
  { name: 'Full Stack Development', description: 'Complete web application development from frontend to backend' },
  { name: 'Data Structures and Algorithms', description: 'Learn fundamental computer science concepts' },
  { name: 'Python Programming', description: 'Introduction to Python programming language' },
  { name: 'Machine Learning Basics', description: 'Introduction to machine learning concepts and algorithms' },
  { name: 'DevOps Fundamentals', description: 'Learn CI/CD, Docker, and deployment strategies' },
  { name: 'Mobile App Development', description: 'Build mobile applications for iOS and Android' },
  { name: 'Cloud Computing with AWS', description: 'Deploy and manage applications on Amazon Web Services' },
  { name: 'Cybersecurity Essentials', description: 'Learn about web security and best practices' },
  { name: 'UI/UX Design Principles', description: 'Design user-friendly and beautiful interfaces' },
  { name: 'Agile Project Management', description: 'Learn agile methodologies for software development' },
  { name: 'Testing and Quality Assurance', description: 'Write tests and ensure code quality' },
  { name: 'GraphQL API Development', description: 'Build flexible APIs with GraphQL' },
  { name: 'Microservices Architecture', description: 'Design and implement microservices' },
  { name: 'Blockchain Development', description: 'Introduction to blockchain and smart contracts' }
];

const users = [
  { name: 'Learner One', email: 'learner1@gmail.com', password: '12345678', role: 'learner' },
  { name: 'Learner Two', email: 'learner2@gmail.com', password: '12345678', role: 'learner' },
  { name: 'Instructor One', email: 'instructor1@gmail.com', password: '12345678', role: 'instructor' },
  { name: 'Instructor Two', email: 'instructor2@gmail.com', password: '12345678', role: 'instructor' }
];

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Seed courses
    for (const courseData of courses) {
      const existingCourse = await Course.findOne({ name: courseData.name });
      if (!existingCourse) {
        const course = new Course(courseData);
        await course.save();
        console.log(`Created course: ${courseData.name}`);
      } else {
        console.log(`Course already exists: ${courseData.name}`);
      }
    }

    // Seed users
    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = new User({
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role
        });
        await user.save();
        console.log(`Created user: ${userData.email} (${userData.role})`);
      } else {
        console.log(`User already exists: ${userData.email}`);
      }
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

module.exports = { seedDatabase }; 