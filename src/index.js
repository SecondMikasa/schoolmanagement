const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('../lib/generated/prisma');

dotenv.config()

// Import routes
const schoolRoutes = require('./routes/school');

// Initialize Express app
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from the public directory

// Routes
app.use('/api/schools', schoolRoutes);

// Redirect root to API documentation
app.get('/', (req, res) => {
  res.redirect('/index.html');
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running'
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to the database successfully');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    })
  }
  catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
  finally {
    await prisma.$disconnect();
  }
};

startServer()

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Database connection closed');
  process.exit(0);
});

module.exports = app
