import React, { useState } from 'react';
import { DataProvider } from './contexts/DataContext';
import Dashboard from './components/Dashboard';
import CourseTypesManager from './components/CourseTypesManager';
import CoursesManager from './components/CoursesManager';
import CourseOfferingsManager from './components/CourseOfferingsManager';
import StudentRegistrationsManager from './components/StudentRegistrationsManager';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'course-types', label: 'Course Types', icon: '📋' },
    { id: 'courses', label: 'Courses', icon: '📚' },
    { id: 'course-offerings', label: 'Course Offerings', icon: '🎯' },
    { id: 'student-registrations', label: 'Student Registrations', icon: '📝' }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'course-types':
        return <CourseTypesManager />;
      case 'courses':
        return <CoursesManager />;
      case 'course-offerings':
        return <CourseOfferingsManager />;
      case 'student-registrations':
        return <StudentRegistrationsManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <DataProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">🎓 Student Registration System</h1>
            <p className="mt-1 text-sm text-gray-500">Comprehensive course management platform</p>
          </div>
        </header>

        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2 py-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`flex items-center px-5 py-2 text-base font-semibold rounded-lg transition-colors duration-200 focus:outline-none
                    ${activeTab === tab.id 
                      ? 'bg-blue-600 text-white border-2 border-blue-700 shadow focus:ring-2 focus:ring-blue-300'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-2 focus:ring-blue-200'
                    }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="mr-2 text-xl">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderActiveComponent()}
          </div>
        </main>

        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-sm text-gray-500">
              &copy; 2025 Student Registration System. Built with React.
            </p>
          </div>
        </footer>
      </div>
    </DataProvider>
  );
}

export default App;