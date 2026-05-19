import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Times da Copa do Mundo 2026 - 48 seleções (dados oficiais do Final Draw)
const teams = [
  // Grupo A
  { name: 'Mexico', code: 'MEX', flagUrl: 'https://flagcdn.com/w80/mx.png', group: 'A' },
  { name: 'South Africa', code: 'RSA', flagUrl: 'https://flagcdn.com/w80/za.png', group: 'A' },
  { name: 'South Korea', code: 'KOR', flagUrl: 'https://flagcdn.com/w80/kr.png', group: 'A' },
  { name: 'Czech Republic', code: 'CZE', flagUrl: 'https://flagcdn.com/w80/cz.png', group: 'A' },
  // Grupo B
  { name: 'Canada', code: 'CAN', flagUrl: 'https://flagcdn.com/w80/ca.png', group: 'B' },
  { name: 'Bosnia and Herzegovina', code: 'BIH', flagUrl: 'https://flagcdn.com/w80/ba.png', group: 'B' },
  { name: 'Qatar', code: 'QAT', flagUrl: 'https://flagcdn.com/w80/qa.png', group: 'B' },
  { name: 'Switzerland', code: 'SUI', flagUrl: 'https://flagcdn.com/w80/ch.png', group: 'B' },
  // Grupo C
  { name: 'Brazil', code: 'BRA', flagUrl: 'https://flagcdn.com/w80/br.png', group: 'C' },
  { name: 'Morocco', code: 'MAR', flagUrl: 'https://flagcdn.com/w80/ma.png', group: 'C' },
  { name: 'Haiti', code: 'HTI', flagUrl: 'https://flagcdn.com/w80/ht.png', group: 'C' },
  { name: 'Scotland', code: 'SCO', flagUrl: 'https://flagcdn.com/w80/gb-sct.png', group: 'C' },
  // Grupo D
  { name: 'USA', code: 'USA', flagUrl: 'https://flagcdn.com/w80/us.png', group: 'D' },
  { name: 'Paraguay', code: 'PRY', flagUrl: 'https://flagcdn.com/w80/py.png', group: 'D' },
  { name: 'Australia', code: 'AUS', flagUrl: 'https://flagcdn.com/w80/au.png', group: 'D' },
  { name: 'Turkey', code: 'TUR', flagUrl: 'https://flagcdn.com/w80/tr.png', group: 'D' },
  // Grupo E
  { name: 'Germany', code: 'GER', flagUrl: 'https://flagcdn.com/w80/de.png', group: 'E' },
  { name: 'Curacao', code: 'CUW', flagUrl: 'https://flagcdn.com/w80/cw.png', group: 'E' },
  { name: 'Ivory Coast', code: 'CIV', flagUrl: 'https://flagcdn.com/w80/ci.png', group: 'E' },
  { name: 'Ecuador', code: 'ECU', flagUrl: 'https://flagcdn.com/w80/ec.png', group: 'E' },
  // Grupo F
  { name: 'Netherlands', code: 'NED', flagUrl: 'https://flagcdn.com/w80/nl.png', group: 'F' },
  { name: 'Japan', code: 'JPN', flagUrl: 'https://flagcdn.com/w80/jp.png', group: 'F' },
  { name: 'Sweden', code: 'SWE', flagUrl: 'https://flagcdn.com/w80/se.png', group: 'F' },
  { name: 'Tunisia', code: 'TUN', flagUrl: 'https://flagcdn.com/w80/tn.png', group: 'F' },
  // Grupo G
  { name: 'Belgium', code: 'BEL', flagUrl: 'https://flagcdn.com/w80/be.png', group: 'G' },
  { name: 'Egypt', code: 'EGY', flagUrl: 'https://flagcdn.com/w80/eg.png', group: 'G' },
  { name: 'Iran', code: 'IRN', flagUrl: 'https://flagcdn.com/w80/ir.png', group: 'G' },
  { name: 'New Zealand', code: 'NZL', flagUrl: 'https://flagcdn.com/w80/nz.png', group: 'G' },
  // Grupo H
  { name: 'Spain', code: 'ESP', flagUrl: 'https://flagcdn.com/w80/es.png', group: 'H' },
  { name: 'Cape Verde', code: 'CPV', flagUrl: 'https://flagcdn.com/w80/cv.png', group: 'H' },
  { name: 'Saudi Arabia', code: 'KSA', flagUrl: 'https://flagcdn.com/w80/sa.png', group: 'H' },
  { name: 'Uruguay', code: 'URU', flagUrl: 'https://flagcdn.com/w80/uy.png', group: 'H' },
  // Grupo I
  { name: 'France', code: 'FRA', flagUrl: 'https://flagcdn.com/w80/fr.png', group: 'I' },
  { name: 'Senegal', code: 'SEN', flagUrl: 'https://flagcdn.com/w80/sn.png', group: 'I' },
  { name: 'Iraq', code: 'IRQ', flagUrl: 'https://flagcdn.com/w80/iq.png', group: 'I' },
  { name: 'Norway', code: 'NOR', flagUrl: 'https://flagcdn.com/w80/no.png', group: 'I' },
  // Grupo J
  { name: 'Austria', code: 'AUT', flagUrl: 'https://flagcdn.com/w80/at.png', group: 'J' },
  { name: 'Jordan', code: 'JOR', flagUrl: 'https://flagcdn.com/w80/jo.png', group: 'J' },
  { name: 'Argentina', code: 'ARG', flagUrl: 'https://flagcdn.com/w80/ar.png', group: 'J' },
  { name: 'Algeria', code: 'DZA', flagUrl: 'https://flagcdn.com/w80/dz.png', group: 'J' },
  // Grupo K
  { name: 'Portugal', code: 'POR', flagUrl: 'https://flagcdn.com/w80/pt.png', group: 'K' },
  { name: 'DR Congo', code: 'COD', flagUrl: 'https://flagcdn.com/w80/cd.png', group: 'K' },
  { name: 'Uzbekistan', code: 'UZB', flagUrl: 'https://flagcdn.com/w80/uz.png', group: 'K' },
  { name: 'Colombia', code: 'COL', flagUrl: 'https://flagcdn.com/w80/co.png', group: 'K' },
  // Grupo L
  { name: 'England', code: 'ENG', flagUrl: 'https://flagcdn.com/w80/gb-eng.png', group: 'L' },
  { name: 'Croatia', code: 'HRV', flagUrl: 'https://flagcdn.com/w80/hr.png', group: 'L' },
  { name: 'Ghana', code: 'GHA', flagUrl: 'https://flagcdn.com/w80/gh.png', group: 'L' },
  { name: 'Panama', code: 'PAN', flagUrl: 'https://flagcdn.com/w80/pa.png', group: 'L' },
];

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.prediction.deleteMany();
  await prisma.match.deleteMany();
  await prisma.team.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Dados existentes limpos');

  // Inserir times
  const createdTeams = await Promise.all(
    teams.map(team =>
      prisma.team.create({
        data: team,
      })
    )
  );

  console.log(`⚽ ${createdTeams.length} times criados`);

  // Criar um usuário administrador para testes
  const bcrypt = (await import('bcryptjs')).default;
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@worldcup.com',
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log('👤 Usuário administrador criado (admin@worldcup.com / admin123)');

  // Base date para Copa do Mundo 2026: 11 de Junho de 2026
  const june11_2026 = new Date('2026-06-11T00:00:00Z');

  // Jogos da fase de grupos - Rodada 1 (11-17 de Junho de 2026)
  const r01Matches = [
    // Grupo A - 11 de Junho
    { home: 'MEX', away: 'RSA', group: 'A', order: 1, date: new Date('2026-06-11T18:00:00Z') },
    { home: 'KOR', away: 'CZE', group: 'A', order: 2, date: new Date('2026-06-12T01:00:00Z') },
    // Grupo B - 12 e 13 de Junho
    { home: 'CAN', away: 'BIH', group: 'B', order: 3, date: new Date('2026-06-12T19:00:00Z') },
    { home: 'QAT', away: 'SUI', group: 'B', order: 4, date: new Date('2026-06-13T20:00:00Z') },
    // Grupo C - 13 de Junho
    { home: 'BRA', away: 'MAR', group: 'C', order: 5, date: new Date('2026-06-13T21:00:00Z') },
    { home: 'HTI', away: 'SCO', group: 'C', order: 6, date: new Date('2026-06-14T00:00:00Z') },
    // Grupo D - 12 e 13 de Junho
    { home: 'USA', away: 'PRY', group: 'D', order: 7, date: new Date('2026-06-12T21:00:00Z') },
    { home: 'AUS', away: 'TUR', group: 'D', order: 8, date: new Date('2026-06-14T02:00:00Z') },
    // Grupo E - 14 de Junho
    { home: 'GER', away: 'CUW', group: 'E', order: 9, date: new Date('2026-06-14T15:00:00Z') },
    { home: 'CIV', away: 'ECU', group: 'E', order: 10, date: new Date('2026-06-14T22:00:00Z') },
    // Grupo F - 14 de Junho
    { home: 'NED', away: 'JPN', group: 'F', order: 11, date: new Date('2026-06-14T18:00:00Z') },
    { home: 'SWE', away: 'TUN', group: 'F', order: 12, date: new Date('2026-06-14T23:00:00Z') },
    // Grupo H - 15 de Junho
    { home: 'ESP', away: 'CPV', group: 'H', order: 13, date: new Date('2026-06-15T15:00:00Z') },
    { home: 'KSA', away: 'URU', group: 'H', order: 14, date: new Date('2026-06-15T21:00:00Z') },
    // Grupo G - 15 de Junho
    { home: 'BEL', away: 'EGY', group: 'G', order: 15, date: new Date('2026-06-15T19:00:00Z') },
    { home: 'IRN', away: 'NZL', group: 'G', order: 16, date: new Date('2026-06-15T21:00:00Z') },
    // Grupo J - 16 de Junho
    { home: 'AUT', away: 'JOR', group: 'J', order: 17, date: new Date('2026-06-16T02:00:00Z') },
    // Grupo I - 16 de Junho
    { home: 'FRA', away: 'SEN', group: 'I', order: 18, date: new Date('2026-06-16T18:00:00Z') },
    { home: 'IRQ', away: 'NOR', group: 'I', order: 19, date: new Date('2026-06-16T21:00:00Z') },
    { home: 'ARG', away: 'DZA', group: 'J', order: 20, date: new Date('2026-06-17T01:00:00Z') },
    // Grupo K - 17 de Junho
    { home: 'POR', away: 'COD', group: 'K', order: 21, date: new Date('2026-06-17T15:00:00Z') },
    // Grupo L - 17 de Junho
    { home: 'ENG', away: 'HRV', group: 'L', order: 22, date: new Date('2026-06-17T18:00:00Z') },
    { home: 'GHA', away: 'PAN', group: 'L', order: 23, date: new Date('2026-06-17T22:00:00Z') },
    { home: 'UZB', away: 'COL', group: 'K', order: 24, date: new Date('2026-06-17T23:00:00Z') },
  ];

  // Jogos da fase de grupos - Rodada 2 (18-23 de Junho de 2026)
  const r02Matches = [
    // Grupo A - 18 de Junho
    { home: 'CZE', away: 'RSA', group: 'A', order: 25, date: new Date('2026-06-18T15:00:00Z') },
    // Grupo B - 18 e 19 de Junho
    { home: 'SUI', away: 'BIH', group: 'B', order: 26, date: new Date('2026-06-18T19:00:00Z') },
    { home: 'CAN', away: 'QAT', group: 'B', order: 27, date: new Date('2026-06-18T22:00:00Z') },
    { home: 'MEX', away: 'KOR', group: 'A', order: 28, date: new Date('2026-06-19T02:00:00Z') },
    // Grupo D - 19 e 20 de Junho
    { home: 'TUR', away: 'PRY', group: 'D', order: 29, date: new Date('2026-06-19T03:00:00Z') },
    { home: 'USA', away: 'AUS', group: 'D', order: 30, date: new Date('2026-06-19T19:00:00Z') },
    // Grupo C - 19 e 20 de Junho
    { home: 'SCO', away: 'MAR', group: 'C', order: 31, date: new Date('2026-06-19T21:00:00Z') },
    { home: 'BRA', away: 'HTI', group: 'C', order: 32, date: new Date('2026-06-20T00:30:00Z') },
    // Grupo F - 20 de Junho
    { home: 'TUN', away: 'JPN', group: 'F', order: 33, date: new Date('2026-06-20T02:00:00Z') },
    { home: 'NED', away: 'SWE', group: 'F', order: 34, date: new Date('2026-06-20T17:00:00Z') },
    // Grupo E - 20 de Junho
    { home: 'GER', away: 'CIV', group: 'E', order: 35, date: new Date('2026-06-20T21:00:00Z') },
    { home: 'ECU', away: 'CUW', group: 'E', order: 36, date: new Date('2026-06-20T22:00:00Z') },
    // Grupo H - 21 de Junho
    { home: 'ESP', away: 'KSA', group: 'H', order: 37, date: new Date('2026-06-21T15:00:00Z') },
    // Grupo G - 21 de Junho
    { home: 'BEL', away: 'IRN', group: 'G', order: 38, date: new Date('2026-06-21T19:00:00Z') },
    { home: 'URU', away: 'CPV', group: 'H', order: 39, date: new Date('2026-06-21T21:00:00Z') },
    { home: 'NZL', away: 'EGY', group: 'G', order: 40, date: new Date('2026-06-21T22:00:00Z') },
    // Grupo J - 22 de Junho
    { home: 'ARG', away: 'AUT', group: 'J', order: 41, date: new Date('2026-06-22T15:00:00Z') },
    // Grupo I - 22 de Junho
    { home: 'FRA', away: 'IRQ', group: 'I', order: 42, date: new Date('2026-06-22T20:00:00Z') },
    { home: 'NOR', away: 'SEN', group: 'I', order: 43, date: new Date('2026-06-22T23:00:00Z') },
    { home: 'JOR', away: 'DZA', group: 'J', order: 44, date: new Date('2026-06-22T03:00:00Z') },
    // Grupo K - 23 de Junho
    { home: 'POR', away: 'UZB', group: 'K', order: 45, date: new Date('2026-06-23T15:00:00Z') },
    // Grupo L - 23 de Junho
    { home: 'ENG', away: 'GHA', group: 'L', order: 46, date: new Date('2026-06-23T19:00:00Z') },
    { home: 'PAN', away: 'HRV', group: 'L', order: 47, date: new Date('2026-06-23T22:00:00Z') },
    { home: 'COL', away: 'COD', group: 'K', order: 48, date: new Date('2026-06-23T23:00:00Z') },
  ];

  // Jogos da fase de grupos - Rodada 3 (24-27 de Junho de 2026)
  const r03Matches = [
    // Grupo B - 24 de Junho
    { home: 'SUI', away: 'CAN', group: 'B', order: 49, date: new Date('2026-06-24T19:00:00Z') },
    { home: 'BIH', away: 'QAT', group: 'B', order: 50, date: new Date('2026-06-24T19:00:00Z') },
    // Grupo C - 24 de Junho
    { home: 'SCO', away: 'BRA', group: 'C', order: 51, date: new Date('2026-06-24T21:00:00Z') },
    { home: 'MAR', away: 'HTI', group: 'C', order: 52, date: new Date('2026-06-24T21:00:00Z') },
    // Grupo A - 24 de Junho
    { home: 'CZE', away: 'MEX', group: 'A', order: 53, date: new Date('2026-06-24T02:00:00Z') },
    { home: 'RSA', away: 'KOR', group: 'A', order: 54, date: new Date('2026-06-24T02:00:00Z') },
    // Grupo E - 25 de Junho
    { home: 'ECU', away: 'GER', group: 'E', order: 55, date: new Date('2026-06-25T21:00:00Z') },
    { home: 'CUW', away: 'CIV', group: 'E', order: 56, date: new Date('2026-06-25T21:00:00Z') },
    // Grupo F - 25 de Junho
    { home: 'JPN', away: 'SWE', group: 'F', order: 57, date: new Date('2026-06-25T23:00:00Z') },
    { home: 'TUN', away: 'NED', group: 'F', order: 58, date: new Date('2026-06-25T23:00:00Z') },
    // Grupo D - 25 de Junho
    { home: 'TUR', away: 'USA', group: 'D', order: 59, date: new Date('2026-06-25T02:00:00Z') },
    { home: 'PRY', away: 'AUS', group: 'D', order: 60, date: new Date('2026-06-25T02:00:00Z') },
    // Grupo I - 26 de Junho
    { home: 'NOR', away: 'FRA', group: 'I', order: 61, date: new Date('2026-06-26T19:00:00Z') },
    { home: 'SEN', away: 'IRQ', group: 'I', order: 62, date: new Date('2026-06-26T19:00:00Z') },
    // Grupo H - 26 de Junho
    { home: 'CPV', away: 'KSA', group: 'H', order: 63, date: new Date('2026-06-26T22:00:00Z') },
    { home: 'URU', away: 'ESP', group: 'H', order: 64, date: new Date('2026-06-26T21:00:00Z') },
    // Grupo G - 26 de Junho
    { home: 'EGY', away: 'IRN', group: 'G', order: 65, date: new Date('2026-06-26T04:00:00Z') },
    { home: 'NZL', away: 'BEL', group: 'G', order: 66, date: new Date('2026-06-26T04:00:00Z') },
    // Grupo L - 27 de Junho
    { home: 'PAN', away: 'ENG', group: 'L', order: 67, date: new Date('2026-06-27T21:00:00Z') },
    { home: 'HRV', away: 'GHA', group: 'L', order: 68, date: new Date('2026-06-27T21:00:00Z') },
    // Grupo K - 27 de Junho
    { home: 'COL', away: 'POR', group: 'K', order: 69, date: new Date('2026-06-27T00:30:00Z') },
    { home: 'COD', away: 'UZB', group: 'K', order: 70, date: new Date('2026-06-27T00:30:00Z') },
    // Grupo J - 27 de Junho
    { home: 'DZA', away: 'AUT', group: 'J', order: 71, date: new Date('2026-06-27T02:00:00Z') },
    { home: 'JOR', away: 'ARG', group: 'J', order: 72, date: new Date('2026-06-27T02:00:00Z') },
  ];

  // Combinar todas as rodadas da fase de grupos
  const allGroupMatches = [...r01Matches, ...r02Matches, ...r03Matches];

  const createdMatches = await Promise.all(
    allGroupMatches.map(match => {
      const homeTeam = createdTeams.find(t => t.code === match.home);
      const awayTeam = createdTeams.find(t => t.code === match.away);

      if (!homeTeam || !awayTeam) {
        console.warn(`⚠️  Team not found: ${match.home} or ${match.away}`);
        return null;
      }

      return prisma.match.create({
        data: {
          stage: 'group',
          group: match.group,
          order: match.order,
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          date: match.date,
        },
      });
    })
  );

  // Filtrar valores null (caso algum time não seja encontrado)
  const validMatches = createdMatches.filter(m => m !== null) as any[];

  console.log(`📅 ${validMatches.length} jogos criados (fase de grupos - 3 rodadas de 72 jogos)`);
  console.log(`ℹ️  Nota: Jogos das fases eliminatórias serão adicionados conforme os grupos avançarem`);

  console.log('✅ Seed concluído com sucesso!');
  console.log('🎮 Times: 48 seleções da Copa do Mundo 2026 (dados oficiais do Final Draw)');
  console.log('⚽ Jogos: Fase de grupos com 3 rodadas (72 jogos)');
  console.log('📊 Grupos: A-L (12 grupos com 4 times cada)');
  console.log('🗓️  Período: 11 de Junho a 27 de Junho de 2026');
  console.log('📍 Sedes: Canadá, México e Estados Unidos');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
