const roadmapGroups = [
  {
    title: 'Núcleo da plataforma',
    subtitle: 'Base acadêmica e acesso',
    items: [
      ['Autenticação JWT', 'done'],
      ['RBAC por perfil', 'done'],
      ['Alunos', 'done'],
      ['Responsáveis', 'done'],
      ['Professores', 'done'],
      ['Funcionários', 'done'],
      ['Vínculo aluno-responsável', 'done'],
      ['Turmas acadêmicas', 'done']
    ]
  },
  {
    title: 'Operação acadêmica',
    subtitle: 'Rotinas do cliente-piloto',
    items: [
      ['Matrículas', 'done'],
      ['Horários', 'done'],
      ['Contratos', 'done'],
      ['Geração de PDF', 'done'],
      ['Agenda acadêmica', 'done'],
      ['Dashboards por perfil', 'done'],
      ['Quadro de avisos', 'done'],
      ['Presença e chamada', 'done']
    ]
  },
  {
    title: 'Homologação e qualidade',
    subtitle: 'Preparação da versão piloto',
    items: [
      ['Release piloto v0.1 para HML', 'progress'],
      ['Testes ponta a ponta dos fluxos críticos', 'progress'],
      ['Revisão de segurança para produção', 'progress'],
      ['Padronização de banco, migrations e seeds', 'progress'],
      ['CI/CD e estratégia de rollback', 'planned']
    ]
  },
  {
    title: 'Próximos módulos',
    subtitle: 'Expansão funcional',
    items: [
      ['Financeiro', 'planned'],
      ['Notas e avaliações', 'planned'],
      ['Notificações', 'planned'],
      ['Relatórios gerenciais', 'planned'],
      ['Auditoria funcional', 'planned']
    ]
  }
];

const saasPillars = [
  {
    title: 'Multi-tenancy',
    description: 'Identificação do tenant e isolamento completo dos dados por instituição.',
    items: [['Modelo de tenant', 'planned'], ['Isolamento no banco', 'planned'], ['Tenant middleware', 'planned']]
  },
  {
    title: 'Onboarding',
    description: 'Criação e ativação previsível de uma nova instituição sem intervenção manual no código.',
    items: [['Cadastro da instituição', 'planned'], ['Usuário gestor inicial', 'planned'], ['Checklist de ativação', 'planned']]
  },
  {
    title: 'Personalização',
    description: 'Marca e parâmetros configuráveis para cada curso sem criar forks da aplicação.',
    items: [['Logo e cores', 'planned'], ['Dados institucionais', 'planned'], ['Configurações por tenant', 'planned']]
  },
  {
    title: 'Planos e cobrança',
    description: 'Base comercial do SaaS com plano, assinatura, situação contratual e limites de uso.',
    items: [['Planos SaaS', 'planned'], ['Assinaturas', 'planned'], ['Billing', 'planned']]
  },
  {
    title: 'Infraestrutura',
    description: 'Ambientes separados, deploy repetível, backup, monitoramento e recuperação.',
    items: [['DEV', 'done'], ['HML', 'progress'], ['PROD', 'planned'], ['Backup automatizado', 'planned'], ['Monitoramento', 'planned']]
  },
  {
    title: 'Segurança e governança',
    description: 'Controles necessários para proteger clientes, dados pessoais e a operação do serviço.',
    items: [['RBAC', 'done'], ['Gestão de segredos', 'progress'], ['Logs de auditoria', 'planned'], ['Hardening de produção', 'progress']]
  }
];

const phases = [
  ['01', 'Fundação do sistema', 'Autenticação, perfis, cadastros e estrutura principal.', 'done'],
  ['02', 'Gestão acadêmica', 'Matrículas, turmas, contratos, agenda, avisos e presença.', 'done'],
  ['03', 'Homologação do piloto', 'Estabilização, testes e preparação da versão v0.1 em HML.', 'progress'],
  ['04', 'Arquitetura SaaS', 'Multi-tenancy, configuração por instituição e onboarding.', 'planned'],
  ['05', 'Expansão comercial', 'Financeiro, notas, planos, billing, relatórios e operação PROD.', 'planned']
];

const labels = { done: 'Implementado', progress: 'Em andamento', planned: 'Planejado' };

function flattenRoadmap() {
  return roadmapGroups.flatMap(group => group.items);
}

function renderStats() {
  const items = flattenRoadmap();
  const counts = items.reduce((acc, [, status]) => {
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    ['Total mapeado', items.length, 'total'],
    ['Implementado', counts.done || 0, 'done'],
    ['Em andamento', counts.progress || 0, 'progress'],
    ['Planejado', counts.planned || 0, 'planned']
  ];

  document.querySelector('#stats').innerHTML = stats.map(([label, value, className]) => `
    <article class="stat-card ${className}">
      <strong class="stat-value">${value}</strong>
      <span class="stat-label">${label}</span>
    </article>
  `).join('');
}

function renderRoadmap() {
  document.querySelector('#roadmapGrid').innerHTML = roadmapGroups.map(group => `
    <article class="roadmap-card">
      <div class="card-head">
        <div>
          <h3>${group.title}</h3>
          <div class="card-subtitle">${group.subtitle}</div>
        </div>
      </div>
      <ul class="checklist">
        ${group.items.map(([name, status]) => `
          <li>
            <span class="dot ${status}" aria-hidden="true"></span>
            <span>${name}</span>
            <span class="status-pill status-${status}" style="margin-left:auto">${labels[status]}</span>
          </li>
        `).join('')}
      </ul>
    </article>
  `).join('');
}

function score(items) {
  if (!items.length) return 0;
  const total = items.reduce((sum, [, status]) => sum + (status === 'done' ? 1 : status === 'progress' ? .5 : 0), 0);
  return Math.round((total / items.length) * 100);
}

function renderSaas() {
  document.querySelector('#saasGrid').innerHTML = saasPillars.map(pillar => {
    const progress = score(pillar.items);
    return `
      <article class="saas-card">
        <h3>${pillar.title}</h3>
        <p>${pillar.description}</p>
        <div class="progress-track" aria-label="${progress}% concluído"><span style="width:${progress}%"></span></div>
        <div class="progress-meta"><span>Readiness</span><strong>${progress}%</strong></div>
      </article>
    `;
  }).join('');
}

function renderPhases() {
  document.querySelector('#phases').innerHTML = phases.map(([index, title, description, status]) => `
    <article class="phase-card">
      <span class="phase-index">FASE ${index}</span>
      <div>
        <h3>${title}</h3>
        <p>${description}</p>
      </div>
      <span class="status-pill status-${status} phase-status">${labels[status]}</span>
    </article>
  `).join('');
}

renderStats();
renderRoadmap();
renderSaas();
renderPhases();
