import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { BookOpen, LogOut, User } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'faculty') return '/faculty';
    return '/student';
  };

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50 backdrop-blur-xl backdrop-saturate-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to={getDashboardLink()} className="flex items-center gap-2 hover-lift transition-smooth" data-testid="logo-link">
            <BookOpen className="w-8 h-8 text-emerald-900" />
            <span className="text-xl font-bold tracking-tight text-stone-900">AMU Portal</span>
          </Link>

          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-stone-100 rounded-full" data-testid="user-info">
                <User className="w-4 h-4 text-stone-600" />
                <span className="text-sm font-medium text-stone-900">{user.profile?.name || user.email}</span>
                <span className="text-xs px-2 py-1 bg-emerald-900 text-white rounded-full">{user.role}</span>
              </div>
              <Button 
                onClick={handleLogout} 
                variant="ghost" 
                size="sm"
                className="hover:bg-stone-100"
                data-testid="logout-button"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};