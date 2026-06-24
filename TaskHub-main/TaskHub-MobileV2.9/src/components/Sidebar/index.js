import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { authService } from '../../services/api';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '../../styles/theme';

const MENU_ITEMS = [
  { icon: '👤', label: 'Meu Perfil', route: 'Profile' },
  { icon: '🔔', label: 'Notificações', route: 'Notifications' },
  { icon: '⭐', label: 'Favoritos', route: 'Favorites' },
  { icon: '⚙️', label: 'Configurações', route: 'Settings' },
  { icon: 'ℹ️', label: 'Sobre', route: 'About' },
];

export default function SidebarContent({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    authService.getCurrentUser().then(setUser);
  }, []);

  const userName = user?.nome || user?.name || 'Usuario';
  const userEmail = user?.email || user?.username || 'E-mail nao disponivel';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profile}>
        <View style={styles.avatar} />
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.email}>{userEmail}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.menu}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={styles.menuItem}
            onPress={() => {
              navigation.closeDrawer();
              navigation.navigate(item.route);
            }}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.divider} />

      <TouchableOpacity
        style={styles.logoutItem}
        onPress={() => navigation.navigate('Welcome')}
      >
        <Text style={styles.menuIcon}>🚪</Text>
        <Text style={styles.logoutLabel}>Sair</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  profile: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: COLORS.accent,
    marginBottom: SPACING.sm,
  },
  name: {
    fontSize: TYPOGRAPHY.subtitle,
    fontWeight: '700',
    color: COLORS.text,
  },
  email: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  menu: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    marginBottom: 4,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  menuLabel: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: '500',
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  logoutLabel: {
    fontSize: TYPOGRAPHY.body,
    color: '#EF4444',
    fontWeight: '600',
  },
});
