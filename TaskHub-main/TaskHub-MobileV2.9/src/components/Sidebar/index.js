import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { authService } from '../../services/api';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, shadows } from '../../styles/theme';
import { ROUTES } from '../../constants/routes';

const BRAND = {
  primary: '#0d1b5e',
  indigo: '#3949ab',
  soft: '#eef2ff',
  danger: '#ef4444',
};

const SUPPORT_ITEMS = [
  { icon: 'user', label: 'Meu Perfil', route: ROUTES.PROFILE },
  { icon: 'bell', label: 'Notificacoes' },
  { icon: 'star', label: 'Favoritos' },
  { icon: 'settings', label: 'Configuracoes' },
  { icon: 'info', label: 'Sobre' },
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

export default function SidebarContent({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    authService.getCurrentUser().then(setUser);
  }, []);

  const userName = user?.nome || user?.name || 'Usuario';
  const userEmail = user?.email || user?.username || 'E-mail nao disponivel';

  const handleLogout = async () => {
    await authService.logout();
    navigation.closeDrawer();
    navigation.navigate('Welcome');
  };

  const handleShortcutPress = (item) => {
    navigation.closeDrawer();

    if (item.route) {
      navigation.navigate(item.route);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(userName)}</Text>
          </View>
          <View style={styles.profileText}>
            <Text style={styles.name} numberOfLines={1}>{userName}</Text>
            <Text style={styles.email} numberOfLines={1}>{userEmail}</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionLabel}>Atalhos</Text>
        <View style={styles.menu}>
          {SUPPORT_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.label}
              activeOpacity={0.82}
              style={[styles.menuItem, styles.secondaryItem]}
              onPress={() => handleShortcutPress(item)}
            >
              <View style={styles.menuIconBox}>
                <Feather name={item.icon} size={18} color={BRAND.indigo} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.route ? (
                <Feather name="chevron-right" size={18} color="#a5acc7" />
              ) : (
                <Text style={styles.soonText}>Em breve</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.82}
        style={styles.logoutItem}
        onPress={handleLogout}
      >
        <View style={styles.logoutIconBox}>
          <Feather name="log-out" size={18} color={BRAND.danger} />
        </View>
        <Text style={styles.logoutLabel}>Sair</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  hero: {
    backgroundColor: BRAND.primary,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    borderBottomLeftRadius: 26,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#fde68a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: BRAND.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  profileText: {
    flex: 1,
  },
  name: {
    fontSize: TYPOGRAPHY.subtitle,
    fontWeight: '800',
    color: COLORS.white,
  },
  email: {
    fontSize: TYPOGRAPHY.small,
    color: 'rgba(255,255,255,0.72)',
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
  },
  sectionLabel: {
    marginLeft: SPACING.sm,
    marginBottom: SPACING.sm,
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.secondaryText,
    textTransform: 'uppercase',
  },
  menu: {
    marginBottom: SPACING.lg,
  },
  menuItem: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#e6e9f8',
    paddingHorizontal: SPACING.sm,
    marginBottom: 8,
    ...shadows.md,
  },
  secondaryItem: {
    shadowOpacity: 0.03,
    elevation: 1,
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
    color: COLORS.text,
    fontWeight: '700',
  },
  soonText: {
    fontSize: 11,
    color: COLORS.secondaryText,
    fontWeight: '700',
  },
  logoutItem: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#fee2e2',
    paddingHorizontal: SPACING.sm,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.xl,
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
  logoutLabel: {
    fontSize: TYPOGRAPHY.body,
    color: BRAND.danger,
    fontWeight: '800',
  },
});
