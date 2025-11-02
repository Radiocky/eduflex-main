// routes/professorRoutes.js
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware.js');
const professorController = require('../controllers/professorController.js');

// ✅ Secure all professor routes
router.use(authenticate);
router.use(authorize('professor'));

// ✅ Courses
router.get('/courses', professorController.getMyCoursesHandler);
router.get('/courses/:id', professorController.getCourseByIdHandler);
router.post('/courses', professorController.createCourseHandler);

// ✅ Assignments
router.get('/assignments', professorController.getMyAssignmentsHandler);
router.post('/assignments', professorController.createAssignmentHandler);
router.patch('/assignments/:id/grade', professorController.gradeSubmissionHandler);

// ✅ Students under a course
router.get('/courses/:id/students', professorController.getStudentsInCourseHandler);

module.exports = router;
