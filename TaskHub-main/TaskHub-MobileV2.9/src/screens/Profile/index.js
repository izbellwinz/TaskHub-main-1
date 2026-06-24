import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { authService } from '../../services/api';
import { ROUTES } from '../../constants/routes';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, shadows } from '../../styles/theme';

const STATS = [
  { label: 'Concluídas', value: '0', emoji: '✅' },
  { label: 'Total', value: '0', emoji: '🔥' },
  { label: 'Eficiência', value: '0%', emoji: '⚡' },
];

const MENU = [
  { icon: '🔔', label: 'Notificações', action: () => Alert.alert("Notificações", "Nenhuma notificação nova.") },
  { icon: '⭐', label: 'Favoritos', action: () => Alert.alert("Favoritos", "Você ainda não possui itens favoritos.") },
  { icon: '⚙️', label: 'Configurações', action: () => Alert.alert("Configurações", "Configurações do aplicativo em breve.") },
  { icon: 'ℹ️', label: 'Sobre o app', action: () => Alert.alert("Sobre", "TaskHub v2.9\nGerencie suas tarefas de forma simples.") },
];

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    authService.getCurrentUser().then(setUser);
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Sair",
      "Deseja realmente sair da sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          style: "destructive",
          onPress: async () => {
            await authService.logout();
            navigation.reset({
              index: 0,
              routes: [{ name: ROUTES.WELCOME }],
            });
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} bounces={false} overScrollMode="never">

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.nome?.charAt(0).toUpperCase() || 'U'}</Text>
        </View>
        <Text style={styles.name}>{user?.nome || 'Usuário'}</Text>
        <Text style={styles.email}>{user?.email || user?.username || 'E-mail não disponível'}</Text>
        <View style={styles.memberBadge}>
          <Text style={styles.memberText}>⚡ Membro Ativo</Text>
        </View>
      </View>

      {/* Stats (Placeholders integrados visualmente) */}
      <View style={styles.statsRow}>
        {STATS.map((s, i) => (
          <View key={i} style={styles.statCard}>
            <Text style={styles.statEmoji}>{s.emoji}</Text>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Menu */}
      <View style={styles.menuCard}>
        {MENU.map((item, i) => (
          <TouchableOpacity 
            key={i} 
            style={[styles.menuItem, i < MENU.length - 1 && styles.menuBorder]}
            onPress={item.action}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Sair da conta</Text>
      </TouchableOpacity>

      <View style={{ height: SPACING.xl }} />
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
  hero: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 36,
    fontWeight: '800',
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  email: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
    marginBottom: SPACING.sm,
  },
  memberBadge: {
    backgroundColor: COLORS.medium,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  memberText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.mediumText,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    ...shadows.md,
  },
  statEmoji: { fontSize: 20, marginBottom: 6 },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.secondaryText,
    textAlign: 'center',
  },
  menuCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg,
    ...shadows.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  menuBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIcon: { fontSize: 20 },
  menuLabel: {
    flex: 1,
    fontSize: TYPOGRAPHY.body,
    fontWeight: '500',
    color: COLORS.text,
  },
  menuArrow: {
    fontSize: 20,
    color: COLORS.secondaryText,
  },
  logoutBtn: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    ...shadows.md,
  },
  logoutText: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: '700',
    color: '#EF4444',
  },
});
