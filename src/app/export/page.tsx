'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function ExportPage() {
  const router = useRouter();

  const handleExportRanking = async () => {
    try {
      const response = await fetch('/api/export/ranking');
      if (!response.ok) {
        throw new Error('Erro ao exportar ranking');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ranking-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao exportar ranking:', error);
      alert('Erro ao exportar ranking');
    }
  };

  const handleExportPredictions = async () => {
    try {
      const response = await fetch('/api/export/predictions');
      if (!response.ok) {
        throw new Error('Erro ao exportar apostas');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `apostas-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao exportar apostas:', error);
      alert('Erro ao exportar apostas');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">📥 Exportar Dados</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export Ranking Card */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-4">🏆</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Ranking</h3>
                  <p className="text-sm text-gray-600">
                    Exporte o ranking atual em formato CSV
                  </p>
                </div>
              </div>
              <button
                onClick={handleExportRanking}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Exportar Ranking (CSV)
              </button>
            </div>

            {/* Export Predictions Card */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-4">🎯</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Apostas</h3>
                  <p className="text-sm text-gray-600">
                    Exporte todas as apostas em formato CSV
                  </p>
                </div>
              </div>
              <button
                onClick={handleExportPredictions}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
              >
                Exportar Apostas (CSV)
              </button>
            </div>

            {/* Export Ranking PDF Card */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition opacity-60">
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-4">📄</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Ranking (PDF)</h3>
                  <p className="text-sm text-gray-600">
                    Exporte o ranking atual em formato PDF
                  </p>
                </div>
              </div>
              <button
                disabled
                className="w-full bg-gray-400 text-white py-3 rounded-lg font-semibold cursor-not-allowed"
              >
                Em breve
              </button>
            </div>

            {/* Export Predictions PDF Card */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition opacity-60">
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-4">📊</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Apostas (PDF)</h3>
                  <p className="text-sm text-gray-600">
                    Exporte todas as apostas em formato PDF
                  </p>
                </div>
              </div>
              <button
                disabled
                className="w-full bg-gray-400 text-white py-3 rounded-lg font-semibold cursor-not-allowed"
              >
                Em breve
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              ℹ️ Informações sobre Exportação
            </h3>
            <ul className="space-y-2 text-blue-800">
              <li>• Os arquivos CSV podem ser abertos em Excel, Google Sheets ou qualquer editor de planilhas</li>
              <li>• As exportações incluem todos os dados disponíveis até o momento</li>
              <li>• PDFs estarão disponíveis em futuras versões</li>
              <li>• Os dados são exportados em tempo real</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
