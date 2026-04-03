'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function SimulationPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('/api/matches');
        if (!response.ok) {
          router.push('/login');
          return;
        }
        const data = await response.json();
        // Filter for knockout stages
        const knockoutMatches = data.filter((match: any) => match.stage !== 'group');
        setMatches(knockoutMatches);
      } catch (error) {
        console.error('Erro ao carregar jogos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [router]);

  const getStageLabel = (stage: string) => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎮 Simulação</h1>
          <p className="text-gray-600 mb-8">
            Simule como seria o mata-mata da Copa do Mundo
          </p>

          {matches.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Simulação indisponível
              </h3>
              <p className="text-gray-600">
                Os jogos do mata-mata ainda não foram definidos.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {['round16', 'quarter', 'semi', 'final', 'third'].map((stage) => {
                const stageMatches = matches.filter((match) => match.stage === stage);
                if (stageMatches.length === 0) return null;

                return (
                  <div key={stage} className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {getStageLabel(stage)}
                    </h2>
                    <div className="space-y-3">
                      {stageMatches.map((match) => (
                        <div
                          key={match.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="text-center flex-1">
                              <div className="text-2xl">
                                {match.homeTeam?.flagUrl && (
                                  <img
                                    src={match.homeTeam.flagUrl}
                                    alt={match.homeTeam.name}
                                    className="w-8 h-6 mx-auto"
                                  />
                                )}
                              </div>
                              <div className="text-sm font-medium mt-1">
                                {match.homeTeam?.name}
                              </div>
                            </div>

                            <div className="text-center px-6">
                              {match.homeScore !== undefined && match.awayScore !== undefined ? (
                                <div className="text-2xl font-bold">
                                  {match.homeScore} - {match.awayScore}
                                </div>
                              ) : (
                                <div className="text-xl font-semibold text-gray-400">
                                  VS
                                </div>
                              )}
                            </div>

                            <div className="text-center flex-1">
                              <div className="text-2xl">
                                {match.awayTeam?.flagUrl && (
                                  <img
                                    src={match.awayTeam.flagUrl}
                                    alt={match.awayTeam.name}
                                    className="w-8 h-6 mx-auto"
                                  />
                                )}
                              </div>
                              <div className="text-sm font-medium mt-1">
                                {match.awayTeam?.name}
                              </div>
                            </div>
                          </div>

                          <div className="text-sm text-gray-500 ml-6">
                            {new Date(match.date).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Info Box */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">
              ℹ️ Informações sobre Simulação
            </h3>
            <ul className="space-y-2 text-yellow-800">
              <li>• A simulação é baseada nos resultados reais dos jogos</li>
              <li>• Jogos que ainda não acontecerão mostrarão "VS"</li>
              <li>• O bracket é atualizado automaticamente conforme os jogos ocorrem</li>
              <li>• Use a página de Jogos para fazer suas apostas</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
