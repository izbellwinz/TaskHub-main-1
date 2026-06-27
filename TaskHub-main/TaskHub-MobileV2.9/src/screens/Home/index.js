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
import { SPACING, TYPOGRAPHY } from '../../styles/theme';
import { ROUTES } from '../../constants/routes';

const BRAND = {
  midnight: '#0a1a33',
  accent: '#2f5fd8',
  lightPanel: '#eef2fa',
  text: '#0a1a33',
  secondary: '#5c6b89',
  line: 'rgba(10, 26, 51, 0.10)',
  lineStrong: 'rgba(10, 26, 51, 0.18)',
  white: '#ffffff',
  sky: '#8fb0f5',
};

const TODAY = new Date().toLocaleDateString('pt-BR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

const getLocalDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDateKey = (value) => {
  if (!value) return '';
  return String(value).slice(0, 10);
};

const normalizeAgenda = (item) => ({
  ...item,
  id: item.id,
  titulo: item.titulo || item.title || 'Tarefa sem titulo',
  dataAgenda: getDateKey(item.dataAgenda || item.date),
  hora: item.hora || item.time || '',
  descricao: item.descricao || item.description || '',
  cor: item.cor || item.color || BRAND.accent,
  statusAgenda: item.statusAgenda || item.status || 'ATIVO',
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
        <Feather name="check" size={14} color={BRAND.white} strokeWidth={3} />
      </View>
      <View style={styles.logoHandle} />
    </View>
  );
}

export default function DashboardScreen({ navigation }) {
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
          setEvents(data.map(normalizeAgenda));
        } catch (apiError) {
          console.warn('Erro ao carregar agendas do backend:', apiError?.message || apiError);
          setEvents([]);
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
    const today = getLocalDateKey();
    return events
      .filter((e) => (e.statusAgenda || '').toLowerCase() !== 'concluido')
      .filter((e) => e.dataAgenda === today)
      .sort((a, b) => (a.hora || '').localeCompare(b.hora || ''));
  };

  const getUpcomingEvents = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowKey = getLocalDateKey(tomorrow);

    return events
      .filter((e) => (e.statusAgenda || '').toLowerCase() !== 'concluido')
      .filter((e) => e.dataAgenda >= tomorrowKey)
      .sort((a, b) => {
        const dateCompare = a.dataAgenda.localeCompare(b.dataAgenda);
        if (dateCompare !== 0) return dateCompare;
        return (a.hora || '').localeCompare(b.hora || '');
      });
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
        <ActivityIndicator size="large" color={BRAND.accent} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      bounces={false}
      alwaysBounceVertical={false}
      automaticallyAdjustContentInsets={false}
      contentInsetAdjustmentBehavior="never"
      overScrollMode="never"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.brandRow}>
            <LogoMark />
            <Text style={styles.brandText}>TaskHub</Text>
          </View>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
            <Feather name="menu" size={22} color={BRAND.text} />
          </TouchableOpacity>
        </View>

        <Text style={styles.date}>{TODAY}</Text>
        <Text style={styles.greeting}>
          {getGreeting()}, <Text style={styles.name}>{user?.nome || 'Usuario'}</Text>
        </Text>
        <Text style={styles.heroCopy}>
          Organize reuniões, tarefas e compromissos em um só lugar, com a mesma clareza do TaskHub web.
        </Text>
        <View style={styles.heroMeta}>
          <View style={styles.avatarStack}>
            <Text style={styles.avatar}>JL</Text>
            <Text style={[styles.avatar, styles.avatarAlt]}>MS</Text>
            <Text style={[styles.avatar, styles.avatarMore]}>+</Text>
          </View>
          <Text style={styles.heroMetaText}>rotina organizada com foco no que importa</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.searchWrap}>
          <Feather name="search" size={18} color={BRAND.accent} />
          <TextInput
            placeholder="Buscar tarefas..."
            placeholderTextColor={BRAND.secondary}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statMini}>
            <Feather name="calendar" size={18} color={BRAND.accent} />
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
              <Feather name="award" size={28} color={BRAND.midnight} />
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${stats.progress}%` }]} />
          </View>
          <Text style={styles.progressSub}>{stats.completed} tarefas concluidas no total</Text>
          <View style={styles.agendaPreview}>
            <View style={styles.agendaItem}>
              <View style={styles.agendaBar} />
              <Text style={styles.agendaTime}>Hoje</Text>
              <Text style={styles.agendaText}>{todayEvents.length || 'Sem'} tarefa(s)</Text>
            </View>
            <View style={styles.agendaItem}>
              <View style={[styles.agendaBar, styles.agendaBarAlt]} />
              <Text style={styles.agendaTime}>Depois</Text>
              <Text style={styles.agendaText}>{upcomingEvents.length || 'Sem'} compromisso(s)</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleWrap}>
              <View style={styles.sectionIcon}>
                <Feather name="zap" size={16} color={BRAND.accent} />
              </View>
              <Text style={styles.sectionTitle}>Importante hoje</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate(ROUTES.CALENDAR)}>
              <Text style={styles.seeAll}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          {todayEvents.length === 0 ? (
            <View style={styles.emptyCard}>
              <Feather name="check-circle" size={22} color={BRAND.accent} />
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

        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleWrap}>
              <View style={styles.sectionIcon}>
                <Feather name="clock" size={16} color={BRAND.accent} />
              </View>
              <Text style={styles.sectionTitle}>Em breve</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate(ROUTES.CALENDAR)}>
              <Text style={styles.seeAll}>Ver agenda</Text>
            </TouchableOpacity>
          </View>
          {upcomingEvents.length === 0 ? (
            <View style={styles.emptyCard}>
              <Feather name="calendar" size={22} color={BRAND.accent} />
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
  container: { flex: 1, backgroundColor: BRAND.white },
  scrollContent: { paddingBottom: 0 },
  loading: { flex: 1, backgroundColor: BRAND.white },
  center: { justifyContent: 'center', alignItems: 'center' },
  hero: {
    backgroundColor: BRAND.white,
    paddingTop: 54,
    paddingHorizontal: SPACING.lg,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.line,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 42,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandText: {
    color: BRAND.text,
    fontSize: 22,
    fontWeight: '600',
  },
  logoMark: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: BRAND.accent,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logoCalendar: {
    width: 22,
    height: 22,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BRAND.white,
    backgroundColor: 'transparent',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  logoTop: { height: 7, backgroundColor: BRAND.white },
  logoBody: { flex: 1, padding: 3, gap: 2 },
  logoGridRow: { flexDirection: 'row', gap: 3 },
  logoCell: {
    width: 5,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  logoCellStrong: { backgroundColor: BRAND.white },
  logoSearch: {
    position: 'absolute',
    right: 3,
    bottom: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: BRAND.white,
    backgroundColor: BRAND.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoHandle: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 7,
    height: 3,
    borderRadius: 2,
    backgroundColor: BRAND.white,
    transform: [{ rotate: '45deg' }],
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: BRAND.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BRAND.lineStrong,
  },
  date: {
    fontSize: 12,
    color: BRAND.accent,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 14,
  },
  greeting: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '500',
    color: BRAND.text,
  },
  name: { fontWeight: '500', color: BRAND.accent },
  heroCopy: {
    marginTop: 18,
    maxWidth: 330,
    fontSize: 16,
    lineHeight: 26,
    color: BRAND.secondary,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
  },
  avatarStack: {
    flexDirection: 'row',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: BRAND.white,
    marginLeft: -8,
    backgroundColor: BRAND.accent,
    color: BRAND.white,
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 24,
  },
  avatarAlt: {
    backgroundColor: BRAND.sky,
    color: BRAND.midnight,
  },
  avatarMore: {
    backgroundColor: BRAND.lightPanel,
    color: BRAND.midnight,
  },
  heroMetaText: {
    flex: 1,
    fontSize: 13,
    color: BRAND.secondary,
  },
  content: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: BRAND.white,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: BRAND.lineStrong,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 13,
    fontSize: TYPOGRAPHY.body,
    color: BRAND.text,
  },
  statsRow: { flexDirection: 'row', gap: 1, marginBottom: SPACING.lg },
  statMini: {
    flex: 1,
    backgroundColor: BRAND.white,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: BRAND.line,
  },
  statValue: { marginTop: 10, fontSize: 28, fontWeight: '600', color: BRAND.text },
  statLabel: { fontSize: TYPOGRAPHY.small, color: BRAND.secondary, fontWeight: '600' },
  progressCard: {
    backgroundColor: BRAND.midnight,
    borderRadius: 20,
    padding: 28,
    marginBottom: 44,
    shadowColor: BRAND.midnight,
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 6,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  progressLabel: {
    fontSize: TYPOGRAPHY.small,
    color: '#9fb3d9',
    marginBottom: 4,
    fontWeight: '600',
  },
  progressValue: { fontSize: 42, fontWeight: '600', color: BRAND.white },
  progressIcon: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: BRAND.white,
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
  progressFill: { height: '100%', backgroundColor: BRAND.accent, borderRadius: 999 },
  progressSub: { fontSize: TYPOGRAPHY.small, color: '#9fb3d9' },
  agendaPreview: {
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
    gap: 10,
  },
  agendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  agendaBar: {
    width: 3,
    height: 22,
    borderRadius: 2,
    backgroundColor: BRAND.accent,
  },
  agendaBarAlt: {
    backgroundColor: BRAND.sky,
  },
  agendaTime: {
    width: 52,
    color: '#9fb3d9',
    fontSize: 12,
    fontWeight: '600',
  },
  agendaText: {
    flex: 1,
    color: BRAND.white,
    fontSize: 13,
  },
  section: { marginBottom: 44 },
  lastSection: { marginBottom: SPACING.sm },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: BRAND.lightPanel,
    borderWidth: 1,
    borderColor: BRAND.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { fontSize: TYPOGRAPHY.subtitle, fontWeight: '600', color: BRAND.text },
  seeAll: { fontSize: TYPOGRAPHY.small, color: BRAND.accent, fontWeight: '600' },
  emptyCard: {
    backgroundColor: BRAND.white,
    borderRadius: 12,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: BRAND.line,
  },
  empty: { fontSize: TYPOGRAPHY.body, color: BRAND.secondary, fontWeight: '500' },
});
