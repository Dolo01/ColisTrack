import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import Layout from '../../components/Layout';
import { ArrowLeft } from 'lucide-react';

const AdminColisCreate = () => {
  const [formData, setFormData] = useState({
    telephoneClient: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/colis', formData);
      navigate(`/admin/colis/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création du colis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <Link to="/admin/dashboard" className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour aux colis
        </Link>
      </div>

      <div className="max-w-2xl mx-auto bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Enregistrer un nouveau colis</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 p-4 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Téléphone du client *</label>
              <div className="mt-1">
                <input
                  type="text"
                  name="telephoneClient"
                  required
                  placeholder="ex: 70000000"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md border p-2"
                  value={formData.telephoneClient}
                  onChange={handleChange}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Si le client n'a pas encore de compte, le colis lui sera automatiquement rattaché quand il s'inscrira avec ce numéro.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description du colis *</label>
              <div className="mt-1">
                <textarea
                  name="description"
                  required
                  rows={3}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md border p-2"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Création...' : 'Créer le colis'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AdminColisCreate;
