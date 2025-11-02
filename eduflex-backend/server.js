const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

// ✅ Connect to Database BEFORE starting the server!
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Route imports
const authRoutes = require('./routes/authRouters');
const studentRoutes = require('./routes/studentRoutes');
const professorRoutes = require('./routes/professorRoutes');
const adminRoutes = require('./routes/admin');
const assignmentRoutes = require('./routes/assignments');
const courseRoutes = require('./routes/courses');

// ✅ Use routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/professors', professorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/courses', courseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ EduFlex backend running on port ${PORT}`));
