import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Times da Copa do Mundo 2026 - 48 seleções (completando os 48 com base na estrutura dos jogos)
const teams = [
  // Grupo A
  { name: 'Mexico', code: 'MEX', flagUrl: 'https://flagcdn.com/w80/mx.png', group: 'A' },
  { name: 'South Africa', code: 'RSA', flagUrl: 'https://flagcdn.com/w80/za.png', group: 'A' },
  { name: 'USA', code: 'USA', flagUrl: 'https://flagcdn.com/w80/us.png', group: 'A' },
  { name: 'Paraguay', code: 'PRY', flagUrl: 'https://flagcdn.com/w80/py.png', group: 'A' },
  // Grupo B
  { name: 'Qatar', code: 'QAT', flagUrl: 'https://flagcdn.com/w80/qa.png', group: 'B' },
  { name: 'Switzerland', code: 'SUI', flagUrl: 'https://flagcdn.com/w80/ch.png', group: 'B' },
  { name: 'Brazil', code: 'BRA', flagUrl: 'https://flagcdn.com/w80/br.png', group: 'B' },
  { name: 'Morocco', code: 'MAR', flagUrl: 'https://flagcdn.com/w80/ma.png', group: 'B' },
  // Grupo C
  { name: 'Haiti', code: 'HTI', flagUrl: 'https://flagcdn.com/w80/ht.png', group: 'C' },
  { name: 'Scotland', code: 'SCO', flagUrl: 'https://flagcdn.com/w80/gb-sct.png', group: 'C' },
  { name: 'Germany', code: 'GER', flagUrl: 'https://flagcdn.com/w80/de.png', group: 'C' },
  { name: 'Curaçao', code: 'CUW', flagUrl: 'https://flagcdn.com/w80/cw.png', group: 'C' },
  // Grupo D
  { name: 'Netherlands', code: 'NED', flagUrl: 'https://flagcdn.com/w80/nl.png', group: 'D' },
  { name: 'Japan', code: 'JPN', flagUrl: 'https://flagcdn.com/w80/jp.png', group: 'D' },
  { name: 'Ivory Coast', code: 'CIV', flagUrl: 'https://flagcdn.com/w80/ci.png', group: 'D' },
  { name: 'Ecuador', code: 'ECU', flagUrl: 'https://flagcdn.com/w80/ec.png', group: 'D' },
  // Grupo E
  { name: 'Spain', code: 'ESP', flagUrl: 'https://flagcdn.com/w80/es.png', group: 'E' },
  { name: 'Cape Verde', code: 'CPV', flagUrl: 'https://flagcdn.com/w80/cv.png', group: 'E' },
  { name: 'Belgium', code: 'BEL', flagUrl: 'https://flagcdn.com/w80/be.png', group: 'E' },
  { name: 'Egypt', code: 'EGY', flagUrl: 'https://flagcdn.com/w80/eg.png', group: 'E' },
  // Grupo F
  { name: 'Saudi Arabia', code: 'KSA', flagUrl: 'https://flagcdn.com/w80/sa.png', group: 'F' },
  { name: 'Uruguay', code: 'URU', flagUrl: 'https://flagcdn.com/w80/uy.png', group: 'F' },
  { name: 'Iran', code: 'IRN', flagUrl: 'https://flagcdn.com/w80/ir.png', group: 'F' },
  { name: 'New Zealand', code: 'NZL', flagUrl: 'https://flagcdn.com/w80/nz.png', group: 'F' },
  // Grupo G
  { name: 'France', code: 'FRA', flagUrl: 'https://flagcdn.com/w80/fr.png', group: 'G' },
  { name: 'Senegal', code: 'SEN', flagUrl: 'https://flagcdn.com/w80/sn.png', group: 'G' },
  { name: 'Argentina', code: 'ARG', flagUrl: 'https://flagcdn.com/w80/ar.png', group: 'G' },
  { name: 'Algeria', code: 'DZA', flagUrl: 'https://flagcdn.com/w80/dz.png', group: 'G' },
  // Grupo H
  { name: 'Austria', code: 'AUT', flagUrl: 'https://flagcdn.com/w80/at.png', group: 'H' },
  { name: 'Jordan', code: 'JOR', flagUrl: 'https://flagcdn.com/w80/jo.png', group: 'H' },
  { name: 'England', code: 'ENG', flagUrl: 'https://flagcdn.com/w80/gb-eng.png', group: 'H' },
  { name: 'Croatia', code: 'HRV', flagUrl: 'https://flagcdn.com/w80/hr.png', group: 'H' },
  // Grupo I
  { name: 'Ghana', code: 'GHA', flagUrl: 'https://flagcdn.com/w80/gh.png', group: 'I' },
  { name: 'Panama', code: 'PAN', flagUrl: 'https://flagcdn.com/w80/pa.png', group: 'I' },
  { name: 'Uzbekistan', code: 'UZB', flagUrl: 'https://flagcdn.com/w80/uz.png', group: 'I' },
  { name: 'Colombia', code: 'COL', flagUrl: 'https://flagcdn.com/w80/co.png', group: 'I' },
  // Grupo J
  { name: 'Canada', code: 'CAN', flagUrl: 'https://flagcdn.com/w80/ca.png', group: 'J' },
  { name: 'South Korea', code: 'KOR', flagUrl: 'https://flagcdn.com/w80/kr.png', group: 'J' },
  { name: 'Australia', code: 'AUS', flagUrl: 'https://flagcdn.com/w80/au.png', group: 'J' },
  { name: 'Tunisia', code: 'TUN', flagUrl: 'https://flagcdn.com/w80/tn.png', group: 'J' },
  // Grupo K
  { name: 'Norway', code: 'NOR', flagUrl: 'https://flagcdn.com/w80/no.png', group: 'K' },
  { name: 'Portugal', code: 'POR', flagUrl: 'https://flagcdn.com/w80/pt.png', group: 'K' },
  // Adicionar 2 times para completar 48
  { name: 'Poland', code: 'POL', flagUrl: 'https://flagcdn.com/w80/pl.png', group: 'K' },
  { name: 'Sweden', code: 'SWE', flagUrl: 'https://flagcdn.com/w80/se.png', group: 'K' },
  // Grupo L
  { name: 'Denmark', code: 'DNK', flagUrl: 'https://flagcdn.com/w80/dk.png', group: 'L' },
  { name: 'Czech Republic', code: 'CZE', flagUrl: 'https://flagcdn.com/w80/cz.png', group: 'L' },
  { name: 'Wales', code: 'WAL', flagUrl: 'https://flagcdn.com/w80/gb-wls.png', group: 'L' },
  { name: 'Serbia', code: 'SRB', flagUrl: 'https://flagcdn.com/w80/rs.png', group: 'L' },
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

  // Jogos da fase de grupos - Rodada 1 (r01)
  const r01Matches = [
    { home: 'MEX', away: 'RSA', group: 'A', order: 1, date: new Date('2026-06-11T12:00:00Z') },
    { home: 'USA', away: 'PRY', group: 'A', order: 2, date: new Date('2026-06-13T15:00:00Z') },
    { home: 'QAT', away: 'SUI', group: 'B', order: 3, date: new Date('2026-06-13T18:00:00Z') },
    { home: 'BRA', away: 'MAR', group: 'B', order: 4, date: new Date('2026-06-13T21:00:00Z') },
    { home: 'HTI', away: 'SCO', group: 'C', order: 5, date: new Date('2026-06-14T12:00:00Z') },
    { home: 'GER', away: 'CUW', group: 'C', order: 6, date: new Date('2026-06-14T15:00:00Z') },
    { home: 'NED', away: 'JPN', group: 'D', order: 7, date: new Date('2026-06-14T18:00:00Z') },
    { home: 'CIV', away: 'ECU', group: 'D', order: 8, date: new Date('2026-06-14T21:00:00Z') },
    { home: 'ESP', away: 'CPV', group: 'E', order: 9, date: new Date('2026-06-15T12:00:00Z') },
    { home: 'BEL', away: 'EGY', group: 'E', order: 10, date: new Date('2026-06-15T15:00:00Z') },
    { home: 'KSA', away: 'URU', group: 'F', order: 11, date: new Date('2026-06-15T18:00:00Z') },
    { home: 'IRN', away: 'NZL', group: 'F', order: 12, date: new Date('2026-06-16T12:00:00Z') },
    { home: 'FRA', away: 'SEN', group: 'G', order: 13, date: new Date('2026-06-16T15:00:00Z') },
    { home: 'ARG', away: 'DZA', group: 'G', order: 14, date: new Date('2026-06-17T12:00:00Z') },
    { home: 'AUT', away: 'JOR', group: 'H', order: 15, date: new Date('2026-06-17T15:00:00Z') },
    { home: 'ENG', away: 'HRV', group: 'H', order: 16, date: new Date('2026-06-17T18:00:00Z') },
    { home: 'GHA', away: 'PAN', group: 'I', order: 17, date: new Date('2026-06-17T21:00:00Z') },
    { home: 'UZB', away: 'COL', group: 'I', order: 18, date: new Date('2026-06-18T12:00:00Z') },
    { home: 'CAN', away: 'QAT', group: 'J', order: 19, date: new Date('2026-06-18T15:00:00Z') },
    { home: 'MEX', away: 'KOR', group: 'A', order: 20, date: new Date('2026-06-19T12:00:00Z') },
    { home: 'USA', away: 'AUS', group: 'A', order: 21, date: new Date('2026-06-19T15:00:00Z') },
    { home: 'SCO', away: 'MAR', group: 'C', order: 22, date: new Date('2026-06-19T18:00:00Z') },
    { home: 'BRA', away: 'HTI', group: 'B', order: 23, date: new Date('2026-06-20T12:00:00Z') },
    { home: 'GER', away: 'CIV', group: 'C', order: 24, date: new Date('2026-06-20T15:00:00Z') },
    { home: 'ECU', away: 'CUW', group: 'D', order: 25, date: new Date('2026-06-21T12:00:00Z') },
    { home: 'TUN', away: 'JPN', group: 'D', order: 26, date: new Date('2026-06-21T15:00:00Z') },
    { home: 'ESP', away: 'KSA', group: 'E', order: 27, date: new Date('2026-06-21T18:00:00Z') },
    { home: 'BEL', away: 'IRN', group: 'E', order: 28, date: new Date('2026-06-21T21:00:00Z') },
    { home: 'URU', away: 'CPV', group: 'F', order: 29, date: new Date('2026-06-21T21:00:00Z') },
    { home: 'NZL', away: 'EGY', group: 'F', order: 30, date: new Date('2026-06-22T12:00:00Z') },
    { home: 'ARG', away: 'AUT', group: 'G', order: 31, date: new Date('2026-06-22T15:00:00Z') },
    { home: 'NOR', away: 'SEN', group: 'G', order: 32, date: new Date('2026-06-23T12:00:00Z') },
    { home: 'JOR', away: 'DZA', group: 'H', order: 33, date: new Date('2026-06-23T15:00:00Z') },
    { home: 'POR', away: 'UZB', group: 'I', order: 34, date: new Date('2026-06-23T18:00:00Z') },
    { home: 'ENG', away: 'GHA', group: 'H', order: 35, date: new Date('2026-06-23T21:00:00Z') },
    { home: 'PAN', away: 'HRV', group: 'H', order: 36, date: new Date('2026-06-23T21:00:00Z') },
    { home: 'SUI', away: 'CAN', group: 'B', order: 37, date: new Date('2026-06-24T12:00:00Z') },
    { home: 'MAR', away: 'HTI', group: 'C', order: 38, date: new Date('2026-06-24T15:00:00Z') },
    { home: 'SCO', away: 'BRA', group: 'C', order: 39, date: new Date('2026-06-24T18:00:00Z') },
    { home: 'RSA', away: 'KOR', group: 'A', order: 40, date: new Date('2026-06-25T12:00:00Z') },
    { home: 'CUW', away: 'CIV', group: 'D', order: 41, date: new Date('2026-06-25T15:00:00Z') },
    { home: 'ECU', away: 'GER', group: 'D', order: 42, date: new Date('2026-06-25T18:00:00Z') },
    { home: 'TUN', away: 'NED', group: 'D', order: 43, date: new Date('2026-06-25T21:00:00Z') },
    { home: 'PRY', away: 'AUS', group: 'A', order: 44, date: new Date('2026-06-26T12:00:00Z') },
    { home: 'NOR', away: 'FRA', group: 'G', order: 45, date: new Date('2026-06-26T15:00:00Z') },
    { home: 'CPV', away: 'KSA', group: 'F', order: 46, date: new Date('2026-06-27T12:00:00Z') },
    { home: 'URU', away: 'ESP', group: 'F', order: 47, date: new Date('2026-06-27T15:00:00Z') },
    { home: 'EGY', away: 'IRN', group: 'F', order: 48, date: new Date('2026-06-27T18:00:00Z') },
    { home: 'NZL', away: 'BEL', group: 'F', order: 49, date: new Date('2026-06-27T21:00:00Z') },
    { home: 'HRV', away: 'GHA', group: 'H', order: 50, date: new Date('2026-06-27T21:00:00Z') },
    { home: 'PAN', away: 'ENG', group: 'H', order: 51, date: new Date('2026-06-27T21:00:00Z') },
    { home: 'COL', away: 'POR', group: 'I', order: 52, date: new Date('2026-06-27T21:00:00Z') },
    { home: 'DZA', away: 'AUT', group: 'G', order: 53, date: new Date('2026-06-28T12:00:00Z') },
    { home: 'JOR', away: 'ARG', group: 'H', order: 54, date: new Date('2026-06-28T15:00:00Z') },
  ];

  // Jogos da fase de grupos - Rodada 2 (r02)
  const r02Matches = [
    { home: 'RSA', away: 'USA', group: 'A', order: 55, date: new Date('2026-06-29T12:00:00Z') },
    { home: 'KOR', away: 'PRY', group: 'A', order: 56, date: new Date('2026-06-29T15:00:00Z') },
    { home: 'SUI', away: 'BRA', group: 'B', order: 57, date: new Date('2026-06-29T18:00:00Z') },
    { home: 'MAR', away: 'QAT', group: 'B', order: 58, date: new Date('2026-06-29T21:00:00Z') },
    { home: 'SCO', away: 'GER', group: 'C', order: 59, date: new Date('2026-06-30T12:00:00Z') },
    { home: 'HTI', away: 'CUW', group: 'C', order: 60, date: new Date('2026-06-30T15:00:00Z') },
    { home: 'JPN', away: 'CIV', group: 'D', order: 61, date: new Date('2026-06-30T18:00:00Z') },
    { home: 'NED', away: 'ECU', group: 'D', order: 62, date: new Date('2026-06-30T21:00:00Z') },
    { home: 'CPV', away: 'BEL', group: 'E', order: 63, date: new Date('2026-07-01T12:00:00Z') },
    { home: 'EGY', away: 'ESP', group: 'E', order: 64, date: new Date('2026-07-01T15:00:00Z') },
    { home: 'KSA', away: 'IRN', group: 'F', order: 65, date: new Date('2026-07-01T18:00:00Z') },
    { home: 'URU', away: 'NZL', group: 'F', order: 66, date: new Date('2026-07-01T21:00:00Z') },
    { home: 'SEN', away: 'ARG', group: 'G', order: 67, date: new Date('2026-07-02T12:00:00Z') },
    { home: 'FRA', away: 'DZA', group: 'G', order: 68, date: new Date('2026-07-02T15:00:00Z') },
    { home: 'JOR', away: 'ENG', group: 'H', order: 69, date: new Date('2026-07-02T18:00:00Z') },
    { home: 'HRV', away: 'AUT', group: 'H', order: 70, date: new Date('2026-07-02T21:00:00Z') },
    { home: 'PAN', away: 'COL', group: 'I', order: 71, date: new Date('2026-07-03T12:00:00Z') },
    { home: 'GHA', away: 'UZB', group: 'I', order: 72, date: new Date('2026-07-03T15:00:00Z') },
    { home: 'AUS', away: 'CAN', group: 'J', order: 73, date: new Date('2026-07-03T18:00:00Z') },
    { home: 'KOR', away: 'TUN', group: 'J', order: 74, date: new Date('2026-07-03T21:00:00Z') },
    { home: 'SWE', away: 'POL', group: 'K', order: 75, date: new Date('2026-07-04T12:00:00Z') },
    { home: 'NOR', away: 'POR', group: 'K', order: 76, date: new Date('2026-07-04T15:00:00Z') },
    { home: 'DNK', away: 'CZE', group: 'L', order: 77, date: new Date('2026-07-04T18:00:00Z') },
    { home: 'WAL', away: 'SRB', group: 'L', order: 78, date: new Date('2026-07-04T21:00:00Z') },
  ];

  // Jogos da fase de grupos - Rodada 3 (r03)
  const r03Matches = [
    { home: 'USA', away: 'RSA', group: 'A', order: 79, date: new Date('2026-06-25T12:00:00Z') },
    { home: 'PRY', away: 'KOR', group: 'A', order: 80, date: new Date('2026-06-25T15:00:00Z') },
    { home: 'BRA', away: 'QAT', group: 'B', order: 81, date: new Date('2026-06-18T15:00:00Z') },
    { home: 'MAR', away: 'SUI', group: 'B', order: 82, date: new Date('2026-06-24T12:00:00Z') },
    { home: 'GER', away: 'HTI', group: 'C', order: 83, date: new Date('2026-06-20T12:00:00Z') },
    { home: 'CUW', away: 'CIV', group: 'D', order: 84, date: new Date('2026-06-25T15:00:00Z') },
    { home: 'ECU', away: 'NED', group: 'D', order: 85, date: new Date('2026-06-25T18:00:00Z') },
    { home: 'JPN', away: 'TUN', group: 'D', order: 86, date: new Date('2026-06-25T21:00:00Z') },
    { home: 'AUS', away: 'PRY', group: 'A', order: 87, date: new Date('2026-06-26T12:00:00Z') },
    { home: 'FRA', away: 'NOR', group: 'G', order: 88, date: new Date('2026-06-26T15:00:00Z') },
    { home: 'CPV', away: 'URU', group: 'F', order: 89, date: new Date('2026-06-27T12:00:00Z') },
    { home: 'URU', away: 'ESP', group: 'F', order: 90, date: new Date('2026-06-27T15:00:00Z') },
    { home: 'IRN', away: 'EGY', group: 'F', order: 91, date: new Date('2026-06-27T18:00:00Z') },
    { home: 'BEL', away: 'NZL', group: 'F', order: 92, date: new Date('2026-06-27T21:00:00Z') },
    { home: 'GHA', away: 'HRV', group: 'H', order: 93, date: new Date('2026-06-27T21:00:00Z') },
    { home: 'ENG', away: 'PAN', group: 'H', order: 94, date: new Date('2026-06-27T21:00:00Z') },
    { home: 'POR', away: 'COL', group: 'I', order: 95, date: new Date('2026-06-27T21:00:00Z') },
    { home: 'AUT', away: 'DZA', group: 'G', order: 96, date: new Date('2026-06-28T12:00:00Z') },
    { home: 'ARG', away: 'JOR', group: 'H', order: 97, date: new Date('2026-06-28T15:00:00Z') },
    { home: 'ESP', away: 'BEL', group: 'E', order: 98, date: new Date('2026-07-01T15:00:00Z') },
    { home: 'EGY', away: 'CPV', group: 'E', order: 99, date: new Date('2026-07-01T12:00:00Z') },
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

  console.log(`📅 ${validMatches.length} jogos criados (fase de grupos - 3 rodadas)`);
  console.log(`ℹ️  Nota: Jogos das fases eliminatórias serão adicionados conforme os grupos avançarem`);

  console.log('✅ Seed concluído com sucesso!');
  console.log('🎮 Times: 48 seleções da Copa do Mundo 2026');
  console.log('⚽ Jogos: Fase de grupos com 3 rodadas');
  console.log('📊 Grupos: A-L (12 grupos com 4 times cada)');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
