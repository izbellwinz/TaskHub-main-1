import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '../../styles/theme';
import { useTabBarPadding } from '../../hooks/useTabBarPadding';
import { authService, agendaService } from '../../services/api';

const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const DAY_NAMES = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

export default function CalendarScreen() {
  const tabBarPadding = useTabBarPadding();
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadEvents = useCallback(async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        try {
          const data = await agendaService.findByUsuarioId(user.id);
          const mapped = data.map(a => ({
            id: a.id,
            date: a.dataAgenda,
            title: a.titulo,
            color: a.cor || COLORS.primary,
            time: a.hora,
            description: a.descricao
          }));
          setEvents(mapped);
        } catch (apiError) {
          console.warn('API Offline no Calendário, usando MOCK');
          import('../../data/mockData').then(m => {
            const mapped = m.MOCK_EVENTS.map(e => ({
              id: e.id,
              date: e.date,
              title: e.title,
              color: e.color,
              time: '12:00',
              description: 'Exemplo de evento'
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

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const getEvents = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const isToday = (day) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const upcomingEvents = events.filter(e => e.date >= today.toISOString().split('T')[0]).slice(0, 4);

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={{ paddingBottom: tabBarPadding }} 
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
          <Text style={styles.navText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>{MONTH_NAMES[month]} {year}</Text>
        <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
          <Text style={styles.navText}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.calendar}>
        <View style={styles.dayNames}>
          {DAY_NAMES.map(d => (
            <Text key={d} style={styles.dayName}>{d}</Text>
          ))}
        </View>

        <View style={styles.grid}>
          {Array(firstDay).fill(null).map((_, i) => (
            <View key={`empty-${i}`} style={styles.dayCell} />
          ))}
          {Array(daysInMonth).fill(null).map((_, i) => {
            const day = i + 1;
            const events = getEvents(day);
            return (
              <View key={day} style={[styles.dayCell, isToday(day) && styles.todayCell]}>
                <Text style={[styles.dayNumber, isToday(day) && styles.todayNumber]}>{day}</Text>
                {events.slice(0, 2).map((e, idx) => (
                  <View key={idx} style={[styles.eventDot, { backgroundColor: e.color }]} />
                ))}
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 Próximos eventos</Text>
        {upcomingEvents.length === 0 ? (
          <Text style={styles.empty}>Nenhum evento próximo</Text>
        ) : (
          upcomingEvents.map((e, i) => (
            <View key={i} style={styles.eventCard}>
              <View style={[styles.eventBar, { backgroundColor: e.color }]} />
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{e.title}</Text>
                <Text style={styles.eventDate}>{e.date.split('-').reverse().join('/')}</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 70,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  navBtn: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 22,
    color: COLORS.text,
    fontWeight: '600',
  },
  monthTitle: {
    fontSize: TYPOGRAPHY.subtitle,
    fontWeight: '800',
    color: COLORS.text,
  },
  calendar: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
  },
  dayNames: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayName: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.secondaryText,
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
    paddingTop: 4,
    gap: 2,
  },
  todayCell: {
    backgroundColor: COLORS.accent,
    borderRadius: 8,
  },
  dayNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  todayNumber: {
    color: COLORS.white,
  },
  eventDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.subtitle,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  empty: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.body,
  },
  eventCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  eventBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  eventInfo: {
    flex: 1,
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: '700',
    color: COLORS.text,
  },
  eventDate: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },
});
