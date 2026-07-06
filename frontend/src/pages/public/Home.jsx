import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center space-y-6">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <Package className="w-12 h-12 text-blue-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900">ColisTrack</h1>
        <p className="text-gray-500">
          Suivez vos colis depuis l'achat jusqu'à la récupération finale au Mali en toute simplicité.
        </p>
        
        <div className="pt-6 space-y-4">
          <Link
            to="/login"
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Se Connecter
          </Link>
          <Link
            to="/register"
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
