import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { authService } from '../../services/api';
import { SPACING, TYPOGRAPHY } from '../../styles/theme';
import { ROUTES } from '../../constants/routes';

const BRAND = {
  midnight: '#0a1a33',
  accent: '#2f5fd8',
  lightPanel: '#eef2fa',
  text: '#0a1a33',
  secondary: '#5c6b89',
  line: 'rgba(10, 26, 51, 0.10)',
  white: '#ffffff',
  danger: '#ef4444',
  dangerSoft: '#fee2e2',
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
    let mounted = true;

    const loadUser = async () => {
      const currentUser = await authService.getCurrentUser();
      if (mounted) setUser(currentUser);

      try {
        const refreshedUser = await authService.refreshCurrentUser();
        if (mounted) setUser(refreshedUser);
      } catch (error) {
        console.warn('Erro ao atualizar usuario do menu:', error?.message || error);
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  const userName = user?.nome || user?.name || 'Usuario';
  const userEmail = user?.email || user?.username || 'E-mail nao disponivel';
  const profilePhoto = user?.foto || null;

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
        <Text style={styles.heroEyebrow}>Minha conta</Text>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
            ) : (
              <Text style={styles.avatarText}>{getInitials(userName)}</Text>
            )}
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
                <Feather name={item.icon} size={18} color={BRAND.accent} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.route ? (
                <Feather name="chevron-right" size={18} color={BRAND.secondary} />
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
    backgroundColor: BRAND.white,
  },
  hero: {
    backgroundColor: BRAND.midnight,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: 20,
    shadowColor: BRAND.midnight,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 4,
  },
  heroEyebrow: {
    color: '#9fb3d9',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.7,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: BRAND.lightPanel,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarText: {
    color: BRAND.midnight,
    fontSize: 18,
    fontWeight: '700',
  },
  profileText: {
    flex: 1,
  },
  name: {
    fontSize: TYPOGRAPHY.subtitle,
    fontWeight: '600',
    color: BRAND.white,
  },
  email: {
    fontSize: TYPOGRAPHY.small,
    color: '#9fb3d9',
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  sectionLabel: {
    marginBottom: SPACING.md,
    fontSize: 11,
    fontWeight: '700',
    color: BRAND.accent,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  menu: {
    marginBottom: SPACING.lg,
  },
  menuItem: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BRAND.line,
    paddingHorizontal: SPACING.md,
    marginBottom: 10,
  },
  secondaryItem: {
    shadowOpacity: 0,
    elevation: 0,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: BRAND.lightPanel,
    borderWidth: 1,
    borderColor: BRAND.line,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  menuLabel: {
    flex: 1,
    fontSize: TYPOGRAPHY.body,
    color: BRAND.text,
    fontWeight: '600',
  },
  soonText: {
    fontSize: 11,
    color: BRAND.secondary,
    fontWeight: '600',
  },
  logoutItem: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BRAND.dangerSoft,
    paddingHorizontal: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  logoutIconBox: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: BRAND.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  logoutLabel: {
    fontSize: TYPOGRAPHY.body,
    color: BRAND.danger,
    fontWeight: '700',
  },
});
