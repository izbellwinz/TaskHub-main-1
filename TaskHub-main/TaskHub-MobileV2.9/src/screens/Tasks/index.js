import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '../../styles/theme';
import { useTabBarPadding } from '../../hooks/useTabBarPadding';
import { authService, agendaService } from '../../services/api';
import TaskCard from '../../components/TaskCard';

const FILTERS = ['Todas', 'Pendentes', 'Concluídas'];

export default function TasksScreen() {
  const tabBarPadding = useTabBarPadding();
  const [filter, setFilter] = useState('Todas');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTasks = useCallback(async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        const data = await agendaService.findByUsuarioId(user.id);
        // Mapear dados da agenda para o formato de tasks
        const mappedTasks = data.map(item => ({
          id: item.id,
          title: item.titulo,
          category: 'Agenda',
          due: item.dataAgenda.split('-').reverse().join('/') + ' ' + item.hora,
          done: item.statusAgenda === 'CONCLUIDO',
          priority: 'medium', // Backend não parece ter prioridade explícita, fixando medium
          emoji: '📅',
          color: item.cor
        }));
        setTasks(mappedTasks);
      }
    } catch (error) {
      console.error('Erro ao carregar tasks:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTasks();
  };

  const filtered = tasks.filter(t => {
    if (filter === 'Pendentes') return !t.done;
    if (filter === 'Concluídas') return t.done;
    return true;
  });

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
      bounces={false} 
      overScrollMode="never"
    >
      <Text style={styles.title}>📋 Minhas Tasks</Text>
      <Text style={styles.subtitle}>{tasks.filter(t => !t.done).length} pendentes · {tasks.filter(t => t.done).length} concluídas</Text>

      <View style={styles.filters}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.list}>
        {filtered.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>🎉</Text>
            <Text style={styles.emptyText}>Nenhuma tarefa aqui!</Text>
          </View>
        ) : (
          filtered.map(task => (
            <TaskCard 
              key={task.id}
              emoji={task.emoji}
              title={task.title}
              subtitle={`${task.category} • ${task.due}`}
              priority={task.priority}
              color={task.color}
            />
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
  title: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
    marginBottom: SPACING.lg,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: SPACING.lg,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.white,
  },
  filterActive: {
    backgroundColor: COLORS.accent,
  },
  filterText: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: '600',
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
    paddingVertical: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.secondaryText,
    fontWeight: '600',
  },
});
