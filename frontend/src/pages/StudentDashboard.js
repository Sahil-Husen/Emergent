import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axios';
import { BookOpen, Calendar, DollarSign, Home, GraduationCap, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [fees, setFees] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [enrollRes, feeRes] = await Promise.all([
        axiosInstance.get('/enrollments'),
        axiosInstance.get('/fees')
      ]);
      setEnrollments(enrollRes.data);
      setFees(feeRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const pendingFees = fees.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0);

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
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight" data-testid="student-dashboard-title">Student Dashboard</h1>
          <p className="text-stone-600 mt-2">Welcome back, {user.profile?.name || 'Student'}</p>
          <p className="text-sm text-stone-500">Roll No: {user.profile?.rollNumber}</p>
        </div>

        {/* Tetris Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-6 mb-8">
          {/* Hero Card - Academic Overview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-1 md:col-span-8 lg:col-span-8 bg-gradient-to-br from-emerald-900 to-emerald-700 p-8 rounded-2xl text-white"
            data-testid="academic-overview-card"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-emerald-100 text-sm uppercase tracking-wider mb-2">Academic Overview</p>
                <h2 className="text-3xl font-bold">{user.profile?.program}</h2>
                <p className="text-emerald-100 mt-1">{user.profile?.department} Department</p>
              </div>
              <GraduationCap className="w-16 h-16 text-emerald-100" />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <p className="text-emerald-100 text-sm">Semester</p>
                <p className="text-2xl font-bold">{user.profile?.semester || 1}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <p className="text-emerald-100 text-sm">Courses</p>
                <p className="text-2xl font-bold">{enrollments.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <p className="text-emerald-100 text-sm">Attendance</p>
                <p className="text-2xl font-bold">--</p>
              </div>
            </div>
          </motion.div>

          {/* Square Card - Fees */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-1 md:col-span-4 lg:col-span-4 bg-white p-6 rounded-2xl border border-stone-200"
            data-testid="fees-card"
          >
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-rose-700" />
              <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs rounded-full font-medium">
                {fees.filter(f => f.status === 'pending').length} Pending
              </span>
            </div>
            <p className="text-sm text-stone-600 mb-2">Total Pending Fees</p>
            <p className="text-3xl font-bold text-stone-900">₹{pendingFees.toLocaleString()}</p>
            <button className="mt-4 w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-medium transition-smooth" data-testid="pay-fees-button">
              Pay Now
            </button>
          </motion.div>
        </div>

        {/* Second Row - Courses and Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-6">
          {/* Enrolled Courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-1 md:col-span-8 lg:col-span-7 bg-white p-6 rounded-2xl border border-stone-200"
            data-testid="enrolled-courses-card"
          >
            <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Enrolled Courses
            </h2>
            <div className="space-y-3">
              {enrollments.length === 0 ? (
                <p className="text-stone-500 text-center py-8">No courses enrolled yet</p>
              ) : (
                enrollments.slice(0, 4).map((enrollment, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-stone-50 rounded-lg hover:shadow-md hover-lift transition-smooth" data-testid={`course-item-${idx}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-emerald-900" />
                      </div>
                      <div>
                        <p className="font-medium text-stone-900">{enrollment.courseId?.courseName}</p>
                        <p className="text-sm text-stone-600">{enrollment.courseId?.courseCode}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                      {enrollment.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-1 md:col-span-8 lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200"
            data-testid="quick-actions-card"
          >
            <h2 className="text-xl font-bold text-stone-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-smooth text-left" data-testid="view-attendance-button">
                <Calendar className="w-6 h-6 text-emerald-900 mb-2" />
                <p className="text-sm font-medium text-stone-900">Attendance</p>
              </button>
              <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-smooth text-left" data-testid="view-results-button">
                <TrendingUp className="w-6 h-6 text-blue-700 mb-2" />
                <p className="text-sm font-medium text-stone-900">Results</p>
              </button>
              <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-smooth text-left" data-testid="exam-schedule-button">
                <Clock className="w-6 h-6 text-purple-700 mb-2" />
                <p className="text-sm font-medium text-stone-900">Exams</p>
              </button>
              <button className="p-4 bg-rose-50 hover:bg-rose-100 rounded-xl transition-smooth text-left" data-testid="hostel-info-button">
                <Home className="w-6 h-6 text-rose-700 mb-2" />
                <p className="text-sm font-medium text-stone-900">Hostel</p>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};