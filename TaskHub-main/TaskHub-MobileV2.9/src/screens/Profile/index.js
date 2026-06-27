import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { authService } from '../../services/api';
import { ROUTES } from '../../constants/routes';
import { COLORS, SPACING, TYPOGRAPHY } from '../../styles/theme';

const BRAND = {
  midnight: '#0A1A33',
  accent: '#2F5FD8',
  accentTint: '#EEF3FD',
  background: '#F4F7FD',
  panel: '#FFFFFF',
  text: '#0A1A33',
  secondary: '#5C6B89',
  line: 'rgba(10, 26, 51, 0.10)',
  lineStrong: 'rgba(10, 26, 51, 0.18)',
  danger: '#C0392B',
  dangerTint: '#FDECEA',
};

const STATS = [
  { label: 'Concluidas', value: '0', icon: 'check-circle', color: '#10b981' },
  { label: 'Total', value: '0', icon: 'calendar', color: BRAND.accent },
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
  const [savingPhoto, setSavingPhoto] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const currentUser = await authService.getCurrentUser();
      if (mounted) setUser(currentUser);

      try {
        const refreshedUser = await authService.refreshCurrentUser();
        if (mounted) setUser(refreshedUser);
      } catch (error) {
        console.warn('Erro ao atualizar perfil do backend:', error?.message || error);
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

  const saveProfilePhoto = async (foto) => {
    if (!user?.id) return;

    setSavingPhoto(true);
    try {
      const updatedUser = await authService.update(user.id, {
        nome: user.nome || user.name || userName,
        email: user.email || user.username || userEmail,
        foto: foto || '',
      });
      setUser(updatedUser);
    } catch (error) {
      Alert.alert('Foto de perfil', error?.response?.data?.message || 'Nao foi possivel salvar a foto.');
    } finally {
      setSavingPhoto(false);
    }
  };

  const handleChangePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permissao necessaria', 'Permita acesso as fotos para alterar sua foto de perfil.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.75,
      base64: true,
    });

    if (result.canceled) return;

    const asset = result.assets?.[0];
    if (!asset) return;

    const imageData = asset.base64
      ? `data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`
      : asset.uri;

    await saveProfilePhoto(imageData);
  };

  const handleRemovePhoto = () => {
    if (!profilePhoto) return;

    Alert.alert(
      'Remover foto',
      'Deseja remover sua foto de perfil?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: () => saveProfilePhoto(null) },
      ]
    );
  };

  const handlePhotoOptions = () => {
    const options = profilePhoto
      ? [
          { text: 'Trocar foto', onPress: handleChangePhoto },
          { text: 'Remover foto', style: 'destructive', onPress: handleRemovePhoto },
          { text: 'Cancelar', style: 'cancel' },
        ]
      : [
          { text: 'Colocar foto', onPress: handleChangePhoto },
          { text: 'Cancelar', style: 'cancel' },
        ];

    Alert.alert('Foto de perfil', 'Escolha uma opcao.', options);
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
            <Feather name="arrow-left" size={19} color={BRAND.text} />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Perfil</Text>
          <View style={styles.topSpacer} />
        </View>

        <View style={styles.profileBlock}>
          <TouchableOpacity
            activeOpacity={0.84}
            style={styles.avatar}
            onPress={handlePhotoOptions}
            disabled={savingPhoto}
          >
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
            ) : (
              <Text style={styles.avatarText}>{getInitials(userName)}</Text>
            )}
            <View style={styles.avatarEdit}>
              {savingPhoto ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Feather name="camera" size={13} color={COLORS.white} />
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.name} numberOfLines={1}>{userName}</Text>
          <Text style={styles.email} numberOfLines={1}>{userEmail}</Text>

          <TouchableOpacity
            activeOpacity={0.84}
            style={styles.photoAction}
            onPress={handlePhotoOptions}
            disabled={savingPhoto}
          >
            <Text style={styles.photoActionText}>{profilePhoto ? 'Trocar foto' : 'Colocar foto'}</Text>
          </TouchableOpacity>

          <View style={styles.memberBadge}>
            <Feather name="user-check" size={13} color={BRAND.accent} />
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
            <Feather name="sliders" size={16} color={BRAND.accent} />
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
                <Feather name={item.icon} size={18} color={BRAND.accent} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Feather name="chevron-right" size={18} color="#B4BECE" />
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
    backgroundColor: BRAND.background,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  hero: {
    backgroundColor: BRAND.panel,
    paddingTop: 52,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.line,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  homeButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: BRAND.panel,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BRAND.lineStrong,
  },
  screenTitle: {
    color: BRAND.text,
    fontSize: 18,
    fontWeight: '600',
  },
  topSpacer: {
    width: 40,
    height: 40,
  },
  profileBlock: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: BRAND.midnight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    position: 'relative',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarEdit: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: BRAND.accent,
    borderWidth: 2,
    borderColor: BRAND.panel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: '500',
  },
  name: {
    maxWidth: '100%',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '600',
    color: BRAND.text,
  },
  email: {
    maxWidth: '100%',
    fontSize: TYPOGRAPHY.small,
    color: BRAND.secondary,
    marginTop: 6,
  },
  photoAction: {
    marginTop: SPACING.sm,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: BRAND.accentTint,
    borderWidth: 1,
    borderColor: 'rgba(47, 95, 216, 0.18)',
  },
  photoActionText: {
    color: BRAND.accent,
    fontSize: 12,
    fontWeight: '500',
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: BRAND.accentTint,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(47, 95, 216, 0.18)',
    marginTop: SPACING.md,
  },
  memberText: {
    fontSize: 12,
    fontWeight: '500',
    color: BRAND.accent,
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
    minHeight: 106,
    backgroundColor: BRAND.panel,
    borderRadius: 8,
    padding: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BRAND.line,
  },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '600',
    color: BRAND.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: BRAND.secondary,
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
    borderRadius: 8,
    backgroundColor: BRAND.accentTint,
    borderWidth: 1,
    borderColor: BRAND.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.subtitle,
    fontWeight: '600',
    color: BRAND.text,
  },
  menuCard: {
    backgroundColor: BRAND.panel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BRAND.lineStrong,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
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
    borderBottomColor: BRAND.line,
  },
  menuIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: BRAND.accentTint,
    borderWidth: 1,
    borderColor: BRAND.line,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  menuLabel: {
    flex: 1,
    fontSize: TYPOGRAPHY.body,
    fontWeight: '500',
    color: BRAND.text,
  },
  logoutBtn: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BRAND.panel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(192, 57, 43, 0.22)',
    paddingHorizontal: SPACING.md,
  },
  logoutIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: BRAND.dangerTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  logoutText: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: '600',
    color: BRAND.danger,
  },
});
