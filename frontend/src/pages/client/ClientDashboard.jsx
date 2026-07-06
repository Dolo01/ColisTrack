import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import Layout from '../../components/Layout';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Package, Clock, ChevronRight } from 'lucide-react';

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

const ClientDashboard = () => {
  const [colis, setColis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColis = async () => {
      try {
        const response = await api.get('/colis/mine');
        setColis(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des colis", error);
      } finally {
        setLoading(false);
      }
    };
    fetchColis();
  }, []);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mes Colis</h1>
        <p className="text-gray-600 mt-1">Suivez l'état de tous vos envois</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : colis.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Aucun colis trouvé</h3>
          <p className="text-gray-500 mt-2">Vous n'avez pas encore de colis associé à votre compte.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {colis.map((c) => (
              <li key={c.id}>
                <Link to={`/client/colis/${c.id}`} className="block hover:bg-gray-50 transition-colors">
                  <div className="px-4 py-4 sm:px-6 flex items-center">
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <div className="flex text-sm font-medium text-blue-600 truncate">
                          Code: {c.codeSuivi}
                        </div>
                        <div className="mt-2 flex">
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="truncate">{c.description}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                        <div className="flex flex-col sm:items-end">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${StatutColors[c.statutActuel] || 'bg-gray-100'}`}>
                            {formatStatut(c.statutActuel)}
                          </span>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <p>
                              Créé le {format(new Date(c.createdAt), 'dd MMM yyyy', { locale: fr })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-5 flex-shrink-0">
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Layout>
  );
};

export default ClientDashboard;
