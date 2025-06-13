import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  // Initial data
  const [courseTypes, setCourseTypes] = useState([
    { id: 1, name: 'Individual' },
    { id: 2, name: 'Group' },
    { id: 3, name: 'Special' }
  ]);

  const [courses, setCourses] = useState([
    { id: 1, name: 'Hindi' },
    { id: 2, name: 'English' },
    { id: 3, name: 'Urdu' },
    { id: 4, name: 'Mathematics' },
    { id: 5, name: 'Science' }
  ]);

  const [courseOfferings, setCourseOfferings] = useState([
    { id: 1, courseId: 1, courseTypeId: 1 },
    { id: 2, courseId: 2, courseTypeId: 2 },
    { id: 3, courseId: 3, courseTypeId: 1 }
  ]);

  const [studentRegistrations, setStudentRegistrations] = useState([]);

  // Course Types CRUD
  const addCourseType = (name) => {
    const newId = Math.max(...courseTypes.map(ct => ct.id), 0) + 1;
    const newCourseType = { id: newId, name };
    setCourseTypes([...courseTypes, newCourseType]);
    return newCourseType;
  };

  const updateCourseType = (id, name) => {
    setCourseTypes(courseTypes.map(ct => 
      ct.id === id ? { ...ct, name } : ct
    ));
  };

  const deleteCourseType = (id) => {
    // Check if course type is used in course offerings
    const isUsed = courseOfferings.some(co => co.courseTypeId === id);
    if (isUsed) {
      throw new Error('Cannot delete course type that is being used in course offerings');
    }
    setCourseTypes(courseTypes.filter(ct => ct.id !== id));
  };

  // Courses CRUD
  const addCourse = (name) => {
    const newId = Math.max(...courses.map(c => c.id), 0) + 1;
    const newCourse = { id: newId, name };
    setCourses([...courses, newCourse]);
    return newCourse;
  };

  const updateCourse = (id, name) => {
    setCourses(courses.map(c => 
      c.id === id ? { ...c, name } : c
    ));
  };

  const deleteCourse = (id) => {
    // Check if course is used in course offerings
    const isUsed = courseOfferings.some(co => co.courseId === id);
    if (isUsed) {
      throw new Error('Cannot delete course that is being used in course offerings');
    }
    setCourses(courses.filter(c => c.id !== id));
  };

  // Course Offerings CRUD
  const addCourseOffering = (courseId, courseTypeId) => {
    // Check if combination already exists
    const exists = courseOfferings.some(co => 
      co.courseId === courseId && co.courseTypeId === courseTypeId
    );
    if (exists) {
      throw new Error('This course offering already exists');
    }
    
    const newId = Math.max(...courseOfferings.map(co => co.id), 0) + 1;
    const newOffering = { id: newId, courseId, courseTypeId };
    setCourseOfferings([...courseOfferings, newOffering]);
    return newOffering;
  };

  const updateCourseOffering = (id, courseId, courseTypeId) => {
    // Check if new combination already exists (excluding current record)
    const exists = courseOfferings.some(co => 
      co.id !== id && co.courseId === courseId && co.courseTypeId === courseTypeId
    );
    if (exists) {
      throw new Error('This course offering already exists');
    }
    
    setCourseOfferings(courseOfferings.map(co => 
      co.id === id ? { ...co, courseId, courseTypeId } : co
    ));
  };

  const deleteCourseOffering = (id) => {
    setCourseOfferings(courseOfferings.filter(co => co.id !== id));
  };

  // Student Registrations CRUD
  const registerStudent = (studentName, offeringId) => {
    if (!studentName.trim()) throw new Error('Student name is required');
    if (!offeringId) throw new Error('Course offering is required');
    // Prevent duplicate registration
    const exists = studentRegistrations.some(r => r.studentName.toLowerCase() === studentName.trim().toLowerCase() && r.offeringId === offeringId);
    if (exists) throw new Error('Student already registered for this offering');
    const newId = Math.max(0, ...studentRegistrations.map(r => r.id)) + 1;
    const newReg = { id: newId, studentName: studentName.trim(), offeringId };
    setStudentRegistrations([...studentRegistrations, newReg]);
    return newReg;
  };

  const getRegistrationsForOffering = (offeringId) => studentRegistrations.filter(r => r.offeringId === offeringId);

  const deleteRegistration = (id) => setStudentRegistrations(studentRegistrations.filter(r => r.id !== id));

  // Helper functions
  const getCourseById = (id) => courses.find(c => c.id === id);
  const getCourseTypeById = (id) => courseTypes.find(ct => ct.id === id);

  const value = {
    courseTypes,
    courses,
    courseOfferings,
    addCourseType,
    updateCourseType,
    deleteCourseType,
    addCourse,
    updateCourse,
    deleteCourse,
    addCourseOffering,
    updateCourseOffering,
    deleteCourseOffering,
    getCourseById,
    getCourseTypeById,
    studentRegistrations,
    registerStudent,
    getRegistrationsForOffering,
    deleteRegistration
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};