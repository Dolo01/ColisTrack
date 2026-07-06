import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';
import Layout from '../../components/Layout';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react';

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

const ClientColisDetail = () => {
  const { id } = useParams();
  const [colis, setColis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchColis = async () => {
      try {
        const response = await api.get(`/colis/mine/${id}`);
        setColis(response.data);
      } catch (err) {
        setError('Impossible de charger les détails du colis.');
      } finally {
        setLoading(false);
      }
    };
    fetchColis();
  }, [id]);

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

  const currentStepIndex = STEPS.indexOf(colis.statutActuel);

  return (
    <Layout>
      <div className="mb-6">
        <Link to="/client/dashboard" className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour au tableau de bord
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Détails du colis
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Code: <span className="font-semibold text-gray-900">{colis.codeSuivi}</span>
            </p>
          </div>
          <div className="text-right">
             <p className="text-sm text-gray-500">Description</p>
             <p className="font-medium text-gray-900">{colis.description}</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-6">Suivi d'expédition</h4>
        <div className="flow-root">
          <ul className="-mb-8">
            {STEPS.map((step, stepIdx) => {
              const isCompleted = STEPS.indexOf(step) <= currentStepIndex;
              const isCurrent = STEPS.indexOf(step) === currentStepIndex;
              const historyEntry = colis.historique.find(h => h.statut === step);

              return (
                <li key={step}>
                  <div className="relative pb-8">
                    {stepIdx !== STEPS.length - 1 ? (
                      <span className={`absolute top-4 left-4 -ml-px h-full w-0.5 ${isCompleted && !isCurrent ? 'bg-blue-600' : 'bg-gray-200'}`} aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${isCompleted ? 'bg-blue-600' : 'bg-gray-200'}`}>
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-white" aria-hidden="true" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          )}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className={`text-sm ${isCurrent ? 'font-bold text-gray-900' : isCompleted ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                            {formatStatut(step)}
                          </p>
                          {historyEntry && historyEntry.commentaire && (
                            <p className="mt-1 text-sm text-gray-500">{historyEntry.commentaire}</p>
                          )}
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          {historyEntry && (
                            <time dateTime={historyEntry.date}>
                              {format(new Date(historyEntry.date), 'dd MMM yyyy HH:mm', { locale: fr })}
                            </time>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default ClientColisDetail;
