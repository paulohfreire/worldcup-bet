'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { formatDateTime, isMatchStarted } from '@/lib/ui';
import { getMatches, getPredictions, submitPrediction } from '@/lib/api';

// Componente separado para cada jogo para evitar problemas com Hooks
function MatchCard({ match, myPrediction, submitting, onSubmit }: {
  match: any;
  myPrediction: any;
  submitting: boolean;
  onSubmit: (homeScore: number, awayScore: number) => void;
}) {
  const [homePred, setHomePred] = useState(myPrediction?.homeScore ?? 0);
  const [awayPred, setAwayPred] = useState(myPrediction?.awayScore ?? 0);

  const isStarted = isMatchStarted(match.date);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        {/* Teams */}
        <div className="flex items-center space-x-4 flex-1 justify-center md:justify-start">
          <div className="text-center">
            <div className="text-3xl">
              {match.homeTeam?.flagUrl && (
                <img
                  src={match.homeTeam.flagUrl}
                  alt={match.homeTeam.name}
                  className="w-12 h-8 mx-auto"
                />
              )}
            </div>
            <div className="text-sm font-medium mt-1">
              {match.homeTeam?.code}
            </div>
          </div>

          <div className="px-8">
            {match.homeScore !== undefined && match.awayScore !== undefined ? (
              <div className="text-3xl font-bold text-gray-900">
                {match.homeScore} - {match.awayScore}
              </div>
            ) : (
              <div className="text-2xl font-semibold text-gray-400">
                VS
              </div>
            )}
          </div>

          <div className="text-center">
            <div className="text-3xl">
              {match.awayTeam?.flagUrl && (
                <img
                  src={match.awayTeam.flagUrl}
                  alt={match.awayTeam.name}
                  className="w-12 h-8 mx-auto"
                />
              )}
            </div>
            <div className="text-sm font-medium mt-1">
              {match.awayTeam?.code}
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="text-sm text-gray-500 mt-4 md:mt-0">
          {formatDateTime(match.date)}
        </div>
      </div>

      {/* Prediction Form */}
      {!isStarted && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">
                {match.homeTeam?.name}
              </div>
              <input
                type="number"
                min="0"
                max="20"
                value={homePred}
                onChange={(e) => setHomePred(parseInt(e.target.value) || 0)}
                className="w-16 h-12 text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
              />
            </div>

            <div className="text-2xl font-bold text-gray-400">:</div>

            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">
                {match.awayTeam?.name}
              </div>
              <input
                type="number"
                min="0"
                max="20"
                value={awayPred}
                onChange={(e) => setAwayPred(parseInt(e.target.value) || 0)}
                className="w-16 h-12 text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
              />
            </div>

            <button
              onClick={() => onSubmit(homePred, awayPred)}
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      )}

      {/* Locked/Started Match */}
      {isStarted && myPrediction && (
        <div className="border-t pt-4 bg-gray-50 rounded-lg px-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Sua aposta: <strong>{myPrediction.homeScore} - {myPrediction.awayScore}</strong>
            </div>
            <div className="text-xs text-gray-400">
              ⏰ Bloqueado
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [myPredictions, setMyPredictions] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});

  useState(0); // Dummy state para evitar erro de hooks

  useState(0); // Dummy state para evitar erro de hooks

  useState(0); // Dummy state para evitar erro de hooks

  useState(0); // Dummy state para evitar erro de hooks

  useState(0); // Dummy state para evitar erro de hooks

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchesData, predictionsData] = await Promise.all([
          getMatches(),
          getPredictions(),
        ]);

        setMatches(matchesData);

        // Create predictions map by matchId
        const predictionsMap: Record<string, any> = {};
        predictionsData.forEach((pred: any) => {
          predictionsMap[pred.matchId] = pred;
        });
        setMyPredictions(predictionsMap);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePredictionSubmit = async (matchId: string, homeScore: number, awayScore: number) => {
    setSubmitting({ ...submitting, [matchId]: true });

    try {
      const prediction = await submitPrediction(matchId, homeScore, awayScore);
      setMyPredictions({ ...myPredictions, [matchId]: prediction });
    } catch (error) {
      console.error('Erro ao salvar aposta:', error);
      alert('Erro ao salvar aposta');
    } finally {
      setSubmitting({ ...submitting, [matchId]: false });
    }
  };

  const groupMatches = () => {
    const grouped: Record<string, any[]> = {};
    matches.forEach(match => {
      const stage = match.stage;
      const group = match.group || 'knockout';
      const key = stage === 'group' ? `Grupo ${group}` : getStageName(stage);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(match);
    });
    return grouped;
  };

  const getStageName = (stage: string) => {
    const stages: Record<string, string> = {
      'round16': 'Oitavas de Final',
      'quarter': 'Quartas de Final',
      'semi': 'Semifinais',
      'final': 'Final',
      'third': 'Disputa de 3º Lugar',
    };
    return stages[stage] || stage;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const groupedMatches = groupMatches();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">⚽ Jogos</h1>

          {Object.entries(groupedMatches).map(([groupName, groupMatches]) => (
            <div key={groupName} className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {groupName}
              </h2>
              <div className="space-y-4">
                {groupMatches
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      myPrediction={myPredictions[match.id]}
                      submitting={submitting[match.id] || false}
                      onSubmit={(homeScore, awayScore) => handlePredictionSubmit(match.id, homeScore, awayScore)}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
