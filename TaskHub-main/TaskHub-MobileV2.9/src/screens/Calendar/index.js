import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, shadows } from '../../styles/theme';
import { useTabBarPadding } from '../../hooks/useTabBarPadding';
import { authService, agendaService } from '../../services/api';
import TaskCard from '../../components/TaskCard';

const BRAND = {
  primary: '#0d1b5e',
  primary2: '#1a237e',
  indigo: '#3949ab',
  indigo2: '#5c6bc0',
  soft: '#eef2ff',
  soft2: '#f5f7ff',
  yellow: '#fde68a',
};

const MONTH_NAMES = ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
const FILTERS = ['Todas', 'Pendentes', 'Concluidas'];

export default function CalendarScreen() {
  const tabBarPadding = useTabBarPadding();
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('Todas');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const mapAgendaToEvent = (item) => ({
    id: item.id,
    date: item.dataAgenda,
    title: item.titulo,
    color: item.cor || BRAND.indigo,
    time: item.hora,
    description: item.descricao,
    done: item.statusAgenda === 'CONCLUIDO',
    statusAgenda: item.statusAgenda,
  });

  const loadEvents = useCallback(async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        try {
          const data = await agendaService.findByUsuarioId(user.id);
          setEvents(data.map(mapAgendaToEvent));
        } catch (apiError) {
          console.warn('API Offline no Calendario, usando MOCK');
          import('../../data/mockData').then((m) => {
            const mapped = m.MOCK_EVENTS.map((event) => ({
              id: event.id,
              date: event.date,
              title: event.title,
              color: event.color,
              time: '12:00',
              description: 'Exemplo de evento',
              done: false,
              statusAgenda: 'PENDENTE',
            }));
            setEvents(mapped);
          });
        }
      }
    } catch (error) {
      console.error('Error loading calendar events:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const onRefresh = () => {
    setRefreshing(true);
    loadEvents();
  };

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((currentYear) => currentYear - 1);
      return;
    }

    setMonth((currentMonth) => currentMonth - 1);
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((currentYear) => currentYear + 1);
      return;
    }

    setMonth((currentMonth) => currentMonth + 1);
  };

  const getEvents = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter((event) => event.date === dateStr);
  };

  const isToday = (day) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const pendingCount = events.filter((event) => !event.done).length;
  const completedCount = events.filter((event) => event.done).length;
  const filteredTasks = events.filter((event) => {
    if (filter === 'Pendentes') return !event.done;
    if (filter === 'Concluidas') return event.done;
    return true;
  });

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
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
            <Text style={styles.eyebrow}>Agenda</Text>
            <Text style={styles.heroTitle}>{MONTH_NAMES[month]} {year}</Text>
          </View>
          <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn} activeOpacity={0.82}>
            <Feather name="refresh-cw" size={18} color={BRAND.primary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.heroCopy}>Acompanhe os dias, veja o que vence e filtre suas tarefas sem sair da tela.</Text>

        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Feather name="calendar" size={14} color={BRAND.indigo} />
            <Text style={styles.statPillText}>{events.length} eventos</Text>
          </View>
          <View style={styles.statPill}>
            <Feather name="clock" size={14} color={BRAND.indigo} />
            <Text style={styles.statPillText}>{pendingCount} pendentes</Text>
          </View>
          <View style={styles.statPill}>
            <Feather name="check-circle" size={14} color="#10b981" />
            <Text style={styles.statPillText}>{completedCount} concluidas</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionWrap}>
        <View style={styles.monthCard}>
          <View style={styles.header}>
            <TouchableOpacity onPress={prevMonth} style={styles.navBtn} activeOpacity={0.82}>
              <Feather name="chevron-left" size={20} color={BRAND.primary} />
            </TouchableOpacity>

            <View style={styles.monthBadge}>
              <Feather name="calendar" size={16} color={BRAND.primary} />
              <Text style={styles.monthTitle}>{MONTH_NAMES[month]} {year}</Text>
            </View>

            <TouchableOpacity onPress={nextMonth} style={styles.navBtn} activeOpacity={0.82}>
              <Feather name="chevron-right" size={20} color={BRAND.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.calendar}>
            <View style={styles.dayNames}>
              {DAY_NAMES.map((dayName) => (
                <Text key={dayName} style={styles.dayName}>{dayName}</Text>
              ))}
            </View>

            <View style={styles.grid}>
              {Array(firstDay).fill(null).map((_, index) => (
                <View key={`empty-${index}`} style={styles.dayCell} />
              ))}
              {Array(daysInMonth).fill(null).map((_, index) => {
                const day = index + 1;
                const dayEvents = getEvents(day);

                return (
                  <View key={day} style={[styles.dayCell, isToday(day) && styles.todayCell]}>
                    <Text style={[styles.dayNumber, isToday(day) && styles.todayNumber]}>{day}</Text>
                    <View style={styles.dotsRow}>
                      {dayEvents.slice(0, 3).map((event) => (
                        <View key={event.id} style={[styles.eventDot, { backgroundColor: event.color }]} />
                      ))}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.tasksSection}>
        <View style={styles.tasksHeader}>
          <View>
            <Text style={styles.title}>Minhas tarefas</Text>
            <Text style={styles.subtitle}>{pendingCount} pendentes - {completedCount} concluidas</Text>
          </View>
        </View>

        <View style={styles.filters}>
          {FILTERS.map((filterName) => (
            <TouchableOpacity
              key={filterName}
              style={[styles.filterBtn, filter === filterName && styles.filterActive]}
              onPress={() => setFilter(filterName)}
              activeOpacity={0.84}
            >
              <Text style={[styles.filterText, filter === filterName && styles.filterTextActive]}>
                {filterName}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.list}>
          {filteredTasks.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Feather name="check-circle" size={22} color={BRAND.indigo2} />
              <Text style={styles.emptyText}>Nenhuma tarefa aqui.</Text>
            </View>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                iconName={task.done ? 'check-circle' : 'calendar'}
                title={task.title}
                subtitle={`Agenda - ${task.date.split('-').reverse().join('/')} ${task.time || ''}`}
                priority={task.done ? 'low' : 'medium'}
                color={task.color}
              />
            ))
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
    paddingTop: 0,
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
  heroCopy: {
    marginTop: 10,
    maxWidth: 320,
    fontSize: TYPOGRAPHY.small,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.82)',
  },
  refreshBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: SPACING.lg,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: BRAND.yellow,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  statPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: BRAND.primary,
  },
  sectionWrap: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
  },
  monthCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#e6e9f8',
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    gap: 10,
  },
  navBtn: {
    width: 40,
    height: 40,
    backgroundColor: BRAND.soft,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthBadge: {
    flex: 1,
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BRAND.soft2,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e4e8fb',
    paddingHorizontal: 12,
  },
  monthTitle: {
    fontSize: TYPOGRAPHY.subtitle,
    fontWeight: '800',
    color: BRAND.primary,
  },
  calendar: {
    backgroundColor: COLORS.white,
  },
  dayNames: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayName: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.secondaryText,
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 6,
    borderRadius: 12,
  },
  todayCell: {
    backgroundColor: BRAND.primary,
  },
  dayNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  todayNumber: {
    color: COLORS.white,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
    minHeight: 8,
  },
  eventDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  tasksSection: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  tasksHeader: {
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#e6e9f8',
  },
  filterActive: {
    backgroundColor: BRAND.primary,
    borderColor: BRAND.primary,
  },
  filterText: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: '700',
    color: COLORS.secondaryText,
  },
  filterTextActive: {
    color: COLORS.white,
  },
  list: {
    gap: 12,
    paddingBottom: SPACING.xl,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingVertical: SPACING.xl,
    borderWidth: 1,
    borderColor: '#e6e9f8',
  },
  emptyText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.secondaryText,
    fontWeight: '600',
  },
});
