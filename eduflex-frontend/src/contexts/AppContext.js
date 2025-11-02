// src/contexts/AppContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../config/api'; // Configured Axios instance
import { toast } from 'react-toastify';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};

export const AppProvider = ({ children }) => {
  // --- Authentication State ---
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [authLoading, setAuthLoading] = useState(true);

  // --- Data placeholders for future use ---
  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [myAssignments, setMyAssignments] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [dataLoading, setDataLoading] = useState({
    courses: false,
    assignments: false,
    users: false,
  });

  // --- LOGIN FUNCTION ---
  const loginUser = async (email, password) => {
    setAuthLoading(true);
    try {
      // ✅ Backend expects email and password
      const { data } = await api.post('/auth/login', { email, password });

      if (data.token && data.user) {
        // Store in localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));

        // Update React state
        setToken(data.token);
        setUser(data.user);

        toast.success(`Welcome back, ${data.user.name || 'User'}!`);
        return data.user;
      } else {
        throw new Error("Login response missing token or user data.");
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Invalid email or password.');
      return null;
    } finally {
      setAuthLoading(false);
    }
  };

  // --- LOGOUT FUNCTION ---
  const logoutUser = useCallback(() => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      setUser(null);
      setToken(null);

      // Clear all cached data
      setAllCourses([]);
      setMyCourses([]);
      setMyAssignments([]);
      setAllUsers([]);

      toast.info('You have been logged out.');
    }
  }, []);

  // --- INITIAL TOKEN VALIDATION ---
  useEffect(() => {
    const initializeUser = async () => {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('currentUser');

      if (storedToken) {
        setToken(storedToken);

        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            localStorage.removeItem('currentUser');
          }
        }

        // ✅ Verify token with /auth/me
        try {
          const { data } = await api.get('/auth/me');
          setUser(data);
          localStorage.setItem('currentUser', JSON.stringify(data));
        } catch (err) {
          console.warn('Token invalid or expired, clearing session...');
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
          setUser(null);
          setToken(null);
        }
      }

      setAuthLoading(false);
    };

    initializeUser();
  }, []);

// --- Placeholder API Methods (Future Use) ---
const fetchAllCourses = useCallback(async () => {
  try {
    const { data } = await api.get('/courses');
    return data;
  } catch (err) {
    console.error("Error fetching all courses:", err);
    toast.error("Could not load courses.");
    return [];
  }
}, []);

// --- Student-related ---
const fetchMyStudentCourses = useCallback(async () => [], []);
const fetchMyGrades = useCallback(async () => [], []);
const fetchProfessorAssignments = useCallback(async () => [], []);
const createAssignment = async () => { throw new Error("Not implemented"); };
const submitAssignment = async () => { throw new Error("Not implemented"); };
const gradeSubmission = async () => { throw new Error("Not implemented"); };
const fetchAllUsersAdmin = useCallback(async () => [], []);
const createUser = async () => { throw new Error("Not implemented"); };
const updateUserProfile = async () => { throw new Error("Not implemented"); };


// ✅ Create a new course (for professor or admin)
const createCourse = async (courseData) => {
  try {
    // FIX: professors route
    const { data } = await api.post('/professors/courses', courseData);
    toast.success('Course created successfully!');
    return data;
  } catch (err) {
    console.error("Error creating course:", err.response?.data || err);
    toast.error("Could not create course.");
    throw err;
  }
};

// ✅ Professor Functions

// Fetch all courses created by the logged-in professor
const getMyProfessorCourses = useCallback(async () => {
  try {
    // FIX: changed POST → GET and removed courseData
    const { data } = await api.get('/professors/courses');
    return data;
  } catch (err) {
    console.error("Error fetching professor courses:", err.response?.data || err);
    toast.error("Could not load courses.");
    return [];
  }
}, []);

// Fetch single course by ID
const getProfessorCourseById = useCallback(async (courseId) => {
  try {
    const { data } = await api.get(`/courses/${courseId}`);
    return data;
  } catch (err) {
    console.error("Error fetching course:", err);
    toast.error("Could not load course details.");
    return null;
  }
}, []);

// Add study material to course
const addMaterialToCourse = async (courseId, materialData) => {
  try {
    const { data } = await api.post(`/courses/${courseId}/materials`, materialData);
    return data;
  } catch (err) {
    console.error("Error adding material:", err);
    toast.error("Failed to add material.");
  }
};

// Fetch assignments for a specific course
const getAssignmentsForCourse = useCallback(async (courseId) => {
  try {
    const { data } = await api.get(`/assignments/course/${courseId}`);
    return data;
  } catch (err) {
    console.error("Error fetching assignments:", err);
    toast.error("Could not load assignments.");
    return [];
  }
}, []);

// Add assignment to course
const addAssignmentToCourse = async (courseId, assignmentData) => {
  try {
    const { data } = await api.post(`/assignments/${courseId}`, assignmentData);
    return data;
  } catch (err) {
    console.error("Error adding assignment:", err);
    toast.error("Failed to add assignment.");
  }
};

// Add quiz to course
const addQuizToCourse = async (courseId, quizData) => {
  try {
    const { data } = await api.post(`/courses/${courseId}/quizzes`, quizData);
    return data;
  } catch (err) {
    console.error("Error adding quiz:", err);
    toast.error("Failed to add quiz.");
  }
};


// ✅ Enroll a student in a course
const enrollInCourse = async (courseId) => {
  try {
    const { data } = await api.post(`/courses/${courseId}/enroll`);
    toast.success("Enrolled successfully!");
    return data;
  } catch (err) {
    console.error("Error enrolling in course:", err);
    toast.error("Could not enroll in course.");
  }
};


// ✅ Update an existing course
const updateCourse = async (courseId, updateData) => {
  try {
    const { data } = await api.put(`/courses/${courseId}`, updateData);
    toast.success("Course updated successfully!");
    return data;
  } catch (err) {
    console.error("Error updating course:", err);
    toast.error("Could not update course.");
  }
};


// ✅ Delete a course
const deleteCourse = async (courseId) => {
  try {
    await api.delete(`/courses/${courseId}`);
    toast.info("Course deleted successfully!");
  } catch (err) {
    console.error("Error deleting course:", err);
    toast.error("Could not delete course.");
  }
};

// ✅ Context Value
const value = {
  // Auth
  user,
  token,
  authLoading,
  dataLoading,
  loginUser,
  logoutUser,

  // Shared data
  allCourses,
  myCourses,
  myAssignments,
  allUsers,

  // Student / General
  fetchAllCourses,
  fetchMyStudentCourses,
  fetchMyGrades,
  enrollInCourse,

  // Professor
  getMyProfessorCourses,
  getProfessorCourseById,
  addMaterialToCourse,
  getAssignmentsForCourse,
  addAssignmentToCourse,
  addQuizToCourse,

  // Admin / Management
  createCourse,
  updateCourse,
  deleteCourse,
  createAssignment,
  submitAssignment,
  gradeSubmission,
  fetchAllUsersAdmin,
  createUser,
  updateUserProfile,

  // ✅ Compatibility aliases (for older components)
  fetchMyProfessorCourses: getMyProfessorCourses,
  getAllUsers: fetchAllUsersAdmin,
};

// ✅ RETURN PROVIDER
return (
  <AppContext.Provider value={value}>
    {authLoading ? (
      <div className="flex justify-center items-center h-screen">
        Initializing session...
      </div>
    ) : (
      children
    )}
  </AppContext.Provider>
);
};