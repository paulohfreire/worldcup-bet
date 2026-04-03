'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nextMatches, setNextMatches] = useState<any[]>([]);
  const [myPredictions, setMyPredictions] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check auth and get user
        const meResponse = await fetch('/api/auth/me');
        if (!meResponse.ok) {
          router.push('/login');
          return;
        }
        const userData = await meResponse.json();
        setUser(userData);

        // Get next matches
        const matchesResponse = await fetch('/api/matches');
        if (matchesResponse.ok) {
          const matchesData = await matchesResponse.json();
          const now = new Date();
          const upcoming = matchesData
            .filter((match: any) => new Date(match.date) > now)
            .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 5);
          setNextMatches(upcoming);
        }

        // Get predictions count
        const predictionsResponse = await fetch('/api/predictions');
        if (predictionsResponse.ok) {
          const predictionsData = await predictionsResponse.json();
          setMyPredictions(predictionsData.length);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

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
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-2">
            Bem-vindo, {user?.name}! 👋
          </h1>
          <p className="text-xl opacity-90">
            Prepare suas apostas para a Copa do Mundo
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Jogos Próximos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {nextMatches.length}
                </p>
              </div>
              <div className="text-4xl">⚽</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Suas Apostas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {myPredictions}
                </p>
              </div>
              <div className="text-4xl">🎯</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Seu Progresso</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {Math.round((myPredictions / Math.max(nextMatches.length, 1)) * 100)}%
                </p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>
        </div>

        {/* Next Matches */}
        {nextMatches.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📅 Próximos Jogos</h2>
            <div className="space-y-4">
              {nextMatches.map((match) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => router.push(`/matches`)}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="text-center">
                      <div className="text-2xl">{match.homeTeam?.flagUrl && (
                        <img src={match.homeTeam.flagUrl} alt={match.homeTeam.name} className="w-8 h-6" />
                      )}</div>
                      <div className="text-sm font-medium">{match.homeTeam?.code}</div>
                    </div>

                    <div className="text-center flex-1">
                      <div className="text-xs text-gray-500">
                        {new Date(match.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-lg font-semibold">VS</div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl">{match.awayTeam?.flagUrl && (
                        <img src={match.awayTeam.flagUrl} alt={match.awayTeam.name} className="w-8 h-6" />
                      )}</div>
                      <div className="text-sm font-medium">{match.awayTeam?.code}</div>
                    </div>
                  </div>

                  <div className="text-sm text-blue-600 font-medium">
                    Fazer aposta →
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => router.push('/matches')}
            className="bg-blue-600 text-white rounded-xl p-6 text-left hover:bg-blue-700 transition shadow-lg"
          >
            <h3 className="text-xl font-bold mb-2">Ver Todos os Jogos</h3>
            <p className="opacity-90">Acesse a lista completa de jogos e faça suas apostas</p>
          </button>

          <button
            onClick={() => router.push('/ranking')}
            className="bg-purple-600 text-white rounded-xl p-6 text-left hover:bg-purple-700 transition shadow-lg"
          >
            <h3 className="text-xl font-bold mb-2">Ver Ranking</h3>
            <p className="opacity-90">Veja como você está se saindo comparado aos outros</p>
          </button>
        </div>
      </main>
    </div>
  );
}
