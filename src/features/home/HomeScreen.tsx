import React, { useRef, useMemo, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  TextInput,
  Alert,
  Keyboard,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { Slider } from '@miblanchard/react-native-slider';
import { BlurView } from '@react-native-community/blur';
import moment from 'moment';
import 'moment/locale/tr';
import { useRefluxStore } from '../../store/useRefluxStore';
import RefluxEntryCard from '../../components/RefluxEntryCard';
import { RefluxEntry } from '../../types';

moment.locale('tr');

const PREDEFINED_SYMPTOMS = [
  'Mide Yanması', 'Şişkinlik', 'Ağızda Acı Tat',
  'Öksürük', 'Boğaz Yanması', 'Hazımsızlık',
];

const HomeScreen = () => {
  const { entries, addEntry, updateEntry } = useRefluxStore();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [currentMeal, setCurrentMeal] = useState('');
  const [meals, setMeals] = useState<string[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);

  const sections = useMemo(() => {
    const groups = entries.reduce((acc: any, entry) => {
      const date = moment(entry.timestamp).format('DD MMMM YYYY');
      if (!acc[date]) acc[date] = [];
      acc[date].push(entry);
      return acc;
    }, {});
    return Object.keys(groups).map(date => ({ title: date, data: groups[date] }));
  }, [entries]);

  const handleEdit = useCallback((entry: RefluxEntry) => {
    setEditingId(entry.id);
    setMeals(entry.meal.split(', '));
    setSelectedSymptoms(entry.symptoms || []);
    setSeverity(entry.severity);
    bottomSheetRef.current?.expand();
  }, []);

  const openNewEntryModal = () => {
    setEditingId(null);
    setMeals([]);
    setSelectedSymptoms([]);
    setCurrentMeal('');
    setSeverity(1);
    bottomSheetRef.current?.expand();
  };

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleSave = () => {
    const finalMeals = currentMeal.trim() !== '' ? [...meals, currentMeal.trim()] : meals;
    if (finalMeals.length === 0) {
      Alert.alert('Hata', 'Lütfen ne yediğinizi belirtin.');
      return;
    }
    const entryData = { meal: finalMeals.join(', '), symptoms: selectedSymptoms, severity: Math.round(severity) };
    if (editingId) {
      const existingEntry = entries.find(e => e.id === editingId);
      if (existingEntry) updateEntry({ ...existingEntry, ...entryData });
    } else {
      addEntry({ id: Date.now().toString(), timestamp: Date.now(), ...entryData });
    }
    Keyboard.dismiss();
    bottomSheetRef.current?.close();
  };

  const renderBackdrop = useCallback((props: any) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
  ), []);

  return (
    <View style={{ flex: 1, backgroundColor: '#F2F2F7' }}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Rahat Lokma</Text>
              <Text style={styles.subtitle}>Midenin takvimi burada.</Text>
            </View>
            <View style={{ flex: 1 }} />
            <TouchableOpacity style={styles.headerAddButton} onPress={openNewEntryModal}>
              <Text style={styles.headerAddButtonIcon}>➕</Text>
              <Text style={styles.headerAddButtonText}>Yeni</Text>
            </TouchableOpacity>
          </View>

          <SectionList
            sections={sections}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            stickySectionHeadersEnabled={false}
            renderItem={({ item }) => <RefluxEntryCard entry={item} onEdit={handleEdit} />}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.sectionHeader}>{title}</Text>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Midem şimdilik rahat. İlk öğününü ekle!</Text>
              </View>
            }
          />
        </View>
      </SafeAreaView>

      <View style={styles.bottomBlurWrapper} pointerEvents="none">
        <BlurView style={StyleSheet.absoluteFill} blurType="light" blurAmount={5} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255, 255, 255,0.1)' }]} />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['75%']} // Biraz düşürdüm ki modal daha kompakt dursun
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: '#FFF' }}
      >
        <View style={{ flex: 1 }}>
          <BottomSheetScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Kaydı Düzenle' : 'Ne Yedik?'}</Text>
            
            <View style={styles.section}>
              <Text style={styles.label}>Ürünler</Text>
              <View style={styles.inputRow}>
                <TextInput 
                  style={styles.input} 
                  placeholder="Örn: Kahve, Pizza..." 
                  value={currentMeal} 
                  onChangeText={setCurrentMeal} 
                />
                <TouchableOpacity 
                  style={styles.plusButton} 
                  onPress={() => { if (currentMeal.trim() !== '') { setMeals([...meals, currentMeal.trim()]); setCurrentMeal(''); } }}
                >
                  <Text style={{ color: '#FFF', fontSize: 32, fontWeight: 'bold' }}>+</Text>
                </TouchableOpacity>
              </View>

              {meals.length > 0 && (
                <View style={styles.horizontalMealsWrapper}>
                  <ScrollView 
                    horizontal={true} 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalChipsPadding}
                  >
                    {meals.map((item, index) => (
                      <View key={index} style={styles.mealChip}>
                        <Text style={styles.chipText}>{item}</Text>
                        <TouchableOpacity onPress={() => setMeals(meals.filter((_, i) => i !== index))}>
                          <Text style={styles.chipDeleteText}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Nasıl Hissediyorsun?</Text>
              <View style={styles.chipsContainer}>
                {PREDEFINED_SYMPTOMS.map(symptom => (
                  <TouchableOpacity 
                    key={symptom} 
                    style={[styles.symptomChip, selectedSymptoms.includes(symptom) && styles.symptomChipSelected]} 
                    onPress={() => toggleSymptom(symptom)}
                  >
                    <Text style={[styles.chipText, selectedSymptoms.includes(symptom) && styles.chipTextSelected]}>{symptom}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Rahatsızlık Şiddeti: {Math.round(severity)}/5</Text>
              <Slider 
                value={severity} 
                onValueChange={(v: any) => setSeverity(v[0])} 
                minimumValue={1} 
                maximumValue={5} 
                step={1} 
                minimumTrackTintColor="#E74C3C" 
              />
            </View>
          </BottomSheetScrollView>

          {/* KAYDET BUTONU: Artık daha yukarıda ve gereksiz boşluktan arınmış */}
          <View style={styles.fixedFooter}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: { width: '100%', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 15, paddingBottom: 15 },
  title: { fontSize: 32, fontWeight: '800', color: '#1C1C1E', letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: '#8E8E93', marginTop: 4, fontWeight: '500' },
  headerAddButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#E5F1FF', borderRadius: 20 },
  headerAddButtonIcon: { fontSize: 14, marginRight: 4 },
  headerAddButtonText: { fontSize: 15, fontWeight: '700', color: '#007AFF' },
  listContent: { paddingHorizontal: 20, paddingBottom: 150 },
  sectionHeader: { fontSize: 13, fontWeight: '600', color: '#8E8E93', textTransform: 'uppercase', letterSpacing: 1, marginTop: 20, marginBottom: 10, marginLeft: 4 },
  
  bottomBlurWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    zIndex: 1,
    overflow: 'hidden',
  },

  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 15, color: '#8E8E93', fontStyle: 'italic' },
  
  modalContent: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 10 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#1C1C1E' },
  section: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#3A3A3C', marginBottom: 12 },
  inputRow: { flexDirection: 'row', marginBottom: 10 },
  input: { flex: 1, backgroundColor: '#F2F2F7', borderRadius: 12, padding: 15, fontSize: 16 },
  plusButton: { backgroundColor: '#007AFF', marginLeft: 10, width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  
  horizontalMealsWrapper: { marginTop: 10, height: 50, justifyContent: 'center' },
  horizontalChipsPadding: { paddingRight: 20, alignItems: 'center' },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  mealChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E5F1FF', padding: 8, paddingHorizontal: 12, borderRadius: 10, marginRight: 8 },
  chipDeleteText: { color: '#E74C3C', marginLeft: 8, fontSize: 16, fontWeight: 'bold' },
  
  symptomChip: { backgroundColor: '#F2F2F7', padding: 10, paddingHorizontal: 15, borderRadius: 20, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: '#E5E5EA' },
  symptomChipSelected: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  chipText: { fontSize: 14, color: '#1C1C1E', fontWeight: '500' },
  chipTextSelected: { color: '#FFFFFF' },

  fixedFooter: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 90 : 20, // Boşluğu azalttık
    paddingTop: 10,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  saveButton: { backgroundColor: '#34C759', padding: 18, borderRadius: 16, alignItems: 'center' },
  saveButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});

export default HomeScreen;