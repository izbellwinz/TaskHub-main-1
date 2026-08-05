import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { authService } from '../../services/api';

const calendarDays = [
  ['31', 'muted'], ['1'], ['2', 'event'], ['3'], ['4', 'event'], ['5'], ['6'],
  ['7'], ['8'], ['9'], ['10', 'event'], ['11'], ['12'], ['13'],
  ['14'], ['15'], ['16'], ['17'], ['18'], ['19'], ['20'],
  ['21'], ['22'], ['23'], ['24'], ['25', 'today event'], ['26', 'event'], ['27'],
  ['28'], ['29', 'event'], ['30'], ['1', 'muted'], ['2', 'muted'], ['3', 'muted'], ['4', 'muted'],
];

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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.topPanel}>
            <View style={styles.brandRow}>
              <View style={styles.logoMark}>
                <View style={styles.logoTopLine} />
                <View style={[styles.logoStem, styles.logoStemLeft]} />
                <View style={[styles.logoStem, styles.logoStemRight]} />
              </View>
              <Text style={styles.brand}>TaskHub</Text>
            </View>

            <View style={styles.calendar}>
              <View style={styles.calendarHeader}>
                <Text style={styles.month}>Junho</Text>
                <Text style={styles.year}>2026</Text>
              </View>
              <View style={styles.weekdays}>
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => <Text key={`${day}-${index}`} style={styles.weekday}>{day}</Text>)}
              </View>
              <View style={styles.days}>
                {calendarDays.map(([day, state], index) => (
                  <View key={`${day}-${index}`} style={[styles.day, state?.includes('today') && styles.today]}>
                    <Text style={[styles.dayText, state?.includes('muted') && styles.mutedDay, state?.includes('today') && styles.todayText]}>{day}</Text>
                    {state?.includes('event') && <View style={[styles.eventDot, state?.includes('today') && styles.todayEventDot]} />}
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.formPanel}>
            <View style={styles.eyebrow}>
           
              
            </View>
            <Text style={styles.title}>Entrar na sua conta</Text>
            

            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>E-mail</Text>
                <TextInput style={styles.input} placeholder="seu@email.com" placeholderTextColor={COLORS.placeholder} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
              </View>
              <View style={styles.field}>
                <View style={styles.labelRow}><Text style={styles.label}>Senha</Text><Text style={styles.forgot}>Esqueceu a senha?</Text></View>
                <TextInput style={styles.input} placeholder="Digite sua senha" placeholderTextColor={COLORS.placeholder} value={password} onChangeText={setPassword} secureTextEntry autoComplete="current-password" />
              </View>

              <Pressable style={({ pressed }) => [styles.loginButton, pressed && styles.loginButtonPressed]} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.loginText}>Entrar</Text>}
              </Pressable>
            </View>
            <Text style={styles.footer}>Ao entrar, você concorda com os <Text style={styles.link}>termos de uso</Text> e a <Text style={styles.link}>política de privacidade</Text> do TaskHub.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const COLORS = { navy: '#0A1A33', blue: '#2F5FD8', blueDark: '#1F4DC2', white: '#FFFFFF', panel: '#EEF2FA', text: '#0A1A33', secondary: '#5C6B89', border: 'rgba(10,26,51,0.18)', lightBorder: 'rgba(10,26,51,0.10)', placeholder: '#A6B0C3' };

const styles = StyleSheet.create({
  flex: { flex: 1 }, safeArea: { flex: 1, backgroundColor: COLORS.navy }, scrollContent: { flexGrow: 1, backgroundColor: COLORS.white },
  topPanel: { backgroundColor: COLORS.navy, paddingHorizontal: 26, paddingTop: 22, paddingBottom: 22 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 18 },
  logoMark: { width: 26, height: 26, borderRadius: 7, backgroundColor: COLORS.blue, position: 'relative' },
  logoTopLine: { position: 'absolute', top: 9, left: 5, right: 5, height: 2, backgroundColor: COLORS.white },
  logoStem: { position: 'absolute', top: 5, width: 2, height: 6, backgroundColor: COLORS.white }, logoStemLeft: { left: 7 }, logoStemRight: { right: 7 },
  brand: { color: COLORS.white, fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }), fontSize: 18, fontWeight: '600' },
  calendar: { paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' },
  calendarHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }, month: { color: COLORS.white, fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }), fontSize: 14, fontWeight: '500' }, year: { color: '#9FB3D9', fontSize: 12 },
  weekdays: { flexDirection: 'row', marginBottom: 5 }, weekday: { width: '14.2857%', color: '#9FB3D9', fontSize: 9, fontWeight: '600', textAlign: 'center' },
  days: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 2 }, day: { width: '14.2857%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 6, position: 'relative' }, dayText: { color: 'rgba(255,255,255,0.85)', fontSize: 10 }, mutedDay: { color: 'rgba(255,255,255,0.18)' }, today: { backgroundColor: COLORS.blue }, todayText: { color: COLORS.white, fontWeight: '600' }, eventDot: { position: 'absolute', bottom: 3, width: 3, height: 3, borderRadius: 3, backgroundColor: '#8FB0F5' }, todayEventDot: { backgroundColor: COLORS.white },
  formPanel: { flex: 1, paddingHorizontal: 26, paddingTop: 26, paddingBottom: 24 }, eyebrow: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: '#EAF0FD', borderWidth: 1, borderColor: 'rgba(47,95,216,0.22)', borderRadius: 30, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 16 }, eyebrowDot: { width: 5, height: 5, borderRadius: 5, backgroundColor: COLORS.blue }, eyebrowText: { color: COLORS.blueDark, fontSize: 12, fontWeight: '500' },
  title: { color: COLORS.text, fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }), fontSize: 26, fontWeight: '500', letterSpacing: -0.3 }, subtitle: { color: COLORS.secondary, fontSize: 13.5, marginTop: 7 }, link: { color: COLORS.blue, fontWeight: '500' },
  form: { marginTop: 24, gap: 14 }, googleButton: { height: 48, borderWidth: 1, borderColor: COLORS.border, borderRadius: 9, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }, googleIcon: { width: 17, height: 17, borderRadius: 9, backgroundColor: '#EAF0FD', alignItems: 'center', justifyContent: 'center' }, googleIconText: { color: COLORS.blue, fontSize: 11, fontWeight: '800' }, googleText: { color: COLORS.text, fontSize: 14.5, fontWeight: '500' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 4 }, dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.lightBorder }, dividerText: { color: COLORS.secondary, fontSize: 12 },
  field: { gap: 6 }, labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, label: { color: COLORS.text, fontSize: 13, fontWeight: '500' }, forgot: { color: COLORS.blue, fontSize: 12.5, fontWeight: '500' }, input: { height: 46, borderWidth: 1, borderColor: COLORS.border, borderRadius: 9, paddingHorizontal: 14, color: COLORS.text, fontSize: 14.5, backgroundColor: COLORS.white },
  loginButton: { height: 48, marginTop: 4, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.blue }, loginButtonPressed: { backgroundColor: COLORS.blueDark }, loginText: { color: COLORS.white, fontSize: 14.5, fontWeight: '500' }, footer: { marginTop: 22, textAlign: 'center', color: COLORS.secondary, fontSize: 12, lineHeight: 19 },
});
