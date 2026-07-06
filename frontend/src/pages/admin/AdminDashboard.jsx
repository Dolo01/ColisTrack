import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import Layout from '../../components/Layout';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Search, Plus } from 'lucide-react';

const StatutColors = {
  ACHAT_EFFECTUE: 'bg-gray-100 text-gray-800',
  EXPEDIE_VENDEUR: 'bg-blue-100 text-blue-800',
  ARRIVE_TRANSITAIRE: 'bg-indigo-100 text-indigo-800',
  EN_TRAITEMENT: 'bg-purple-100 text-purple-800',
  ENVOYE_MALI: 'bg-yellow-100 text-yellow-800',
  ARRIVE_MALI: 'bg-orange-100 text-orange-800',
  DISPONIBLE: 'bg-green-100 text-green-800',
  RECUPERE: 'bg-emerald-100 text-emerald-800'
};

const formatStatut = (statut) => {
  return statut.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

const AdminDashboard = () => {
  const [colis, setColis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('');

  useEffect(() => {
    const fetchColis = async () => {
      try {
        const response = await api.get('/colis');
        setColis(response.data);
      } catch (error) {
        console.error("Erreur", error);
      } finally {
        setLoading(false);
      }
    };
    fetchColis();
  }, []);

  const filteredColis = colis.filter(c => {
    const matchesSearch = 
      c.codeSuivi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.telephoneClient.includes(searchTerm) ||
      (c.client?.nom && c.client.nom.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatut = filterStatut === '' || c.statutActuel === filterStatut;

    return matchesSearch && matchesStatut;
  });

  return (
    <Layout>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Colis</h1>
          <p className="mt-2 text-sm text-gray-700">Liste de tous les colis enregistrés dans le système.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/admin/colis/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Nouveau Colis
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            placeholder="Rechercher par code, nom ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="sm:w-64">
          <select
            className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="ACHAT_EFFECTUE">Achat effectué</option>
            <option value="EXPEDIE_VENDEUR">Expédié par le vendeur</option>
            <option value="ARRIVE_TRANSITAIRE">Arrivé chez le transitaire</option>
            <option value="EN_TRAITEMENT">En traitement</option>
            <option value="ENVOYE_MALI">Envoyé au Mali</option>
            <option value="ARRIVE_MALI">Arrivé au Mali</option>
            <option value="DISPONIBLE">Disponible pour récupération</option>
            <option value="RECUPERE">Récupéré par le client</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code / Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client / Téléphone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-4 text-center">Chargement...</td></tr>
              ) : filteredColis.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">Aucun colis trouvé.</td></tr>
              ) : (
                filteredColis.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{c.codeSuivi}</div>
                      <div className="text-sm text-gray-500">{format(new Date(c.createdAt), 'dd/MM/yyyy')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{c.client ? c.client.nom : <span className="text-yellow-600 font-medium">Non inscrit</span>}</div>
                      <div className="text-sm text-gray-500">{c.telephoneClient}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 truncate max-w-xs">{c.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${StatutColors[c.statutActuel] || 'bg-gray-100'}`}>
                        {formatStatut(c.statutActuel)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/admin/colis/${c.id}`} className="text-blue-600 hover:text-blue-900">
                        Gérer
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
