// services/courseService.js
const Course = require('../models/Course');

// Get all courses
const getAllCourses = async () => {
  return await Course.find({});
};

// Get a single course by ID
const getCourseById = async (id) => {
  return await Course.findById(id);
};

// Create a new course
const createCourse = async (data) => {
  const course = new Course(data);
  return await course.save();
};

// Update a course
const updateCourse = async (id, data) => {
  return await Course.findByIdAndUpdate(id, data, { new: true });
};

// Delete a course
const deleteCourse = async (id) => {
  return await Course.findByIdAndDelete(id);
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
