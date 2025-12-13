import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, Heart, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-800">AI Recipe Book</h1>
          </Link>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <span className="text-gray-600">Hello, {user.name}!</span>
                <Link 
                  to="/favorites" 
                  className="text-orange-500 hover:text-orange-600 transition-colors"
                >
                  <Heart className="w-6 h-6" />
                </Link>
                <Link 
                  to="/profile" 
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <User className="w-6 h-6" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}