import React from 'react';
import { useData } from '../contexts/DataContext';

const Dashboard = () => {
  const { courseTypes, courses, courseOfferings, getCourseById, getCourseTypeById } = useData();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Student Registration System Dashboard</h2>
        <p className="mt-2 text-gray-600">Manage your courses, course types, and course offerings efficiently</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-blue-600">{courseTypes.length}</div>
          <div className="text-lg font-semibold text-gray-900 mt-2">Course Types</div>
          <div className="text-sm text-gray-500">Available course formats</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-blue-600">{courses.length}</div>
          <div className="text-lg font-semibold text-gray-900 mt-2">Courses</div>
          <div className="text-sm text-gray-500">Total courses available</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-blue-600">{courseOfferings.length}</div>
          <div className="text-lg font-semibold text-gray-900 mt-2">Course Offerings</div>
          <div className="text-sm text-gray-500">Active course combinations</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Course Types</h3>
          <div className="space-y-2">
            {courseTypes.slice(0, 3).map(ct => (
              <div key={ct.id} className="p-2 bg-gray-50 rounded">
                <span className="text-gray-700">{ct.name}</span>
              </div>
            ))}
            {courseTypes.length === 0 && (
              <div className="text-gray-500 italic">No course types created yet</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Courses</h3>
          <div className="space-y-2">
            {courses.slice(0, 3).map(course => (
              <div key={course.id} className="p-2 bg-gray-50 rounded">
                <span className="text-gray-700">{course.name}</span>
              </div>
            ))}
            {courses.length === 0 && (
              <div className="text-gray-500 italic">No courses created yet</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Course Offerings</h3>
          <div className="space-y-2">
            {courseOfferings.slice(0, 3).map(offering => {
              const course = getCourseById(offering.courseId);
              const courseType = getCourseTypeById(offering.courseTypeId);
              return (
                <div key={offering.id} className="p-2 bg-gray-50 rounded">
                  <span className="text-gray-700">
                    {courseType?.name} - {course?.name}
                  </span>
                </div>
              );
            })}
            {courseOfferings.length === 0 && (
              <div className="text-gray-500 italic">No course offerings created yet</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900">📚 Course Types</h4>
            <p className="mt-2 text-gray-600">Manage Individual, Group, and Special course formats</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900">📖 Courses</h4>
            <p className="mt-2 text-gray-600">Add and manage your course catalog</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900">🎯 Course Offerings</h4>
            <p className="mt-2 text-gray-600">Create course and type combinations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;