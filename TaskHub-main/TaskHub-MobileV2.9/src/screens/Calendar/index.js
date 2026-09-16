import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  Switch,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../../styles/theme';
import { useTabBarPadding } from '../../hooks/useTabBarPadding';
import { authService, agendaService, localDataService } from '../../services/api';
import TaskCard from '../../components/TaskCard';

const BRAND = {
  midnight: '#0a1a33',
  accent: '#2f5fd8',
  accentTint: '#E8EFFD',
  panel: '#ffffff',
  bg: '#F6F8FC',
  bgAlt: '#EEF2F7',
  text: '#0a1a33',
  secondary: '#5c6b89',
  line: 'rgba(10, 26, 51, 0.10)',
  lineStrong: 'rgba(10, 26, 51, 0.18)',
  headerMuted: '#9FB3D9',
  success: '#10b981',
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
  const [localEntries, setLocalEntries] = useState([]);
  const [user, setUser] = useState(null);
  const [entryModal, setEntryModal] = useState(false);
  const [entry, setEntry] = useState({ type: 'event', title: '', date: '', description: '', annually: true });
  const [filter, setFilter] = useState('Todas');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const mapAgendaToEvent = (item) => ({
    id: item.id,
    date: item.dataAgenda,
    title: item.titulo,
    color: item.cor || BRAND.accent,
    time: item.hora,
    description: item.descricao,
    done: item.statusAgenda === 'CONCLUIDO',
    statusAgenda: item.statusAgenda,
    type: item.type || 'event',
  });

  const loadEvents = useCallback(async () => {
    try {
      const user = await authService.getCurrentUser();
      setUser(user);
      if (user) {
        setLocalEntries(await localDataService.get(localDataService.keyForUser('calendarEntries', user.id)));
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
    return [...events, ...localEntries].filter((event) => event.date === dateStr || (event.type === 'birthday' && event.annually && event.date?.slice(5) === dateStr.slice(5)));
  };

  const isToday = (day) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const allEntries = [...events, ...localEntries];
  const pendingCount = allEntries.filter((event) => !event.done).length;
  const completedCount = allEntries.filter((event) => event.done).length;
  const filteredTasks = allEntries.filter((event) => {
    if (filter === 'Pendentes') return !event.done;
    if (filter === 'Concluidas') return event.done;
    return true;
  });

  const saveEntry = async () => {
    if (!entry.title.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) return;
    const nextEntry = { id: `local-${Date.now()}`, type: entry.type, title: entry.title.trim(), date: entry.date, description: entry.description.trim(), annually: entry.type === 'birthday' ? entry.annually : false, done: false, color: entry.type === 'birthday' ? '#D98A00' : BRAND.accent, time: '' };
    const next = [nextEntry, ...localEntries];
    setLocalEntries(next);
    await localDataService.set(localDataService.keyForUser('calendarEntries', user?.id), next);
    setEntryModal(false);
    setEntry({ type: 'event', title: '', date: '', description: '', annually: true });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
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
            <Text style={styles.heroTitle}>{MONTH_NAMES[month]} {year}</Text>
          </View>
          <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn} activeOpacity={0.82}>
            <Feather name="refresh-cw" size={18} color={BRAND.text} />
          </TouchableOpacity>
        </View>

        <Text style={styles.heroCopy}>Calendario mensal com a mesma leitura limpa da agenda web.</Text>

        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Feather name="calendar" size={14} color={BRAND.accent} />
            <Text style={styles.statPillText}>{allEntries.length} compromissos</Text>
          </View>
          <View style={styles.statPill}>
            <Feather name="clock" size={14} color={BRAND.accent} />
            <Text style={styles.statPillText}>{pendingCount} pendentes</Text>
          </View>
          <View style={styles.statPill}>
            <Feather name="check-circle" size={14} color={BRAND.success} />
            <Text style={styles.statPillText}>{completedCount} concluidas</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionWrap}>
        <View style={styles.monthCard}>
          <View style={styles.header}>
            <TouchableOpacity onPress={prevMonth} style={styles.navBtn} activeOpacity={0.82}>
              <Feather name="chevron-left" size={20} color={BRAND.text} />
            </TouchableOpacity>

            <View style={styles.monthBadge}>
              <Feather name="calendar" size={16} color={BRAND.accent} />
              <Text style={styles.monthTitle}>{MONTH_NAMES[month]} {year}</Text>
            </View>

            <TouchableOpacity onPress={nextMonth} style={styles.navBtn} activeOpacity={0.82}>
              <Feather name="chevron-right" size={20} color={BRAND.text} />
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
                <View key={`empty-${index}`} style={[styles.dayCell, styles.emptyDayCell]} />
              ))}
              {Array(daysInMonth).fill(null).map((_, index) => {
                const day = index + 1;
                const dayEvents = getEvents(day);

                return (
                  <View key={day} style={[styles.dayCell, isToday(day) && styles.todayCell]}>
                    <Text style={[styles.dayNumber, isToday(day) && styles.todayNumber]}>{day}</Text>
                    {dayEvents.length > 0 && (
                      <View style={styles.dayEvents}>
                        {dayEvents.slice(0, 2).map((event) => (
                          <View key={event.id} style={[styles.eventPreview, { borderLeftColor: event.color }]}>
                            <Text style={styles.eventPreviewText} numberOfLines={1}>
                              {event.type === 'birthday' ? '🎂 ' : ''}{event.title}
                            </Text>
                          </View>
                        ))}
                        {dayEvents.length > 2 && (
                          <Text style={styles.moreEvents}>+{dayEvents.length - 2}</Text>
                        )}
                      </View>
                    )}
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
              <Feather name="check-circle" size={22} color={BRAND.accent} />
              <Text style={styles.emptyText}>Nenhuma tarefa aqui.</Text>
            </View>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                iconName={task.done ? 'check-circle' : task.type === 'birthday' ? 'gift' : 'calendar'}
                title={task.title}
                subtitle={`${task.type === 'birthday' ? 'Aniversario' : 'Agenda'} - ${task.date.split('-').reverse().join('/')} ${task.type === 'birthday' && task.annually ? '· anual' : task.time || ''}`}
                priority={task.done ? 'low' : 'medium'}
                color={task.color}
              />
            ))
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.addButton} activeOpacity={0.84} onPress={() => setEntryModal(true)}>
        <Feather name="plus" size={20} color={COLORS.white} />
        <Text style={styles.addButtonText}>Novo compromisso</Text>
      </TouchableOpacity>
      <Modal visible={entryModal} transparent animationType="slide" onRequestClose={() => setEntryModal(false)}>
        <View style={styles.modalOverlay}><View style={styles.modal}>
          <View style={styles.modalHeader}><Text style={styles.modalTitle}>Novo compromisso</Text><TouchableOpacity onPress={() => setEntryModal(false)}><Feather name="x" size={22} color={BRAND.text}/></TouchableOpacity></View>
          <View style={styles.typeRow}>{[['event','Evento'],['birthday','Aniversario']].map(([value,label]) => <TouchableOpacity key={value} onPress={() => setEntry({...entry,type:value})} style={[styles.typeButton,entry.type===value&&styles.typeActive]}><Text style={[styles.typeText,entry.type===value&&styles.typeTextActive]}>{value==='birthday'?'🎂 ':''}{label}</Text></TouchableOpacity>)}</View>
          <TextInput value={entry.title} onChangeText={(title)=>setEntry({...entry,title})} placeholder={entry.type==='birthday'?'Nome da pessoa':'Titulo'} placeholderTextColor={BRAND.secondary} style={styles.entryInput}/>
          <TextInput value={entry.date} onChangeText={(date)=>setEntry({...entry,date})} placeholder="Data (AAAA-MM-DD)" placeholderTextColor={BRAND.secondary} keyboardType="numbers-and-punctuation" style={styles.entryInput}/>
          <TextInput value={entry.description} onChangeText={(description)=>setEntry({...entry,description})} placeholder="Informacoes adicionais (opcional)" placeholderTextColor={BRAND.secondary} multiline style={[styles.entryInput,styles.entryDescription]}/>
          {entry.type==='birthday'&&<View style={styles.annualRow}><Text style={styles.annualText}>Repetir todos os anos</Text><Switch value={entry.annually} onValueChange={(annually)=>setEntry({...entry,annually})} trackColor={{true:BRAND.accent}}/></View>}
          <TouchableOpacity style={styles.entrySave} onPress={saveEntry}><Text style={styles.entrySaveText}>Salvar</Text></TouchableOpacity>
        </View></View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND.bg,
    paddingTop: 0,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  hero: {
    backgroundColor: BRAND.panel,
    paddingHorizontal: SPACING.lg,
    paddingTop: 54,
    paddingBottom: 24,
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
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '600',
    color: BRAND.text,
  },
  heroCopy: {
    marginTop: 10,
    maxWidth: 320,
    fontSize: TYPOGRAPHY.small,
    lineHeight: 20,
    color: BRAND.secondary,
  },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: BRAND.panel,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BRAND.lineStrong,
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
    backgroundColor: BRAND.panel,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BRAND.line,
  },
  statPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: BRAND.text,
  },
  sectionWrap: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
  },
  monthCard: {
    backgroundColor: BRAND.panel,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BRAND.lineStrong,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.line,
    gap: 10,
  },
  navBtn: {
    width: 38,
    height: 38,
    backgroundColor: BRAND.panel,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BRAND.lineStrong,
  },
  monthBadge: {
    flex: 1,
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BRAND.bg,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BRAND.line,
    paddingHorizontal: 12,
  },
  monthTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: BRAND.text,
  },
  calendar: {
    backgroundColor: BRAND.line,
  },
  dayNames: {
    flexDirection: 'row',
    backgroundColor: BRAND.midnight,
  },
  dayName: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    color: BRAND.headerMuted,
    textTransform: 'uppercase',
    paddingVertical: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: BRAND.line,
  },
  dayCell: {
    width: '14.28%',
    minHeight: 72,
    backgroundColor: BRAND.panel,
    justifyContent: 'flex-start',
    paddingHorizontal: 4,
    paddingTop: 7,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: BRAND.line,
  },
  emptyDayCell: {
    backgroundColor: BRAND.bgAlt,
  },
  todayCell: {
    backgroundColor: BRAND.accentTint,
  },
  dayNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: BRAND.text,
    width: 26,
    height: 26,
    borderRadius: 13,
    textAlign: 'center',
    lineHeight: 26,
  },
  todayNumber: {
    backgroundColor: BRAND.accent,
    color: COLORS.white,
  },
  dayEvents: {
    marginTop: 4,
    gap: 3,
  },
  eventPreview: {
    minHeight: 14,
    borderLeftWidth: 3,
    borderRadius: 3,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 3,
    justifyContent: 'center',
  },
  eventPreviewText: {
    fontSize: 8,
    lineHeight: 12,
    fontWeight: '600',
    color: BRAND.text,
  },
  moreEvents: {
    fontSize: 9,
    fontWeight: '700',
    color: BRAND.accent,
  },
  tasksSection: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  tasksHeader: {
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: BRAND.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.small,
    color: BRAND.secondary,
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
    borderRadius: 8,
    backgroundColor: BRAND.panel,
    borderWidth: 1,
    borderColor: BRAND.lineStrong,
  },
  filterActive: {
    backgroundColor: BRAND.accentTint,
    borderColor: BRAND.accent,
  },
  filterText: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: '600',
    color: BRAND.secondary,
  },
  filterTextActive: {
    color: BRAND.accent,
  },
  list: {
    gap: 12,
    paddingBottom: SPACING.xl,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BRAND.panel,
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
  addButton: { marginHorizontal: SPACING.lg, minHeight: 48, borderRadius: 10, backgroundColor: BRAND.accent, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  addButtonText: { color: COLORS.white, fontSize: TYPOGRAPHY.body, fontWeight: '700' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(10,26,51,.35)' },
  modal: { backgroundColor: BRAND.panel, borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: SPACING.lg, paddingBottom: 36 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { color: BRAND.text, fontSize: 19, fontWeight: '700' },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  typeButton: { flex: 1, minHeight: 42, borderRadius: 9, borderWidth: 1, borderColor: BRAND.lineStrong, alignItems: 'center', justifyContent: 'center' },
  typeActive: { backgroundColor: BRAND.accentTint, borderColor: BRAND.accent },
  typeText: { color: BRAND.secondary, fontSize: 13, fontWeight: '700' },
  typeTextActive: { color: BRAND.accent },
  entryInput: { borderWidth: 1, borderColor: BRAND.line, borderRadius: 10, paddingHorizontal: 13, paddingVertical: 11, color: BRAND.text, fontSize: 15, marginBottom: 11 },
  entryDescription: { minHeight: 70, textAlignVertical: 'top' },
  annualRow: { minHeight: 42, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  annualText: { color: BRAND.text, fontSize: 14, fontWeight: '600' },
  entrySave: { minHeight: 48, borderRadius: 10, backgroundColor: BRAND.accent, alignItems: 'center', justifyContent: 'center' },
  entrySaveText: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
});
