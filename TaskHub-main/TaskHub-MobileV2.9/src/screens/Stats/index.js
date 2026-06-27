import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../../styles/theme';
import { useTabBarPadding } from '../../hooks/useTabBarPadding';
import { authService, agendaService } from '../../services/api';

const BRAND = {
  midnight: '#0a1a33',
  accent: '#2f5fd8',
  lightPanel: '#eef2fa',
  panel: '#ffffff',
  text: '#0a1a33',
  secondary: '#5c6b89',
  line: 'rgba(10, 26, 51, 0.10)',
  lineStrong: 'rgba(10, 26, 51, 0.18)',
  successTint: '#effaf4',
  success: '#166534',
};

const STAT_CARDS = [
  {
    label: 'Concluidas',
    key: 'completed',
    icon: 'check-circle',
    color: '#effaf4',
    textColor: '#166534',
  },
  {
    label: 'Pendentes',
    key: 'pending',
    icon: 'clock',
    color: '#e8effd',
    textColor: '#2f5fd8',
  },
  {
    label: 'Total',
    key: 'total',
    icon: 'calendar',
    color: '#f8fafc',
    textColor: '#0a1a33',
  },
  {
    label: 'Eficiencia',
    key: 'efficiency',
    icon: 'zap',
    color: '#fff8eb',
    textColor: '#8a5a00',
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
        <ActivityIndicator size="large" color={BRAND.accent} />
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
            <Text style={styles.eyebrow}>TaskHub</Text>
            <Text style={styles.heroTitle}>Estatisticas</Text>
          </View>
          <TouchableOpacity onPress={onRefresh} style={styles.heroIcon} activeOpacity={0.82}>
            <Feather name="refresh-cw" size={18} color={BRAND.text} />
          </TouchableOpacity>
        </View>

        <Text style={styles.heroCopy}>
          Um resumo direto do ritmo das tarefas, alinhado ao painel web.
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.heroProgressCard}>
          <View>
            <Text style={styles.progressCaption}>Conclusao total</Text>
            <Text style={styles.progressValue}>{stats.efficiency}</Text>
          </View>
          <View style={styles.progressRing}>
            <Feather name="trending-up" size={24} color={BRAND.midnight} />
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${stats.progress}%` }]} />
        </View>

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
              <Feather name="activity" size={18} color={BRAND.accent} />
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
                        backgroundColor: item.value > 0 ? BRAND.accent : '#d8def8',
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
              <Feather name="clock" size={18} color={BRAND.accent} />
            </View>
          </View>

          {stats.recent.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Feather name="inbox" size={22} color={BRAND.accent} />
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
                      color={done ? BRAND.success : BRAND.accent}
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
    backgroundColor: BRAND.lightPanel,
  },
  loading: {
    flex: 1,
    backgroundColor: BRAND.lightPanel,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  hero: {
    backgroundColor: BRAND.panel,
    paddingHorizontal: SPACING.lg,
    paddingTop: 54,
    paddingBottom: 26,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.line,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: BRAND.accent,
    fontWeight: '600',
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '500',
    color: BRAND.text,
  },
  heroIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: BRAND.panel,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BRAND.lineStrong,
  },
  heroCopy: {
    marginTop: 8,
    maxWidth: 320,
    fontSize: 14,
    lineHeight: 21,
    color: BRAND.secondary,
  },
  heroProgressCard: {
    backgroundColor: BRAND.midnight,
    borderRadius: 18,
    padding: 28,
    marginBottom: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressCaption: {
    fontSize: TYPOGRAPHY.small,
    color: '#BCCDF2',
    fontWeight: '500',
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 42,
    lineHeight: 48,
    fontWeight: '600',
    color: COLORS.white,
  },
  progressRing: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#dbe3ff',
    borderRadius: 999,
    marginTop: -34,
    marginHorizontal: 28,
    marginBottom: SPACING.xl,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: BRAND.accent,
    borderRadius: 999,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 1,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: BRAND.line,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: BRAND.line,
  },
  statCard: {
    width: '49.8%',
    minHeight: 126,
    backgroundColor: BRAND.panel,
    padding: SPACING.md,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: BRAND.line,
  },
  statValue: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '600',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.small,
    color: BRAND.secondary,
    fontWeight: '600',
  },
  card: {
    backgroundColor: BRAND.panel,
    borderRadius: 18,
    padding: 22,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: BRAND.line,
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
    fontWeight: '600',
    color: BRAND.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: TYPOGRAPHY.small,
    color: BRAND.secondary,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: BRAND.lightPanel,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BRAND.line,
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
    width: 24,
    height: 94,
    backgroundColor: BRAND.lightPanel,
    borderRadius: 999,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BRAND.line,
  },
  barFill: {
    width: '100%',
    borderRadius: 999,
  },
  barValue: {
    fontSize: 11,
    color: BRAND.text,
    fontWeight: '600',
    marginTop: 8,
  },
  barLabel: {
    fontSize: 11,
    color: BRAND.secondary,
    fontWeight: '600',
    marginTop: 3,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.line,
  },
  recentItemLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  recentIcon: {
    width: 36,
    height: 36,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BRAND.line,
  },
  recentIconDone: {
    backgroundColor: BRAND.successTint,
  },
  recentIconPending: {
    backgroundColor: BRAND.lightPanel,
  },
  recentInfo: {
    flex: 1,
    minWidth: 0,
  },
  recentTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: '600',
    color: BRAND.text,
    marginBottom: 3,
  },
  recentDone: {
    textDecorationLine: 'line-through',
    color: BRAND.secondary,
  },
  recentDate: {
    fontSize: TYPOGRAPHY.small,
    color: BRAND.secondary,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusDone: {
    backgroundColor: BRAND.successTint,
    borderColor: 'rgba(22, 101, 52, 0.16)',
  },
  statusPending: {
    backgroundColor: BRAND.lightPanel,
    borderColor: BRAND.lineStrong,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusTextDone: {
    color: '#166534',
  },
  statusTextPending: {
    color: BRAND.accent,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BRAND.lightPanel,
    borderRadius: 12,
    paddingVertical: SPACING.xl,
    borderWidth: 1,
    borderColor: BRAND.line,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.body,
    color: BRAND.secondary,
    fontWeight: '600',
  },
});
