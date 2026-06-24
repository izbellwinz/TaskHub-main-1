import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TextInput, TouchableOpacity, ActivityIndicator, RefreshControl
} from 'react-native';
import { authService, agendaService } from '../../services/api';
import TaskCard from '../../components/TaskCard';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, shadows } from '../../styles/theme';
import { ROUTES } from '../../constants/routes';
import { useTabBarPadding } from '../../hooks/useTabBarPadding';

const TODAY = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default function DashboardScreen({ navigation }) {
  const tabBarPadding = useTabBarPadding();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        try {
          const data = await agendaService.findByUsuarioId(currentUser.id);
          setEvents(data);
        } catch (apiError) {
          console.warn('API Offline, usando dados de exemplo (MOCK)');
          import('../../data/mockData').then(m => {
            const mapped = m.MOCK_EVENTS.map(e => ({
              id: e.id,
              titulo: e.title,
              dataAgenda: e.date,
              hora: '12:00',
              cor: e.color,
              descricao: 'Exemplo de tarefa (Modo Dev)'
            }));
            setEvents(mapped);
          });
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const getTodayEvents = () => {
    const today = new Date().toISOString().split('T')[0];
    return events.filter(e => e.dataAgenda === today);
  };

  const getUpcomingEvents = () => {
    const today = new Date().toISOString().split('T')[0];
    return events.filter(e => e.dataAgenda > today).sort((a, b) => a.dataAgenda.localeCompare(b.dataAgenda));
  };

  const getStats = () => {
    const total = events.length;
    const completed = events.filter(e => e.statusAgenda === 'CONCLUIDO').length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { progress, completed };
  };

  const stats = getStats();

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={{ paddingBottom: tabBarPadding }} 
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.date}>{TODAY}</Text>
          <Text style={styles.greeting}>{getGreeting()}, <Text style={styles.name}>{user?.nome || 'Usuário'} 👋</Text></Text>
        </View>
        <TouchableOpacity style={styles.avatarBtn} onPress={() => navigation.openDrawer()}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.nome?.substring(0, 2).toUpperCase() || 'TH'}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          placeholder="Buscar tarefas..."
          placeholderTextColor={COLORS.secondaryText}
          style={styles.searchInput}
        />
      </View>

      {/* Progress card */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <View>
            <Text style={styles.progressLabel}>Progresso das Tarefas</Text>
            <Text style={styles.progressValue}>{stats.progress}%</Text>
          </View>
          <Text style={styles.progressEmoji}>🏆</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${stats.progress}%` }]} />
        </View>
        <Text style={styles.progressSub}>{stats.completed} tarefas concluídas no total</Text>
      </View>

      {/* Important Today */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🔥 Importante hoje</Text>
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.TASKS)}>
            <Text style={styles.seeAll}>Ver todas →</Text>
          </TouchableOpacity>
        </View>
        {getTodayEvents().length === 0
          ? <Text style={styles.empty}>Nenhuma atividade para hoje 🎉</Text>
          : getTodayEvents().map(t => (
            <TaskCard 
              key={t.id} 
              emoji="📅" 
              title={t.titulo} 
              subtitle={`${t.hora} • ${t.descricao || 'Sem descrição'}`} 
              priority="high"
              color={t.cor}
            />
          ))
        }
      </View>

      {/* Upcoming */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>⏰ Em breve</Text>
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.CALENDAR)}>
            <Text style={styles.seeAll}>Ver todas →</Text>
          </TouchableOpacity>
        </View>
        {getUpcomingEvents().length === 0 
          ? <Text style={styles.empty}>Sem atividades futuras</Text>
          : getUpcomingEvents().slice(0, 3).map(t => (
            <TaskCard 
              key={t.id} 
              emoji="📅" 
              title={t.titulo} 
              subtitle={`${t.dataAgenda.split('-').reverse().join('/')} • ${t.hora}`} 
              priority="medium"
              color={t.cor}
            />
          ))
        }
      </View>

      {/* Quick actions */}
      <View style={styles.quickActions}>
        {[
          { icon: '📋', label: 'Tasks', route: ROUTES.TASKS },
          { icon: '📅', label: 'Calendar', route: ROUTES.CALENDAR },
          { icon: '📊', label: 'Stats', route: ROUTES.STATS },
        ].map(a => (
          <TouchableOpacity key={a.route} style={styles.quickBtn} onPress={() => navigation.navigate(a.route)}>
            <Text style={styles.quickIcon}>{a.icon}</Text>
            <Text style={styles.quickLabel}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 60,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  headerLeft: { flex: 1 },
  date: {
    fontSize: 12,
    color: COLORS.secondaryText,
    fontWeight: '500',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
  },
  name: {
    fontWeight: '800',
    color: COLORS.primary,
  },
  avatarBtn: { marginLeft: SPACING.md },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 18,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    ...shadows.md,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
  },
  progressCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  progressLabel: {
    fontSize: TYPOGRAPHY.small,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.white,
  },
  progressEmoji: { fontSize: 32 },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 3,
  },
  progressSub: {
    fontSize: TYPOGRAPHY.small,
    color: 'rgba(255,255,255,0.6)',
  },
  section: { marginBottom: SPACING.xl },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.subtitle,
    fontWeight: '700',
    color: COLORS.text,
  },
  seeAll: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.accent,
    fontWeight: '600',
  },
  empty: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.secondaryText,
    paddingVertical: SPACING.sm,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: SPACING.md,
  },
  quickBtn: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    gap: 6,
    ...shadows.md,
  },
  quickIcon: { fontSize: 24 },
  quickLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
});
