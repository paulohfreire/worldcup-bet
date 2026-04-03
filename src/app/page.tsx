export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">🏆 World Cup Betting Pool</h1>
        <p className="text-2xl mb-8">Aposta com seus amigos nos jogos da Copa do Mundo</p>
        <div className="space-x-4">
          <a
            href="/login"
            className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-100 transition"
          >
            Login
          </a>
          <a
            href="/register"
            className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition"
          >
            Criar Conta
          </a>
        </div>
      </div>
    </main>
  );
}
