import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, shadows } from '../../styles/theme';
import { useTabBarPadding } from '../../hooks/useTabBarPadding';
import { authService, agendaService } from '../../services/api';

const BRAND = {
  primary: '#0d1b5e',
  indigo: '#3949ab',
  indigo2: '#5c6bc0',
  soft: '#eef2ff',
  soft2: '#f5f7ff',
  yellow: '#fde68a',
};

const STAT_CARDS = [
  {
    label: 'Concluidas',
    key: 'completed',
    icon: 'check-circle',
    color: '#dcfce7',
    textColor: '#166534',
  },
  {
    label: 'Pendentes',
    key: 'pending',
    icon: 'clock',
    color: '#dbeafe',
    textColor: '#1e40af',
  },
  {
    label: 'Total',
    key: 'total',
    icon: 'calendar',
    color: '#fee2e2',
    textColor: '#991b1b',
  },
  {
    label: 'Eficiencia',
    key: 'efficiency',
    icon: 'zap',
    color: '#ede9fe',
    textColor: '#5b21b6',
  },
];

const WEEK_DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];

function formatDate(date) {
  if (!date) return 'Sem data';
  return date.split('-').reverse().join('/');
}

function getWeeklyData(items) {
  const counts = WEEK_DAYS.map((day) => ({ day, value: 0 }));

  items.forEach((item) => {
    if (!item.dataAgenda) return;
    const date = new Date(`${item.dataAgenda}T00:00:00`);
    if (Number.isNaN(date.getTime())) return;
    const index = (date.getDay() + 6) % 7;
    counts[index].value += 1;
  });

  const max = Math.max(...counts.map((item) => item.value), 1);
  return counts.map((item) => ({
    ...item,
    percent: item.value === 0 ? 8 : Math.max(18, Math.round((item.value / max) * 100)),
  }));
}

export default function StatsScreen() {
  const tabBarPadding = useTabBarPadding();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    completed: 0,
    pending: 0,
    total: 0,
    efficiency: '0%',
    progress: 0,
    recent: [],
    weeklyData: getWeeklyData([]),
  });

  const loadStats = useCallback(async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        const data = await agendaService.findByUsuarioId(user.id);
        const total = data.length;
        const completed = data.filter((event) => event.statusAgenda === 'CONCLUIDO').length;
        const pending = total - completed;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

        setStats({
          total,
          completed,
          pending,
          progress,
          efficiency: `${progress}%`,
          recent: data.slice(-4).reverse(),
          weeklyData: getWeeklyData(data),
        });
      }
    } catch (error) {
      console.error('Erro ao carregar estatisticas:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

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
      bounces={false}
      overScrollMode="never"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.eyebrow}>Estatisticas</Text>
            <Text style={styles.heroTitle}>Visao geral</Text>
          </View>
          <View style={styles.heroIcon}>
            <Feather name="bar-chart-2" size={22} color={BRAND.primary} />
          </View>
        </View>

        <Text style={styles.heroCopy}>
          Acompanhe conclusoes, pendencias e o ritmo das tarefas da sua agenda.
        </Text>

        <View style={styles.heroProgressCard}>
          <View>
            <Text style={styles.progressCaption}>Conclusao total</Text>
            <Text style={styles.progressValue}>{stats.efficiency}</Text>
          </View>
          <View style={styles.progressRing}>
            <Feather name="trending-up" size={24} color={BRAND.primary} />
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${stats.progress}%` }]} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.statsGrid}>
          {STAT_CARDS.map((stat) => (
            <View key={stat.key} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                <Feather name={stat.icon} size={18} color={stat.textColor} />
              </View>
              <Text style={[styles.statValue, { color: stat.textColor }]}>
                {String(stats[stat.key])}
              </Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Distribuicao semanal</Text>
              <Text style={styles.cardSubtitle}>Tarefas agrupadas por dia da semana</Text>
            </View>
            <View style={styles.cardIcon}>
              <Feather name="activity" size={18} color={BRAND.indigo} />
            </View>
          </View>

          <View style={styles.bars}>
            {stats.weeklyData.map((item) => (
              <View key={item.day} style={styles.barWrapper}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${item.percent}%`,
                        backgroundColor: item.value > 0 ? BRAND.indigo : '#d8def8',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barValue}>{item.value}</Text>
                <Text style={styles.barLabel}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Atividade recente</Text>
              <Text style={styles.cardSubtitle}>Ultimas movimentacoes da agenda</Text>
            </View>
            <View style={styles.cardIcon}>
              <Feather name="clock" size={18} color={BRAND.indigo} />
            </View>
          </View>

          {stats.recent.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Feather name="inbox" size={22} color={BRAND.indigo2} />
              <Text style={styles.emptyText}>Nenhuma atividade recente</Text>
            </View>
          ) : (
            stats.recent.map((item, index) => {
              const done = item.statusAgenda === 'CONCLUIDO';
              return (
                <View
                  key={item.id || `${item.titulo}-${index}`}
                  style={[
                    styles.recentItem,
                    index === stats.recent.length - 1 && styles.recentItemLast,
                  ]}
                >
                  <View style={[styles.recentIcon, done ? styles.recentIconDone : styles.recentIconPending]}>
                    <Feather
                      name={done ? 'check' : 'calendar'}
                      size={16}
                      color={done ? '#166534' : BRAND.indigo}
                    />
                  </View>
                  <View style={styles.recentInfo}>
                    <Text
                      numberOfLines={1}
                      style={[styles.recentTitle, done && styles.recentDone]}
                    >
                      {item.titulo || 'Tarefa sem titulo'}
                    </Text>
                    <Text style={styles.recentDate}>{formatDate(item.dataAgenda)}</Text>
                  </View>
                  <View style={[styles.statusPill, done ? styles.statusDone : styles.statusPending]}>
                    <Text style={[styles.statusText, done ? styles.statusTextDone : styles.statusTextPending]}>
                      {done ? 'Feito' : 'Pendente'}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  loading: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  hero: {
    backgroundColor: BRAND.primary,
    paddingHorizontal: SPACING.lg,
    paddingTop: 58,
    paddingBottom: SPACING.lg,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.72)',
    fontWeight: '800',
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    color: COLORS.white,
  },
  heroIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCopy: {
    marginTop: 10,
    maxWidth: 320,
    fontSize: TYPOGRAPHY.small,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.82)',
  },
  heroProgressCard: {
    marginTop: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressCaption: {
    fontSize: TYPOGRAPHY.small,
    color: 'rgba(255,255,255,0.72)',
    fontWeight: '700',
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 44,
    lineHeight: 48,
    fontWeight: '800',
    color: COLORS.white,
  },
  progressRing: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: BRAND.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    height: 9,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 999,
    marginTop: SPACING.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: BRAND.indigo2,
    borderRadius: 999,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: SPACING.lg,
  },
  statCard: {
    width: '47%',
    minHeight: 132,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#e6e9f8',
    ...shadows.md,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
    fontWeight: '700',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: '#e6e9f8',
    ...shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: SPACING.lg,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.subtitle,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },
  cardIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: BRAND.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 146,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: 26,
    height: 94,
    backgroundColor: BRAND.soft2,
    borderRadius: 999,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e4e8fb',
  },
  barFill: {
    width: '100%',
    borderRadius: 999,
  },
  barValue: {
    fontSize: 11,
    color: BRAND.primary,
    fontWeight: '800',
    marginTop: 8,
  },
  barLabel: {
    fontSize: 11,
    color: COLORS.secondaryText,
    fontWeight: '700',
    marginTop: 3,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  recentItemLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  recentIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentIconDone: {
    backgroundColor: COLORS.low,
  },
  recentIconPending: {
    backgroundColor: BRAND.soft,
  },
  recentInfo: {
    flex: 1,
    minWidth: 0,
  },
  recentTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 3,
  },
  recentDone: {
    textDecorationLine: 'line-through',
    color: COLORS.secondaryText,
  },
  recentDate: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusDone: {
    backgroundColor: COLORS.low,
  },
  statusPending: {
    backgroundColor: BRAND.soft,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  statusTextDone: {
    color: '#166534',
  },
  statusTextPending: {
    color: BRAND.indigo,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BRAND.soft2,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.xl,
    borderWidth: 1,
    borderColor: '#e4e8fb',
  },
  emptyText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.secondaryText,
    fontWeight: '600',
  },
});
