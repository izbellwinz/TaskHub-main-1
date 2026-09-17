import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { authService } from '../../services/api';
import { ROUTES } from '../../constants/routes';
import { SPACING, TYPOGRAPHY } from '../../styles/theme';

const BRAND = { bg: '#F4F7FD', panel: '#FFFFFF', text: '#0A1A33', secondary: '#5C6B89', accent: '#2F5FD8', line: 'rgba(10, 26, 51, 0.18)', danger: '#C0392B' };

export default function SettingsScreen({ navigation }) {
  const goHome = () => navigation.navigate('App', { screen: 'MainTabs', params: { screen: ROUTES.DASHBOARD } });
  const logout = () => Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [{ text: 'Cancelar', style: 'cancel' }, { text: 'Sair', style: 'destructive', onPress: async () => { await authService.logout(); navigation.reset({ index: 0, routes: [{ name: ROUTES.LOGIN }] }); } }]);
  const items = [
    { icon: 'bell', label: 'Notificacoes', onPress: () => Alert.alert('Notificacoes', 'Nenhuma notificacao nova.') },
    { icon: 'info', label: 'Sobre o aplicativo', onPress: () => Alert.alert('Sobre o aplicativo', 'TaskHub v2.9\nGerencie suas tarefas de forma simples.') },
    { icon: 'log-out', label: 'Sair da conta', onPress: logout, danger: true },
  ];
  return <ScrollView style={styles.container} contentContainerStyle={styles.scroll}><View style={styles.hero}><View style={styles.topRow}><TouchableOpacity style={styles.homeButton} onPress={goHome}><Feather name="arrow-left" size={19} color={BRAND.text} /></TouchableOpacity><Text style={styles.title}>Configuracoes</Text><View style={styles.spacer} /></View></View><View style={styles.content}>{items.map((item, index) => <TouchableOpacity key={item.label} style={[styles.item, index < items.length - 1 && styles.border]} onPress={item.onPress}><View style={styles.icon}><Feather name={item.icon} size={18} color={item.danger ? BRAND.danger : BRAND.accent} /></View><Text style={[styles.label, item.danger && styles.danger]}>{item.label}</Text><Feather name="chevron-right" size={18} color={BRAND.secondary} /></TouchableOpacity>)}</View></ScrollView>;
}
const styles = StyleSheet.create({ container:{flex:1,backgroundColor:BRAND.bg},scroll:{paddingBottom:SPACING.xl},hero:{backgroundColor:BRAND.panel,paddingTop:52,paddingHorizontal:SPACING.lg,paddingBottom:SPACING.lg,borderBottomWidth:1,borderColor:BRAND.line},topRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},homeButton:{width:40,height:40,borderRadius:8,backgroundColor:BRAND.panel,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:BRAND.line},title:{fontSize:18,fontWeight:'600',color:BRAND.text},spacer:{width:40},content:{margin:SPACING.lg,backgroundColor:BRAND.panel,borderRadius:8,borderWidth:1,borderColor:BRAND.line,overflow:'hidden'},item:{minHeight:62,flexDirection:'row',alignItems:'center',paddingHorizontal:SPACING.md},border:{borderBottomWidth:1,borderColor:'rgba(10,26,51,.10)'},icon:{width:34,height:34,borderRadius:8,backgroundColor:'#EEF3FD',alignItems:'center',justifyContent:'center',marginRight:SPACING.sm},label:{flex:1,fontSize:TYPOGRAPHY.body,fontWeight:'500',color:BRAND.text},danger:{color:BRAND.danger} });
