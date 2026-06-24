import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { authService } from '../../services/api';
import ScreenContainer from '../../components/ScreenContainer';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { COLORS, SPACING, RADIUS, shadows } from '../../styles/theme';
import { ROUTES } from '../../constants/routes';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      await authService.login(email, password);
      navigation.replace('App');
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Erro ao conectar com o servidor.';
      Alert.alert('Erro no Login', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer background={COLORS.background}>
      <View style={styles.container}>

        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>T</Text>
          </View>
          <Text style={styles.title}>Bem-vindo de volta</Text>
          <Text style={styles.subtitle}>Entre para continuar organizando</Text>
        </View>

        <View style={styles.card}>
          <Input
            label="E-mail"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Senha"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.forgot}>
            <Text style={styles.forgotText}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 20 }} />
          ) : (
            <Button
              title="Entrar"
              onPress={handleLogin}
              style={styles.btn}
            />
          )}
        </View>

        {/* <View style={styles.footer}>
          <Text style={styles.footerText}>Ainda não tem conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.REGISTER)}>
            <Text style={styles.footerLink}>Criar conta</Text>
          </TouchableOpacity>
        </View> */}

      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  logoText: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: '800',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.secondaryText,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...shadows.md,
  },
  forgot: {
    alignSelf: 'flex-end',
    marginTop: -4,
    marginBottom: SPACING.md,
  },
  forgotText: {
    fontSize: 13,
    color: COLORS.accent,
    fontWeight: '600',
  },
  btn: {
    marginTop: SPACING.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.secondaryText,
  },
  footerLink: {
    fontSize: 14,
    color: COLORS.accent,
    fontWeight: '700',
  },
});
