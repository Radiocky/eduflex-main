// controllers/professorController.js
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');

// Get courses created by the logged-in professor
const getMyCoursesHandler = async (req, res) => {
  try {
    const professorId = req.user.email || req.user.username || req.user._id;
    const courses = await Course.find({ professorId: professorId });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching professor courses:', error);
    res.status(500).json({ message: 'Server error fetching courses' });
  }
};

// Get single course by ID
const getCourseByIdHandler = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server error fetching course' });
  }
};

// Create a new course
const createCourseHandler = async (req, res) => {
  try {
    const { courseCode, courseName, description } = req.body;
    if (!courseName) return res.status(400).json({ message: 'Course name is required' });

    const professorId = req.user.email || req.user.username || req.user._id;
    const newCourse = await Course.create({
      courseCode,
      courseName,
      description,
      professorId
    });

    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Server error creating course' });
  }
};

// Get assignments created by professor
const getMyAssignmentsHandler = async (req, res) => {
  try {
    const createdBy = req.user.email || req.user.username || req.user._id;
    const assignments = await Assignment.find({ createdBy });
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ message: 'Server error fetching assignments' });
  }
};

// Create new assignment
const createAssignmentHandler = async (req, res) => {
  try {
    const { assignmentTitle, courseCode, description, dueDate } = req.body;
    if (!assignmentTitle || !courseCode)
      return res.status(400).json({ message: 'Title and course code required' });

    const createdBy = req.user.email || req.user.username || req.user._id;

    const newAssignment = await Assignment.create({
      assignmentTitle,
      courseCode,
      description,
      dueDate,
      createdBy
    });

    res.status(201).json(newAssignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ message: 'Server error creating assignment' });
  }
};

// Get students enrolled in a specific course
const getStudentsInCourseHandler = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('students');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course.students || []);
  } catch (error) {
    console.error('Error fetching course students:', error);
    res.status(500).json({ message: 'Server error fetching students' });
  }
};

// Grade assignment submissions
const gradeSubmissionHandler = async (req, res) => {
  try {
    const { grade, studentUsername } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    assignment.grade = grade;
    assignment.studentUsername = studentUsername;

    await assignment.save();
    res.json({ message: 'Grade updated', assignment });
  } catch (error) {
    console.error('Error grading submission:', error);
    res.status(500).json({ message: 'Server error grading submission' });
  }
};

module.exports = {
  getMyCoursesHandler,
  getCourseByIdHandler,
  createCourseHandler,
  getMyAssignmentsHandler,
  createAssignmentHandler,
  getStudentsInCourseHandler,
  gradeSubmissionHandler
};
