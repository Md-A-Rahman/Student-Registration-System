import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Modal from './Modal';
import ConfirmDialog from './ConfirmDialog';

const CourseOfferingsManager = () => {
  const { 
    courseOfferings, 
    courses, 
    courseTypes, 
    addCourseOffering, 
    updateCourseOffering, 
    deleteCourseOffering,
    getCourseById,
    getCourseTypeById
  } = useData();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [courseId, setCourseId] = useState('');
  const [courseTypeId, setCourseTypeId] = useState('');
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOfferings = courseOfferings.filter(offering => {
    const course = getCourseById(offering.courseId);
    const courseType = getCourseTypeById(offering.courseTypeId);
    const offeringName = `${courseType?.name} - ${course?.name}`.toLowerCase();
    return offeringName.includes(searchTerm.toLowerCase());
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!courseId) {
      setError('Please select a course');
      return;
    }

    if (!courseTypeId) {
      setError('Please select a course type');
      return;
    }

    try {
      if (editingItem) {
        updateCourseOffering(editingItem.id, parseInt(courseId), parseInt(courseTypeId));
      } else {
        addCourseOffering(parseInt(courseId), parseInt(courseTypeId));
      }
      handleCloseModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (offering) => {
    setEditingItem(offering);
    setCourseId(offering.courseId.toString());
    setCourseTypeId(offering.courseTypeId.toString());
    setIsModalOpen(true);
  };

  const handleDelete = (offering) => {
    setConfirmDelete(offering);
  };

  const confirmDeleteAction = () => {
    deleteCourseOffering(confirmDelete.id);
    setConfirmDelete(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setCourseId('');
    setCourseTypeId('');
    setError('');
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setCourseId('');
    setCourseTypeId('');
    setError('');
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Course Offerings Management</h2>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={handleAddNew}
        >
          + Add Course Offering
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search course offerings..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && !isModalOpen && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOfferings.map(offering => {
          const course = getCourseById(offering.courseId);
          const courseType = getCourseTypeById(offering.courseTypeId);
          
          return (
            <div key={offering.id} className="bg-white rounded-lg shadow p-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">{courseType?.name} - {course?.name}</h3>
                <div className="flex gap-2">
                  <button 
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    onClick={() => handleEdit(offering)}
                  >
                    Edit
                  </button>
                  <button 
                    className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors"
                    onClick={() => handleDelete(offering)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOfferings.length === 0 && searchTerm && (
        <div className="text-center text-gray-500 py-4">
          No course offerings found for "{searchTerm}"
        </div>
      )}

      {courseOfferings.length === 0 && !searchTerm && (
        <div className="text-center text-gray-500 py-4">
          No course offerings created yet. Click "Add Course Offering" to get started.
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? 'Edit Course Offering' : 'Add New Course Offering'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="courseType" className="block text-sm font-medium text-gray-700 mb-1">
              Course Type
            </label>
            <select
              id="courseType"
              value={courseTypeId}
              onChange={(e) => setCourseTypeId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select course type</option>
              {courseTypes.map(ct => (
                <option key={ct.id} value={ct.id}>{ct.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <select
              id="course"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>
          {error && <div className="p-4 bg-red-50 text-red-700 rounded-md">{error}</div>}
          <div className="flex justify-end gap-2">
            <button 
              type="button" 
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {editingItem ? 'Update' : 'Add'} Course Offering
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={confirmDeleteAction}
        title="Delete Course Offering"
        message={`Are you sure you want to delete this course offering? This action cannot be undone.`}
      />
    </div>
  );
};

export default CourseOfferingsManager;