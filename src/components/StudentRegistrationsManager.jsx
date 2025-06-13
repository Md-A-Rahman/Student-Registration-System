import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';

const StudentRegistrationsManager = () => {
  const {
    courseOfferings,
    courses,
    courseTypes,
    registerStudent,
    getRegistrationsForOffering,
    deleteRegistration,
    getCourseById,
    getCourseTypeById
  } = useData();

  const [selectedCourseType, setSelectedCourseType] = useState('');
  const [selectedOffering, setSelectedOffering] = useState('');
  const [studentName, setStudentName] = useState('');
  const [error, setError] = useState('');

  // Filter offerings by selected course type
  const filteredOfferings = selectedCourseType
    ? courseOfferings.filter(o => o.courseTypeId === parseInt(selectedCourseType))
    : courseOfferings;

  // List of students for the selected offering
  const registrations = selectedOffering
    ? getRegistrationsForOffering(parseInt(selectedOffering))
    : [];

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    try {
      registerStudent(studentName, parseInt(selectedOffering));
      setStudentName('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Student Registrations</h2>
        <p className="mt-2 text-gray-600">Register students for available course offerings and view registrations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Course Type</label>
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCourseType}
            onChange={e => {
              setSelectedCourseType(e.target.value);
              setSelectedOffering('');
            }}
          >
            <option value="">All Types</option>
            {courseTypes.map(ct => (
              <option key={ct.id} value={ct.id}>{ct.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Course Offering</label>
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[220px]"
            value={selectedOffering}
            onChange={e => setSelectedOffering(e.target.value)}
          >
            <option value="">Select Offering</option>
            {filteredOfferings.map(o => {
              const course = getCourseById(o.courseId);
              const courseType = getCourseTypeById(o.courseTypeId);
              return (
                <option key={o.id} value={o.id}>
                  {courseType?.name} - {course?.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {selectedOffering && (
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Register a Student</h3>
          <form onSubmit={handleRegister} className="flex flex-col md:flex-row gap-2 items-center">
            <input
              type="text"
              placeholder="Student Name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={studentName}
              onChange={e => setStudentName(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Register
            </button>
          </form>
          {error && <div className="mt-2 p-2 bg-red-50 text-red-700 rounded-md">{error}</div>}
        </div>
      )}

      {selectedOffering && (
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Registered Students</h3>
          {registrations.length === 0 ? (
            <div className="text-gray-500 italic">No students registered for this offering yet.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {registrations.map(r => (
                <li key={r.id} className="flex justify-between items-center py-2">
                  <span className="text-gray-800">{r.studentName}</span>
                  <button
                    className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors"
                    onClick={() => deleteRegistration(r.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentRegistrationsManager; 