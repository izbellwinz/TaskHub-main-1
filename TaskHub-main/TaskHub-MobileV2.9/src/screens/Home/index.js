import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { authService, agendaService } from '../../services/api';
import TaskCard from '../../components/TaskCard';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, shadows } from '../../styles/theme';
import { ROUTES } from '../../constants/routes';
import { useTabBarPadding } from '../../hooks/useTabBarPadding';

const BRAND = {
  primary: '#0d1b5e',
  primary2: '#1a237e',
  indigo: '#3949ab',
  indigo2: '#5c6bc0',
  soft: '#eef2ff',
  yellow: '#fde68a',
};

const TODAY = new Date().toLocaleDateString('pt-BR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function LogoMark() {
  return (
    <View style={styles.logoMark}>
      <View style={styles.logoCalendar}>
        <View style={styles.logoTop} />
        <View style={styles.logoBody}>
          <View style={styles.logoGridRow}>
            <View style={[styles.logoCell, styles.logoCellStrong]} />
            <View style={styles.logoCell} />
          </View>
          <View style={styles.logoGridRow}>
            <View style={styles.logoCell} />
            <View style={[styles.logoCell, styles.logoCellStrong]} />
          </View>
        </View>
      </View>
      <View style={styles.logoSearch}>
        <Feather name="check" size={14} color={BRAND.primary} strokeWidth={3} />
      </View>
      <View style={styles.logoHandle} />
    </View>
  );
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
          import('../../data/mockData').then((m) => {
            const mapped = m.MOCK_EVENTS.map((e) => ({
              id: e.id,
              titulo: e.title,
              dataAgenda: e.date,
              hora: '12:00',
              cor: e.color,
              descricao: 'Exemplo de tarefa (Modo Dev)',
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
    return events.filter((e) => e.dataAgenda === today);
  };

  const getUpcomingEvents = () => {
    const today = new Date().toISOString().split('T')[0];
    return events
      .filter((e) => e.dataAgenda > today)
      .sort((a, b) => a.dataAgenda.localeCompare(b.dataAgenda));
  };

  const getStats = () => {
    const total = events.length;
    const completed = events.filter((e) => e.statusAgenda === 'CONCLUIDO').length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, progress, completed };
  };

  const stats = getStats();
  const todayEvents = getTodayEvents();
  const upcomingEvents = getUpcomingEvents();

  if (loading) {
    return (
      <View style={[styles.loading, styles.center]}>
        <ActivityIndicator size="large" color={BRAND.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: tabBarPadding }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.brandRow}>
            <LogoMark />
            <Text style={styles.brandText}>TaskHub</Text>
          </View>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
            <Feather name="menu" size={22} color={BRAND.primary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.date}>{TODAY}</Text>
        <Text style={styles.greeting}>
          {getGreeting()}, <Text style={styles.name}>{user?.nome || 'Usuario'}</Text>
        </Text>
        <Text style={styles.heroCopy}>Organize sua rotina com a mesma clareza do TaskHub web.</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.searchWrap}>
          <Feather name="search" size={18} color={BRAND.indigo} />
          <TextInput
            placeholder="Buscar tarefas..."
            placeholderTextColor={COLORS.secondaryText}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statMini}>
            <Feather name="calendar" size={18} color={BRAND.indigo} />
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Eventos</Text>
          </View>
          <View style={styles.statMini}>
            <Feather name="check-circle" size={18} color="#10b981" />
            <Text style={styles.statValue}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Feitos</Text>
          </View>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressLabel}>Progresso das tarefas</Text>
              <Text style={styles.progressValue}>{stats.progress}%</Text>
            </View>
            <View style={styles.progressIcon}>
              <Feather name="award" size={28} color={BRAND.primary} />
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${stats.progress}%` }]} />
          </View>
          <Text style={styles.progressSub}>{stats.completed} tarefas concluidas no total</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleWrap}>
              <View style={styles.sectionIcon}>
                <Feather name="zap" size={16} color={BRAND.indigo} />
              </View>
              <Text style={styles.sectionTitle}>Importante hoje</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate(ROUTES.TASKS)}>
              <Text style={styles.seeAll}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          {todayEvents.length === 0 ? (
            <View style={styles.emptyCard}>
              <Feather name="check-circle" size={22} color={BRAND.indigo2} />
              <Text style={styles.empty}>Nenhuma atividade para hoje</Text>
            </View>
          ) : (
            todayEvents.map((t) => (
              <TaskCard
                key={t.id}
                iconName="calendar"
                title={t.titulo}
                subtitle={`${t.hora} - ${t.descricao || 'Sem descricao'}`}
                priority="high"
                color={t.cor}
              />
            ))
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleWrap}>
              <View style={styles.sectionIcon}>
                <Feather name="clock" size={16} color={BRAND.indigo} />
              </View>
              <Text style={styles.sectionTitle}>Em breve</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate(ROUTES.CALENDAR)}>
              <Text style={styles.seeAll}>Ver agenda</Text>
            </TouchableOpacity>
          </View>
          {upcomingEvents.length === 0 ? (
            <View style={styles.emptyCard}>
              <Feather name="calendar" size={22} color={BRAND.indigo2} />
              <Text style={styles.empty}>Sem atividades futuras</Text>
            </View>
          ) : (
            upcomingEvents.slice(0, 3).map((t) => (
              <TaskCard
                key={t.id}
                iconName="calendar"
                title={t.titulo}
                subtitle={`${t.dataAgenda.split('-').reverse().join('/')} - ${t.hora}`}
                priority="medium"
                color={t.cor}
              />
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  loading: { flex: 1, backgroundColor: '#f0f2f5' },
  center: { justifyContent: 'center', alignItems: 'center' },
  hero: {
    backgroundColor: BRAND.primary,
    paddingTop: 58,
    paddingHorizontal: SPACING.lg,
    paddingBottom: 34,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandText: { color: COLORS.white, fontSize: 22, fontWeight: '800' },
  logoMark: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logoCalendar: {
    width: 27,
    height: 28,
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: BRAND.primary2,
    backgroundColor: COLORS.white,
    transform: [{ translateX: -3 }, { translateY: -2 }],
  },
  logoTop: { height: 9, backgroundColor: BRAND.primary },
  logoBody: { flex: 1, padding: 3, gap: 3 },
  logoGridRow: { flexDirection: 'row', gap: 3 },
  logoCell: {
    width: 7,
    height: 6,
    borderRadius: 2,
    backgroundColor: 'rgba(13,27,94,0.45)',
  },
  logoCellStrong: { backgroundColor: BRAND.indigo },
  logoSearch: {
    position: 'absolute',
    right: 3,
    bottom: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: BRAND.primary,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoHandle: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 8,
    height: 3,
    borderRadius: 2,
    backgroundColor: BRAND.primary,
    transform: [{ rotate: '45deg' }],
  },
  menuButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  date: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.74)',
    fontWeight: '600',
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  greeting: { fontSize: 28, lineHeight: 34, fontWeight: '700', color: COLORS.white },
  name: { fontWeight: '800', color: COLORS.white },
  heroCopy: {
    marginTop: 10,
    maxWidth: 300,
    fontSize: TYPOGRAPHY.small,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.82)',
  },
  content: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#d8def8',
    ...shadows.md,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
  },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: SPACING.md },
  statMini: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#e6e9f8',
    ...shadows.md,
  },
  statValue: { marginTop: 8, fontSize: 24, fontWeight: '800', color: BRAND.primary },
  statLabel: { fontSize: TYPOGRAPHY.small, color: COLORS.secondaryText, fontWeight: '600' },
  progressCard: {
    backgroundColor: BRAND.primary,
    borderRadius: 24,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    ...shadows.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  progressLabel: {
    fontSize: TYPOGRAPHY.small,
    color: 'rgba(255,255,255,0.72)',
    marginBottom: 4,
    fontWeight: '600',
  },
  progressValue: { fontSize: 38, fontWeight: '800', color: COLORS.white },
  progressIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: BRAND.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 999,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: BRAND.indigo2, borderRadius: 999 },
  progressSub: { fontSize: TYPOGRAPHY.small, color: 'rgba(255,255,255,0.7)' },
  section: { marginBottom: SPACING.xl },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: BRAND.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { fontSize: TYPOGRAPHY.subtitle, fontWeight: '800', color: BRAND.primary },
  seeAll: { fontSize: TYPOGRAPHY.small, color: BRAND.indigo, fontWeight: '700' },
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#e6e9f8',
  },
  empty: { fontSize: TYPOGRAPHY.body, color: COLORS.secondaryText, fontWeight: '600' },
});
