import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { authService, localDataService } from '../../services/api';
import { SPACING, TYPOGRAPHY } from '../../styles/theme';
import { useTabBarPadding } from '../../hooks/useTabBarPadding';
import { ROUTES } from '../../constants/routes';

const COLORS = ['#FFF3BF', '#E8EFFD', '#E4F7EC', '#FCE7F3', '#F3E8FF'];
const BRAND = { bg: '#F6F8FC', panel: '#FFF', text: '#0A1A33', secondary: '#5C6B89', accent: '#2F5FD8', line: 'rgba(10,26,51,.12)', danger: '#C0392B' };

const dateLabel = (value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

export default function NotesScreen({ navigation }) {
  const tabBarPadding = useTabBarPadding();
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [editor, setEditor] = useState(null);

  const storageKey = user ? localDataService.keyForUser('notes', user.id) : null;
  const loadNotes = useCallback(async () => {
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      setNotes(await localDataService.get(localDataService.keyForUser('notes', currentUser.id)));
      const saved = await localDataService.get(localDataService.keyForUser('saved', currentUser.id));
      setSavedIds(saved.filter((item) => item.type === 'note').map((item) => item.sourceId));
    }
  }, []);

  useEffect(() => { loadNotes(); }, [loadNotes]);
  useFocusEffect(useCallback(() => { loadNotes(); }, [loadNotes]));

  const persist = async (next) => {
    setNotes(next);
    if (storageKey) await localDataService.set(storageKey, next);
  };

  const openNew = () => setEditor({ id: null, title: '', content: '', color: COLORS[0], important: false });
  const saveNote = async () => {
    if (!editor?.title.trim() && !editor?.content.trim()) {
      Alert.alert('Nota vazia', 'Escreva um título ou conteúdo antes de salvar.');
      return;
    }
    const now = new Date().toISOString();
    const note = { ...editor, id: editor.id || `note-${Date.now()}`, title: editor.title.trim() || 'Sem título', content: editor.content.trim(), updatedAt: now };
    const next = editor.id ? notes.map((item) => item.id === note.id ? note : item) : [note, ...notes];
    await persist(next);
    setEditor(null);
  };
  const toggleImportant = async (note) => persist(notes.map((item) => item.id === note.id ? { ...item, important: !item.important, updatedAt: new Date().toISOString() } : item));
  const removeNote = (note) => Alert.alert('Excluir nota', 'Esta nota será excluída.', [{ text: 'Cancelar', style: 'cancel' }, { text: 'Excluir', style: 'destructive', onPress: async () => {
    await persist(notes.filter((item) => item.id !== note.id));
    const savedKey = localDataService.keyForUser('saved', user?.id);
    const saved = await localDataService.get(savedKey);
    await localDataService.set(savedKey, saved.filter((item) => item.sourceId !== note.id));
  }}]);
  const toggleSaved = async (note) => {
    const savedKey = localDataService.keyForUser('saved', user?.id);
    const saved = await localDataService.get(savedKey);
    const exists = saved.some((item) => item.sourceId === note.id && item.type === 'note');
    await localDataService.set(savedKey, exists ? saved.filter((item) => !(item.sourceId === note.id && item.type === 'note')) : [{ id: `saved-${note.id}`, sourceId: note.id, type: 'note', title: note.title, content: note.content, savedAt: new Date().toISOString() }, ...saved]);
    setSavedIds(exists ? savedIds.filter((id) => id !== note.id) : [...savedIds, note.id]);
  };

  return <View style={styles.container}>
    <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: tabBarPadding + 72 }]} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}><View style={styles.heroTop}><TouchableOpacity onPress={() => navigation.navigate('App', { screen: 'MainTabs', params: { screen: ROUTES.DASHBOARD } })} style={styles.homeButton}><Feather name="arrow-left" size={19} color={BRAND.text}/></TouchableOpacity><View><Text style={styles.eyebrow}>TaskHub</Text><Text style={styles.title}>Bloco de Notas</Text></View></View><Text style={styles.copy}>Registre suas ideias e mantenha o que importa por perto.</Text></View>
      <View style={styles.content}>
        <TouchableOpacity style={styles.newButton} onPress={openNew}><Feather name="plus" size={19} color="#FFF" /><Text style={styles.newButtonText}>Nova nota</Text></TouchableOpacity>
        {notes.length === 0 ? <View style={styles.empty}><Feather name="file-text" size={25} color={BRAND.accent}/><Text style={styles.emptyText}>Nenhuma nota criada.</Text></View> : notes.map((note) => <View key={note.id} style={[styles.note, { backgroundColor: note.color || COLORS[0] }]}>
          <View style={styles.noteHeader}><Text style={styles.noteTitle} numberOfLines={1}>{note.title}</Text><TouchableOpacity hitSlop={10} onPress={() => toggleImportant(note)}><Feather name="star" size={19} color={note.important ? '#D98A00' : BRAND.secondary} fill={note.important ? '#D98A00' : 'transparent'} /></TouchableOpacity></View>
          {!!note.content && <Text style={styles.noteContent} numberOfLines={3}>{note.content}</Text>}<Text style={styles.date}>Atualizada em {dateLabel(note.updatedAt)}</Text>
          <View style={styles.actions}><TouchableOpacity onPress={() => setEditor(note)}><Feather name="edit-2" size={17} color={BRAND.text}/></TouchableOpacity><TouchableOpacity accessibilityLabel={savedIds.includes(note.id) ? 'Remover de Salvos' : 'Salvar nota'} onPress={() => toggleSaved(note)}><Feather name="bookmark" size={17} color={savedIds.includes(note.id) ? BRAND.accent : BRAND.text} fill={savedIds.includes(note.id) ? BRAND.accent : 'transparent'}/></TouchableOpacity><TouchableOpacity onPress={() => removeNote(note)}><Feather name="trash-2" size={17} color={BRAND.danger}/></TouchableOpacity></View>
        </View>)}
      </View>
    </ScrollView>
    <Modal visible={!!editor} transparent animationType="slide" onRequestClose={() => setEditor(null)}><View style={styles.modalOverlay}><View style={styles.modal}><View style={styles.modalTop}><Text style={styles.modalTitle}>{editor?.id ? 'Editar nota' : 'Nova nota'}</Text><TouchableOpacity onPress={() => setEditor(null)}><Feather name="x" size={22} color={BRAND.text}/></TouchableOpacity></View><TextInput value={editor?.title} onChangeText={(title) => setEditor({ ...editor, title })} placeholder="Título" placeholderTextColor={BRAND.secondary} style={styles.input}/><TextInput value={editor?.content} onChangeText={(content) => setEditor({ ...editor, content })} placeholder="Escreva sua nota..." placeholderTextColor={BRAND.secondary} multiline textAlignVertical="top" style={[styles.input, styles.contentInput]}/><View style={styles.colorRow}>{COLORS.map((color) => <TouchableOpacity key={color} onPress={() => setEditor({ ...editor, color })} style={[styles.color, { backgroundColor: color }, editor?.color === color && styles.colorSelected]} />)}</View><TouchableOpacity style={styles.saveButton} onPress={saveNote}><Text style={styles.saveText}>Salvar nota</Text></TouchableOpacity></View></View></Modal>
  </View>;
}

const styles = StyleSheet.create({ container:{flex:1,backgroundColor:BRAND.bg},scroll:{paddingBottom:SPACING.xl},hero:{backgroundColor:BRAND.panel,paddingHorizontal:SPACING.lg,paddingTop:54,paddingBottom:24,borderBottomWidth:1,borderColor:BRAND.line},heroTop:{flexDirection:'row',alignItems:'center',gap:12},homeButton:{width:40,height:40,borderRadius:8,backgroundColor:BRAND.panel,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:BRAND.line},eyebrow:{fontSize:12,fontWeight:'700',letterSpacing:.7,color:BRAND.accent,textTransform:'uppercase'},title:{fontSize:28,fontWeight:'600',color:BRAND.text,marginTop:6},copy:{fontSize:TYPOGRAPHY.small,lineHeight:20,color:BRAND.secondary,marginTop:8},content:{padding:SPACING.lg,gap:12},newButton:{minHeight:48,borderRadius:10,backgroundColor:BRAND.accent,alignItems:'center',justifyContent:'center',flexDirection:'row',gap:8},newButtonText:{color:'#FFF',fontWeight:'700',fontSize:TYPOGRAPHY.body},empty:{backgroundColor:BRAND.panel,borderWidth:1,borderColor:BRAND.line,borderRadius:14,alignItems:'center',gap:9,paddingVertical:32},emptyText:{color:BRAND.secondary,fontWeight:'600'},note:{borderRadius:14,padding:16,borderWidth:1,borderColor:'rgba(10,26,51,.08)'},noteHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12},noteTitle:{flex:1,fontSize:17,fontWeight:'700',color:BRAND.text},noteContent:{fontSize:14,lineHeight:20,color:BRAND.text,marginTop:8},date:{fontSize:11,color:BRAND.secondary,marginTop:12},actions:{flexDirection:'row',justifyContent:'flex-end',gap:19,marginTop:12},modalOverlay:{flex:1,justifyContent:'flex-end',backgroundColor:'rgba(10,26,51,.35)'},modal:{backgroundColor:BRAND.panel,borderTopLeftRadius:22,borderTopRightRadius:22,padding:SPACING.lg,paddingBottom:36},modalTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:16},modalTitle:{fontSize:19,fontWeight:'700',color:BRAND.text},input:{borderWidth:1,borderColor:BRAND.line,borderRadius:10,paddingHorizontal:13,paddingVertical:11,fontSize:15,color:BRAND.text,marginBottom:12},contentInput:{height:140},colorRow:{flexDirection:'row',gap:10,marginBottom:20},color:{width:28,height:28,borderRadius:14,borderWidth:1,borderColor:BRAND.line},colorSelected:{borderWidth:3,borderColor:BRAND.accent},saveButton:{minHeight:48,borderRadius:10,backgroundColor:BRAND.accent,alignItems:'center',justifyContent:'center'},saveText:{color:'#FFF',fontSize:15,fontWeight:'700'} });
