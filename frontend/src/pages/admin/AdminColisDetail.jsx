import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';
import Layout from '../../components/Layout';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowLeft, User, Phone, Edit, MessageSquare } from 'lucide-react';

const STEPS = [
  'ACHAT_EFFECTUE',
  'EXPEDIE_VENDEUR',
  'ARRIVE_TRANSITAIRE',
  'EN_TRAITEMENT',
  'ENVOYE_MALI',
  'ARRIVE_MALI',
  'DISPONIBLE',
  'RECUPERE'
];

const formatStatut = (statut) => {
  return statut.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

const AdminColisDetail = () => {
  const { id } = useParams();
  const [colis, setColis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Status update state
  const [newStatut, setNewStatut] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchColis = async () => {
    try {
      const response = await api.get(`/colis/${id}`);
      setColis(response.data);
      setNewStatut(response.data.statutActuel);
    } catch (err) {
      setError('Impossible de charger les détails du colis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColis();
  }, [id]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await api.put(`/colis/${id}/statut`, {
        statut: newStatut,
        commentaire
      });
      setCommentaire('');
      fetchColis(); // Reload to get updated history
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !colis) {
    return (
      <Layout>
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error || 'Colis introuvable'}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <Link to="/admin/dashboard" className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour aux colis
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white shadow sm:rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Informations du Colis
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Code de suivi</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-semibold">{colis.codeSuivi}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Statut actuel</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatStatut(colis.statutActuel)}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">{colis.description}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white shadow sm:rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2 text-gray-400" />
                Informations Client
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Phone className="h-4 w-4 mr-1" /> Téléphone
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{colis.telephoneClient}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Compte lié</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {colis.client ? (
                      <span className="text-green-600 font-medium">{colis.client.nom} ({colis.client.email || 'Pas d\'email'})</span>
                    ) : (
                      <span className="text-yellow-600 font-medium">Non inscrit (En attente)</span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* History */}
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-6">Historique des statuts</h4>
            <div className="flow-root">
              <ul className="-mb-8">
                {colis.historique.map((h, hIdx) => (
                  <li key={h.id}>
                    <div className="relative pb-8">
                      {hIdx !== colis.historique.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                            <span className="text-white text-xs font-medium">{hIdx + 1}</span>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {formatStatut(h.statut)}
                            </p>
                            {h.commentaire && (
                              <p className="mt-1 text-sm text-gray-500 flex items-start">
                                <MessageSquare className="h-4 w-4 mr-1 mt-0.5" />
                                {h.commentaire}
                              </p>
                            )}
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time dateTime={h.date}>
                              {format(new Date(h.date), 'dd MMM yyyy HH:mm', { locale: fr })}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column - Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow sm:rounded-lg sticky top-8">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center mb-4">
                <Edit className="h-5 w-5 mr-2 text-gray-400" />
                Mettre à jour
              </h3>
              
              <form onSubmit={handleUpdateStatus} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nouveau Statut</label>
                  <select
                    value={newStatut}
                    onChange={(e) => setNewStatut(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                  >
                    {STEPS.map(s => (
                      <option key={s} value={s}>{formatStatut(s)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Commentaire (optionnel)</label>
                  <textarea
                    rows={2}
                    value={commentaire}
                    onChange={(e) => setCommentaire(e.target.value)}
                    placeholder="Ex: Retard à la douane"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md border p-2"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating || newStatut === colis.statutActuel && !commentaire}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {updating ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </form>
            </div>
          </div>
        </div>
        
      </div>
    </Layout>
  );
};

export default AdminColisDetail;
