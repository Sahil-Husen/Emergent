import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { BookOpen, Users, GraduationCap, ClipboardList, DollarSign, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export const Landing = () => {
  const features = [
    { icon: ClipboardList, title: 'Admission Management', desc: 'Streamlined application process' },
    { icon: BookOpen, title: 'Course Registration', desc: 'Easy enrollment system' },
    { icon: Users, title: 'Attendance Tracking', desc: 'Real-time monitoring' },
    { icon: GraduationCap, title: 'Exam & Results', desc: 'Automated grading' },
    { icon: DollarSign, title: 'Fee Management', desc: 'Secure payments' },
    { icon: Home, title: 'Hostel Allocation', desc: 'Digital room assignment' }
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <BookOpen className="w-20 h-20 text-emerald-900" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight mb-6" data-testid="hero-title">
              AMU Student Life-Cycle
              <br />
              <span className="text-emerald-900">Management System</span>
            </h1>
            <p className="text-lg sm:text-xl text-stone-600 max-w-3xl mx-auto mb-8">
              Comprehensive platform managing the complete student journey from admission to alumni tracking
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/login" data-testid="login-link">
                <Button size="lg" className="bg-emerald-900 hover:bg-emerald-800 text-white px-8 py-6 text-lg rounded-full hover-lift transition-smooth">
                  Login
                </Button>
              </Link>
              <Link to="/admission" data-testid="apply-admission-link">
                <Button size="lg" variant="outline" className="border-2 border-emerald-900 text-emerald-900 hover:bg-emerald-50 px-8 py-6 text-lg rounded-full hover-lift transition-smooth">
                  Apply for Admission
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-4">Complete Student Management</h2>
          <p className="text-lg text-stone-600">All-in-one platform for seamless academic administration</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 bg-white border border-stone-200 rounded-2xl hover:shadow-lg hover-lift transition-smooth"
              data-testid={`feature-card-${idx}`}
            >
              <feature.icon className="w-12 h-12 text-emerald-900 mb-4" />
              <h3 className="text-xl font-semibold text-stone-900 mb-2">{feature.title}</h3>
              <p className="text-stone-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-emerald-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-stone-100">© 2026 Aligarh Muslim University. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};