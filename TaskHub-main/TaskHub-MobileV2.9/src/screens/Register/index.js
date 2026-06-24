import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { COLORS, SPACING, RADIUS, shadows } from '../../styles/theme';
import { ROUTES } from '../../constants/routes';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ScreenContainer background={COLORS.background}>
      <View style={styles.container}>

        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>T</Text>
          </View>
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Comece a organizar suas tarefas hoje</Text>
        </View>

        <View style={styles.card}>
          <Input
            label="Nome"
            placeholder="Seu nome"
            value={name}
            onChangeText={setName}
          />
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
          <Button
            title="Criar conta"
            onPress={() => navigation.replace('App')}
            style={styles.btn}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.LOGIN)}>
            <Text style={styles.footerLink}>Entrar</Text>
          </TouchableOpacity>
        </View>

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
