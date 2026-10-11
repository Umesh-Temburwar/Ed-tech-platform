import React, { createContext, useContext, useState, useEffect } from 'react';
import { sanitizeArray } from '../utils/arrayUtils';

// Course data structure
const CourseContext = createContext();

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load courses from localStorage on mount
  useEffect(() => {
    const loadCourses = () => {
      try {
        const storedCourses = localStorage.getItem('courses');
        if (storedCourses) {
          const parsedCourses = JSON.parse(storedCourses);
          // Validate course data structure
          const validCourses = parsedCourses.filter(course => 
            course.id && 
            course.title && 
            course.description && 
            course.createdAt
          );
          setCourses(validCourses);
        }
      } catch (error) {
        setError('Failed to load courses');
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Save courses to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('courses', JSON.stringify(courses));
      } catch (error) {
        setError('Failed to save courses');
      }
    }
  }, [courses, isLoading]);

  // Add a new course
  const addCourse = (courseData) => {
    // Validate required fields
    if (!courseData.title || !courseData.description) {
      throw new Error('Title and description are required');
    }

    const newCourse = {
      id: Date.now().toString(), // Simple unique ID
      title: courseData.title,
      description: courseData.description,
      videoType: courseData.videoType || 'youtube',
      youtubeUrl: courseData.youtubeUrl || '',
      videoFile: courseData.videoFile?.name || null,
      thumbnail: courseData.thumbnail || null,
      thumbnailFile: courseData.thumbnailFile?.name || null,
      useDefaultThumbnail: courseData.useDefaultThumbnail || false,
      tags: sanitizeArray(courseData.tags),
      requirements: sanitizeArray(courseData.requirements),
      benefits: sanitizeArray(courseData.benefits),
      learning_outcomes: sanitizeArray(courseData.learning_outcomes),
      skills: sanitizeArray(courseData.skills),
      curriculum: sanitizeArray(courseData.curriculum),
      prerequisites: sanitizeArray(courseData.prerequisites),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'published' // Can be 'draft', 'published', 'archived'
    };

    // Update state - this will trigger the useEffect to save to localStorage
    setCourses(prevCourses => {
      const updatedCourses = [...prevCourses, newCourse];
      return updatedCourses;
    });
    
    // Clear any previous errors
    setError(null);
    
    return newCourse;
  };

  // Update an existing course
  const updateCourse = (courseId, updates) => {
    setCourses(prevCourses => 
      prevCourses.map(course => 
        course.id === courseId 
          ? { ...course, ...updates, updatedAt: new Date().toISOString() }
          : course
      )
    );
  };

  // Delete a course
  const deleteCourse = (courseId) => {
    setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
  };

  // Get course by ID
  const getCourseById = (courseId) => {
    return courses.find(course => course.id === courseId);
  };

  // Get courses by status
  const getCoursesByStatus = (status) => {
    return courses.filter(course => course.status === status);
  };

  // Clear all courses (for testing/reset)
  const clearAllCourses = () => {
    setCourses([]);
    localStorage.removeItem('courses');
  };

  // Export courses data (for backup)
  const exportCourses = () => {
    const dataStr = JSON.stringify(courses, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `courses_backup_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Import courses data
  const importCourses = (coursesData) => {
    try {
      const parsedCourses = JSON.parse(coursesData);
      const validCourses = parsedCourses.filter(course => 
        course.id && 
        course.title && 
        course.description
      );
      setCourses(validCourses);
      setError(null);
      return true;
    } catch (error) {
      setError('Failed to import courses');
      return false;
    }
  };

  const value = {
    courses,
    isLoading,
    error,
    addCourse,
    updateCourse,
    deleteCourse,
    getCourseById,
    getCoursesByStatus,
    clearAllCourses,
    exportCourses,
    importCourses,
    // Statistics
    totalCourses: courses.length,
    publishedCourses: courses.filter(c => c.status === 'published').length,
    draftCourses: courses.filter(c => c.status === 'draft').length,
    // Refresh data
    refresh: () => {
      setIsLoading(true);
      const storedCourses = localStorage.getItem('courses');
      if (storedCourses) {
        const parsedCourses = JSON.parse(storedCourses);
        setCourses(parsedCourses);
      }
      setIsLoading(false);
    }
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};
