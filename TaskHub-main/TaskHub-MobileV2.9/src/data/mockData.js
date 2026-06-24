export const MOCK_USER = {
  name: 'Victor',
  email: 'victor@email.com',
  initials: 'V',
  plan: 'Pro',
};

export const MOCK_TASKS = [
  { id: '1', emoji: '📚', title: 'Finish TCC prototype', category: 'Frontend', due: 'Hoje 18:00', priority: 'high', done: false },
  { id: '2', emoji: '💻', title: 'Review React Native screens', category: 'Mobile', due: 'Amanhã', priority: 'medium', done: false },
  { id: '3', emoji: '📝', title: 'Prepare presentation', category: 'Geral', due: 'Sexta 20:00', priority: 'low', done: true },
  { id: '4', emoji: '🎨', title: 'Design new components', category: 'UI', due: 'Próxima semana', priority: 'medium', done: false },
  { id: '5', emoji: '🔧', title: 'Fix navigation bug', category: 'Mobile', due: 'Hoje', priority: 'high', done: false },
  { id: '6', emoji: '📊', title: 'Update stats screen', category: 'Frontend', due: 'Quinta', priority: 'low', done: true },
];

export const MOCK_EVENTS = [
  { id: '1', date: '2025-07-10', title: 'Reunião TCC', category: 'Estudo', color: '#2D5BE3' },
  { id: '2', date: '2025-07-10', title: 'Design review', category: 'Trabalho', color: '#7C3AED' },
  { id: '3', date: '2025-07-15', title: 'Entrega frontend', category: 'Trabalho', color: '#DC2626' },
  { id: '4', date: '2025-07-22', title: 'Apresentação final', category: 'Estudo', color: '#059669' },
  { id: '5', date: '2025-07-28', title: 'Sprint planning', category: 'Trabalho', color: '#D97706' },
];

export const MOCK_STATS = {
  weeklyProgress: 78,
  completedTotal: 48,
  completedThisWeek: 12,
  pending: 4,
  overdue: 2,
  streak: 7,
  weeklyData: [
    { day: 'Seg', value: 80 },
    { day: 'Ter', value: 60 },
    { day: 'Qua', value: 90 },
    { day: 'Qui', value: 45 },
    { day: 'Sex', value: 70 },
    { day: 'Sáb', value: 30 },
    { day: 'Dom', value: 78 },
  ],
};
