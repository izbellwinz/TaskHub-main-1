import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import Button from '../../components/Button';
import { COLORS, SPACING, RADIUS } from '../../styles/theme';
import { ROUTES } from '../../constants/routes';

export default function WelcomeScreen({ navigation }) {
  return (
    <ScreenContainer background={COLORS.background}>
      <View style={styles.container}>

        <View style={styles.hero}>
          <View style={styles.logoWrap}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>T</Text>
            </View>
            <View style={styles.logoDot} />
          </View>

          <Text style={styles.appName}>TaskHub</Text>
          <Text style={styles.headline}>Organize suas{'\n'}prioridades.</Text>
          <Text style={styles.sub}>Uma experiência moderna e focada{'\n'}em produtividade.</Text>

          <View style={styles.pills}>
            {['📋 Tasks', '📅 Calendar', '📊 Stats'].map(p => (
              <View key={p} style={styles.pill}>
                <Text style={styles.pillText}>{p}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actions}>
          <Button title="Entrar" onPress={() => navigation.navigate(ROUTES.LOGIN)} />
          <Button 
            title="Modo Desenvolvedor (Pular Login)" 
            variant="ghost" 
            onPress={() => {
              // Salvar um usuário fake para não quebrar as telas que dependem de ID
              const fakeUser = { id: 999, nome: 'Dev User', username: 'dev@taskhub.com' };
              import('../../services/api').then(m => {
                import('expo-secure-store').then(ss => {
                  ss.setItemAsync('user', JSON.stringify(fakeUser)).then(() => {
                    navigation.replace('App');
                  });
                });
              });
            }} 
          />
        </View>

      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: 80,
    paddingBottom: SPACING.xl,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrap: {
    position: 'relative',
    marginBottom: SPACING.lg,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: COLORS.white,
    fontSize: 38,
    fontWeight: '800',
  },
  logoDot: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.accent,
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  appName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.accent,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: SPACING.md,
  },
  headline: {
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.primary,
    textAlign: 'center',
    lineHeight: 46,
    marginBottom: SPACING.md,
  },
  sub: {
    fontSize: 15,
    color: COLORS.secondaryText,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  pills: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  actions: {
    gap: SPACING.sm,
  },
});
