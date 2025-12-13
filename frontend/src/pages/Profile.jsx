import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Heart, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-orange-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-orange-100">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="border-b pb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Account Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-gray-800 font-medium">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800 font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Favorites</p>
                    <p className="text-gray-800 font-medium">
                      {user.favorites?.length || 0} recipes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/favorites')}
                  className="w-full flex items-center gap-3 bg-orange-50 p-4 rounded-lg hover:bg-orange-100 transition-all"
                >
                  <Heart className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-800 font-medium">View My Favorites</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 bg-red-50 p-4 rounded-lg hover:bg-red-100 transition-all"
                >
                  <LogOut className="w-5 h-5 text-red-500" />
                  <span className="text-gray-800 font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}