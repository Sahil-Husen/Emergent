import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axios';
import { BookOpen, Users, GraduationCap, ClipboardCheck, DollarSign, Home as HomeIcon, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axiosInstance.get('/analytics/dashboard');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = analytics ? [
    { icon: Users, label: 'Total Students', value: analytics.overview.totalStudents, color: 'text-emerald-900', bg: 'bg-emerald-50' },
    { icon: BookOpen, label: 'Total Faculty', value: analytics.overview.totalFaculty, color: 'text-blue-700', bg: 'bg-blue-50' },
    { icon: GraduationCap, label: 'Active Courses', value: analytics.overview.totalCourses, color: 'text-purple-700', bg: 'bg-purple-50' },
    { icon: ClipboardCheck, label: 'Pending Admissions', value: analytics.overview.pendingAdmissions, color: 'text-rose-700', bg: 'bg-rose-50' },
  ] : [];

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
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight" data-testid="admin-dashboard-title">Admin Dashboard</h1>
          <p className="text-stone-600 mt-2">Welcome back, Administrator</p>
        </div>

        {/* Stats Grid - High Density */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`${stat.bg} p-6 rounded-xl border border-stone-200`}
              data-testid={`stat-card-${idx}`}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
              </div>
              <p className="text-sm font-medium text-stone-700">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Admissions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-stone-200">
            <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5" />
              Recent Admissions
            </h2>
            <div className="space-y-3">
              {analytics?.recentAdmissions.map((admission, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-stone-50 rounded-lg" data-testid={`admission-item-${idx}`}>
                  <div>
                    <p className="font-medium text-stone-900">{admission.applicantName}</p>
                    <p className="text-sm text-stone-600">{admission.program}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    admission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    admission.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {admission.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Department Distribution */}
          <div className="bg-white p-6 rounded-xl border border-stone-200">
            <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Department-wise Students
            </h2>
            <div className="space-y-3">
              {analytics?.departmentWiseStudents.map((dept, idx) => (
                <div key={idx} className="flex items-center justify-between" data-testid={`dept-item-${idx}`}>
                  <span className="text-stone-700">{dept._id}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-900"
                        style={{ width: `${(dept.count / analytics.overview.totalStudents) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-medium text-stone-900 w-12 text-right">{dept.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl border border-stone-200">
          <h2 className="text-xl font-bold text-stone-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-smooth text-left" data-testid="manage-admissions-button">
              <ClipboardCheck className="w-6 h-6 text-emerald-900 mb-2" />
              <p className="font-medium text-stone-900">Manage Admissions</p>
            </button>
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-smooth text-left" data-testid="manage-courses-button">
              <BookOpen className="w-6 h-6 text-blue-700 mb-2" />
              <p className="font-medium text-stone-900">Manage Courses</p>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-smooth text-left" data-testid="fee-management-button">
              <DollarSign className="w-6 h-6 text-purple-700 mb-2" />
              <p className="font-medium text-stone-900">Fee Management</p>
            </button>
            <button className="p-4 bg-rose-50 hover:bg-rose-100 rounded-lg transition-smooth text-left" data-testid="hostel-allocation-button">
              <HomeIcon className="w-6 h-6 text-rose-700 mb-2" />
              <p className="font-medium text-stone-900">Hostel Allocation</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};