import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Package, LogOut } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-blue-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-white mr-2" />
              <span className="text-white text-xl font-bold">ColisTrack</span>
            </div>
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-blue-100 hidden sm:inline-block">
                  {user.nom} ({user.role === 'ADMIN' ? 'Admin' : 'Client'})
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-white hover:text-blue-200"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  <span className="hidden sm:inline-block">Déconnexion</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
