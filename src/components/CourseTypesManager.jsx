import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Modal from './Modal';
import ConfirmDialog from './ConfirmDialog';

const CourseTypesManager = () => {
  const { courseTypes, addCourseType, updateCourseType, deleteCourseType } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourseTypes = courseTypes.filter(ct =>
    ct.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Course type name is required');
      return;
    }

    if (name.trim().length < 2) {
      setError('Course type name must be at least 2 characters long');
      return;
    }

    // Check for duplicates
    const exists = courseTypes.some(ct => 
      ct.name.toLowerCase() === name.trim().toLowerCase() && 
      ct.id !== editingItem?.id
    );
    
    if (exists) {
      setError('A course type with this name already exists');
      return;
    }

    try {
      if (editingItem) {
        updateCourseType(editingItem.id, name.trim());
      } else {
        addCourseType(name.trim());
      }
      handleCloseModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (courseType) => {
    setEditingItem(courseType);
    setName(courseType.name);
    setIsModalOpen(true);
  };

  const handleDelete = (courseType) => {
    setConfirmDelete(courseType);
  };

  const confirmDeleteAction = () => {
    try {
      deleteCourseType(confirmDelete.id);
      setConfirmDelete(null);
    } catch (err) {
      setError(err.message);
      setConfirmDelete(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setName('');
    setError('');
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setName('');
    setError('');
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Course Types Management</h2>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={handleAddNew}
        >
          + Add Course Type
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search course types..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && !isModalOpen && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourseTypes.map(courseType => (
          <div key={courseType.id} className="bg-white rounded-lg shadow p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">{courseType.name}</h3>
              <div className="flex gap-2">
                <button 
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  onClick={() => handleEdit(courseType)}
                >
                  Edit
                </button>
                <button 
                  className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors"
                  onClick={() => handleDelete(courseType)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourseTypes.length === 0 && searchTerm && (
        <div className="text-center text-gray-500 py-4">
          No course types found for "{searchTerm}"
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? 'Edit Course Type' : 'Add New Course Type'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Course Type Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter course type name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              {editingItem ? 'Update' : 'Add'} Course Type
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={confirmDeleteAction}
        title="Delete Course Type"
        message={`Are you sure you want to delete "${confirmDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default CourseTypesManager;