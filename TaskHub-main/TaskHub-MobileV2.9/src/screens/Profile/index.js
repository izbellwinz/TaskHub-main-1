import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { authService } from '../../services/api';
import { ROUTES } from '../../constants/routes';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, shadows } from '../../styles/theme';

const BRAND = {
  primary: '#0d1b5e',
  indigo: '#3949ab',
  indigo2: '#5c6bc0',
  soft: '#eef2ff',
  yellow: '#fde68a',
  danger: '#ef4444',
};

const STATS = [
  { label: 'Concluidas', value: '0', icon: 'check-circle', color: '#10b981' },
  { label: 'Total', value: '0', icon: 'calendar', color: BRAND.indigo },
  { label: 'Eficiencia', value: '0%', icon: 'zap', color: '#f59e0b' },
];

const MENU = [
  {
    icon: 'bell',
    label: 'Notificacoes',
    action: () => Alert.alert('Notificacoes', 'Nenhuma notificacao nova.'),
  },
  {
    icon: 'star',
    label: 'Favoritos',
    action: () => Alert.alert('Favoritos', 'Voce ainda nao possui itens favoritos.'),
  },
  {
    icon: 'settings',
    label: 'Configuracoes',
    action: () => Alert.alert('Configuracoes', 'Configuracoes do aplicativo em breve.'),
  },
  {
    icon: 'info',
    label: 'Sobre o app',
    action: () => Alert.alert('Sobre', 'TaskHub v2.9\nGerencie suas tarefas de forma simples.'),
  },
];

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'U';
}

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    authService.getCurrentUser().then(setUser);
  }, []);

  const userName = user?.nome || user?.name || 'Usuario';
  const userEmail = user?.email || user?.username || 'E-mail nao disponivel';

  const handleGoHome = () => {
    navigation.navigate('App', {
      screen: 'MainTabs',
      params: { screen: ROUTES.DASHBOARD },
    });
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await authService.logout();
            navigation.reset({
              index: 0,
              routes: [{ name: ROUTES.WELCOME }],
            });
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      bounces={false}
      overScrollMode="never"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={styles.topRow}>
          <TouchableOpacity
            activeOpacity={0.84}
            style={styles.homeButton}
            onPress={handleGoHome}
          >
            <Feather name="arrow-left" size={20} color={BRAND.primary} />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Perfil</Text>
          <View style={styles.topSpacer} />
        </View>

        <View style={styles.profileBlock}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(userName)}</Text>
          </View>
          <Text style={styles.name} numberOfLines={1}>{userName}</Text>
          <Text style={styles.email} numberOfLines={1}>{userEmail}</Text>

          <View style={styles.memberBadge}>
            <Feather name="zap" size={14} color={BRAND.primary} />
            <Text style={styles.memberText}>Membro ativo</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.statsRow}>
          {STATS.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: `${stat.color}18` }]}>
                <Feather name={stat.icon} size={18} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <Feather name="sliders" size={16} color={BRAND.indigo} />
          </View>
          <Text style={styles.sectionTitle}>Preferencias</Text>
        </View>

        <View style={styles.menuCard}>
          {MENU.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              activeOpacity={0.84}
              style={[styles.menuItem, index < MENU.length - 1 && styles.menuBorder]}
              onPress={item.action}
            >
              <View style={styles.menuIconBox}>
                <Feather name={item.icon} size={18} color={BRAND.indigo} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Feather name="chevron-right" size={18} color="#a5acc7" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.84}
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <View style={styles.logoutIconBox}>
            <Feather name="log-out" size={18} color={BRAND.danger} />
          </View>
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  hero: {
    backgroundColor: BRAND.primary,
    paddingTop: 58,
    paddingHorizontal: SPACING.lg,
    paddingBottom: 34,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  homeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
  },
  topSpacer: {
    width: 42,
    height: 42,
  },
  profileBlock: {
    alignItems: 'center',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: BRAND.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    color: BRAND.primary,
    fontSize: 30,
    fontWeight: '800',
  },
  name: {
    maxWidth: '100%',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    color: COLORS.white,
  },
  email: {
    maxWidth: '100%',
    fontSize: TYPOGRAPHY.small,
    color: 'rgba(255,255,255,0.74)',
    marginTop: 6,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: BRAND.yellow,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginTop: SPACING.md,
  },
  memberText: {
    fontSize: 12,
    fontWeight: '800',
    color: BRAND.primary,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    minHeight: 116,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e6e9f8',
    ...shadows.md,
  },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: BRAND.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.secondaryText,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: SPACING.md,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: BRAND.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.subtitle,
    fontWeight: '800',
    color: BRAND.primary,
  },
  menuCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#e6e9f8',
    marginBottom: SPACING.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  menuItem: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  menuBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#e6e9f8',
  },
  menuIconBox: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: BRAND.soft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  menuLabel: {
    flex: 1,
    fontSize: TYPOGRAPHY.body,
    fontWeight: '700',
    color: COLORS.text,
  },
  logoutBtn: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#fee2e2',
    paddingHorizontal: SPACING.md,
  },
  logoutIconBox: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  logoutText: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: '800',
    color: BRAND.danger,
  },
});
