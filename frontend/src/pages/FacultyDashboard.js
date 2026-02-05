import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axios';
import { BookOpen, Users, ClipboardCheck, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export const FacultyDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get('/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-900 mx-auto"></div>
            <p className="mt-4 text-stone-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight" data-testid="faculty-dashboard-title">Faculty Dashboard</h1>
          <p className="text-stone-600 mt-2">Welcome back, {user.profile?.name || 'Faculty'}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-emerald-50 p-6 rounded-xl border border-stone-200">
            <BookOpen className="w-8 h-8 text-emerald-900 mb-4" />
            <p className="text-3xl font-bold text-emerald-900">{courses.length}</p>
            <p className="text-sm font-medium text-stone-700">Total Courses</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-xl border border-stone-200">
            <Users className="w-8 h-8 text-blue-700 mb-4" />
            <p className="text-3xl font-bold text-blue-700">--</p>
            <p className="text-sm font-medium text-stone-700">Total Students</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-xl border border-stone-200">
            <ClipboardCheck className="w-8 h-8 text-purple-700 mb-4" />
            <p className="text-3xl font-bold text-purple-700">--</p>
            <p className="text-sm font-medium text-stone-700">Pending Grades</p>
          </div>
        </div>

        {/* My Courses */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 mb-8">
          <h2 className="text-xl font-bold text-stone-900 mb-6">My Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.slice(0, 6).map((course, idx) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 bg-stone-50 rounded-xl hover:shadow-md hover-lift transition-smooth cursor-pointer"
                data-testid={`course-card-${idx}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <BookOpen className="w-5 h-5 text-emerald-900" />
                  <span className="px-2 py-1 bg-emerald-900 text-white text-xs rounded-full">{course.credits} Credits</span>
                </div>
                <h3 className="font-semibold text-stone-900 mb-1">{course.courseName}</h3>
                <p className="text-sm text-stone-600 mb-2">{course.courseCode}</p>
                <p className="text-xs text-stone-500">{course.department}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl border border-stone-200">
          <h2 className="text-xl font-bold text-stone-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-smooth text-left" data-testid="mark-attendance-button">
              <ClipboardCheck className="w-6 h-6 text-emerald-900 mb-2" />
              <p className="font-medium text-stone-900">Mark Attendance</p>
            </button>
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-smooth text-left" data-testid="enter-grades-button">
              <FileText className="w-6 h-6 text-blue-700 mb-2" />
              <p className="font-medium text-stone-900">Enter Grades</p>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-smooth text-left" data-testid="view-students-button">
              <Users className="w-6 h-6 text-purple-700 mb-2" />
              <p className="font-medium text-stone-900">View Students</p>
            </button>
            <button className="p-4 bg-rose-50 hover:bg-rose-100 rounded-lg transition-smooth text-left" data-testid="schedule-exam-button">
              <BookOpen className="w-6 h-6 text-rose-700 mb-2" />
              <p className="font-medium text-stone-900">Schedule Exam</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};