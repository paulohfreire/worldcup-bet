#!/usr/bin/env tsx

/**
 * Orquestrador de Agentes - World Cup Betting Pool
 *
 * Este script coordena a execução dos agentes especializados para implementação
 * do projeto World Cup Betting Pool.
 *
 * Uso:
 *   npm run agent:start <agent> <task>
 *
 * Exemplos:
 *   npm run agent:start infra setup
 *   npm run agent:start backend auth
 *   npm run agent:start frontend navbar
 *   npm run agent:start test scoring
 *   npm run agent:start board create-issues
 *   npm run agent:start git create-pr
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

type AgentType = 'infra' | 'backend' | 'frontend' | 'test' | 'board' | 'git';

interface AgentConfig {
  name: string;
  description: string;
  responsibilities: string[];
  commands: Record<string, string>;
}

const AGENTS_DIR = join(process.cwd(), 'agents');

// Configuração dos agentes
const AGENT_CONFIGS: Record<AgentType, AgentConfig> = {
  infra: {
    name: 'Infrastructure Agent',
    description: 'Configuração de infraestrutura, setup inicial e ambiente',
    responsibilities: [
      'Inicializar projeto Next.js',
      'Instalar dependências',
      'Configurar Prisma',
      'Configurar CI/CD',
      'Criar estrutura de diretórios'
    ],
    commands: {
      setup: 'npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir',
      install: 'npm install @prisma/client bcryptjs jsonwebtoken jsPDF zod && npm install -D prisma @types/bcryptjs @types/jsonwebtoken',
      'prisma-init': 'npx prisma init',
      'db-push': 'npx prisma db push',
      generate: 'npx prisma generate'
    }
  },
  backend: {
    name: 'Backend Agent',
    description: 'Desenvolvimento de API, lógica de negócio e banco de dados',
    responsibilities: [
      'Criar schema Prisma',
      'Implementar endpoints de API',
      'Criar lógica de autenticação',
      'Implementar sistema de pontuação',
      'Criar seed script'
    ],
    commands: {
      'create-schema': 'echo "Criar schema em prisma/schema.prisma"',
      'db-seed': 'npx prisma db seed',
      test: 'npm test'
    }
  },
  frontend: {
    name: 'Frontend Agent',
    description: 'Desenvolvimento de componentes React e páginas Next.js',
    responsibilities: [
      'Criar componentes de layout',
      'Implementar páginas principais',
      'Criar componentes de jogos e palpites',
      'Implementar design responsivo'
    ],
    commands: {
      dev: 'npm run dev',
      build: 'npm run build',
      lint: 'npm run lint'
    }
  },
  test: {
    name: 'Test Agent',
    description: 'Criação e execução de testes automatizados',
    responsibilities: [
      'Criar testes unitários',
      'Criar testes de integração',
      'Criar testes E2E',
      'Configurar cobertura de código'
    ],
    commands: {
      test: 'npm test',
      'test:watch': 'npm run test:watch',
      'test:coverage': 'npm run test:coverage',
      'test:e2e': 'npm run test:e2e'
    }
  },
  board: {
    name: 'Board Agent',
    description: 'Gerenciamento de tarefas no GitHub Projects',
    responsibilities: [
      'Criar issues a partir do PLAN.md',
      'Organizar board por colunas',
      'Gerenciar status de tarefas',
      'Criar relatórios de progresso'
    ],
    commands: {
      'create-issues': 'node scripts/create-issues.js',
      'update-status': 'node scripts/update-board.js'
    }
  },
  git: {
    name: 'Git/PR Agent',
    description: 'Gestão de branches, commits e pull requests',
    responsibilities: [
      'Criar branches de feature',
      'Fazer commits convencionais',
      'Criar pull requests',
      'Mergear PRs aprovadas'
    ],
    commands: {
      'start-feature': 'bash scripts/start-feature.sh',
      'create-pr': 'bash scripts/create-pr.sh',
      'merge-pr': 'bash scripts/merge-pr.sh'
    }
  }
};

/**
 * Carrega as instruções de um agente
 */
function loadAgentInstructions(agentType: AgentType): string {
  const filePath = join(AGENTS_DIR, agentType, 'agent.md');

  if (!existsSync(filePath)) {
    throw new Error(`Arquivo de instruções não encontrado: ${filePath}`);
  }

  return readFileSync(filePath, 'utf-8');
}

/**
 * Exibe informações de um agente
 */
function showAgentInfo(agentType: AgentType): void {
  const config = AGENT_CONFIGS[agentType];

  console.log('\n' + '='.repeat(60));
  console.log(`🤖 ${config.name}`);
  console.log('='.repeat(60));
  console.log(`\n📝 Descrição: ${config.description}\n`);
  console.log('📋 Responsabilidades:');
  config.responsibilities.forEach((resp, index) => {
    console.log(`   ${index + 1}. ${resp}`);
  });
  console.log('\n🔧 Comandos disponíveis:');
  Object.keys(config.commands).forEach(cmd => {
    console.log(`   - ${cmd}: ${config.commands[cmd]}`);
  });
  console.log('\n📄 Instruções completas: ');
  console.log(`   ${join(AGENTS_DIR, agentType, 'agent.md')}`);
  console.log('='.repeat(60) + '\n');
}

/**
 * Exibe todos os agentes disponíveis
 */
function listAgents(): void {
  console.log('\n🤖 Agentes Disponíveis:\n');
  Object.entries(AGENT_CONFIGS).forEach(([type, config]) => {
    console.log(`  • ${type.padEnd(10)} - ${config.description}`);
  });
  console.log('\nUso: npm run agent:start <agente> <comando>\n');
}

/**
 * Executa uma tarefa de um agente
 */
function executeTask(agentType: AgentType, task: string): void {
  const config = AGENT_CONFIGS[agentType];

  console.log(`\n🚀 Executando tarefa "${task}" do ${config.name}...\n`);

  const command = config.commands[task];

  if (!command) {
    console.error(`❌ Comando "${task}" não encontrado para o agente ${agentType}`);
    console.log('\nComandos disponíveis:');
    Object.keys(config.commands).forEach(cmd => {
      console.log(`  - ${cmd}`);
    });
    process.exit(1);
  }

  console.log(`💻 Comando: ${command}`);
  console.log('\n⚠️  Este é um exemplo de orquestração.');
  console.log('   Em produção, você deve executar o comando manualmente');
  console.log('   ou integrar com uma ferramenta de execução de comandos.\n');

  // Aqui você pode integrar com child_process.exec() para executar comandos reais
  // import { exec } from 'child_process';
  // exec(command, (error, stdout, stderr) => { ... });
}

/**
 * Cria um relatório de execução
 */
function createExecutionReport(agentType: AgentType, task: string, status: 'success' | 'error', message: string): void {
  const report = {
    timestamp: new Date().toISOString(),
    agent: agentType,
    task,
    status,
    message
  };

  const reportPath = join(process.cwd(), '.agent-reports.json');
  let reports: any[] = [];

  if (existsSync(reportPath)) {
    reports = JSON.parse(readFileSync(reportPath, 'utf-8'));
  }

  reports.push(report);

  writeFileSync(reportPath, JSON.stringify(reports, null, 2));
  console.log(`\n📊 Relatório salvo em: ${reportPath}`);
}

/**
 * Função principal
 */
function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    listAgents();
    process.exit(0);
  }

  const [agentType, task] = args as [AgentType, string | undefined];

  if (!AGENT_CONFIGS[agentType]) {
    console.error(`❌ Agente desconhecido: ${agentType}`);
    listAgents();
    process.exit(1);
  }

  if (!task) {
    showAgentInfo(agentType);
    process.exit(0);
  }

  try {
    executeTask(agentType, task);
    createExecutionReport(agentType, task, 'success', 'Tarefa executada com sucesso');
    console.log('✅ Tarefa concluída!\n');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error(`\n❌ Erro ao executar tarefa: ${errorMessage}\n`);
    createExecutionReport(agentType, task, 'error', errorMessage);
    process.exit(1);
  }
}

// Executar
main();
