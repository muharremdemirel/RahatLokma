import React, { useRef, useMemo, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { Slider } from '@miblanchard/react-native-slider';
import { X, Plus, Activity } from 'lucide-react-native';
import moment from 'moment';
import 'moment/locale/tr';
import { useRefluxStore } from '../../store/useRefluxStore';
import RefluxEntryCard from '../../components/RefluxEntryCard';
import { RefluxEntry } from '../../types';

moment.locale('tr');

const PREDEFINED_SYMPTOMS = [
  'Mide Yanması',
  'Şişkinlik',
  'Ağızda Acı Tat',
  'Öksürük',
  'Boğaz Yanması',
  'Hazımsızlık',
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
    return Object.keys(groups).map(date => ({
      title: date,
      data: groups[date],
    }));
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
    const finalMeals =
      currentMeal.trim() !== '' ? [...meals, currentMeal.trim()] : meals;
    if (finalMeals.length === 0) {
      Alert.alert('Kaydedilmedi', 'Lütfen yediğiniz ürünü belirtin.');
      return;
    }

    const entryData = {
      meal: finalMeals.join(', '),
      symptoms: selectedSymptoms,
      severity: Math.round(severity),
    };

    if (editingId) {
      const existingEntry = entries.find(e => e.id === editingId);
      if (existingEntry) updateEntry({ ...existingEntry, ...entryData });
    } else {
      addEntry({
        id: Date.now().toString(),
        timestamp: Date.now(),
        ...entryData,
      });
    }
    bottomSheetRef.current?.close();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Rahat Lokma</Text>
        </View>

        <SectionList
          sections={sections}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <RefluxEntryCard entry={item} onEdit={handleEdit} />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
        />

        <TouchableOpacity style={styles.addButton} onPress={openNewEntryModal}>
          <Text style={styles.addButtonText}>Kayıt Ekle</Text>
        </TouchableOpacity>

        {/* Kullandığım bottom sheet kartın ayarı*/}
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={['90%']}
          enablePanDownToClose
          backdropComponent={props => (
            <BottomSheetBackdrop
              {...props}
              disappearsOnIndex={-1}
              appearsOnIndex={0}
            />
          )}
        >
          <BottomSheetScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingId ? 'Kaydı Düzenle' : 'Ne Yediniz ?'}
            </Text>

            {/* ürünler Kısmı */}
            <View style={styles.section}>
              <Text style={styles.label}>Ürünler</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Örneğin: Kahve, Pizza..."
                  value={currentMeal}
                  onChangeText={setCurrentMeal}
                />
                <TouchableOpacity
                  style={styles.plusButton}
                  onPress={() => {
                    if (currentMeal.trim() !== '') {
                      setMeals([...meals, currentMeal.trim()]);
                      setCurrentMeal('');
                    }
                  }}
                >
                  <Plus color="#FFFFFF" size={22} strokeWidth={3} />
                </TouchableOpacity>
              </View>
              <View style={styles.chipsContainer}>
                {meals.map((item, index) => (
                  <View key={index} style={styles.mealChip}>
                    <Text style={styles.chipText}>{item}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        setMeals(meals.filter((_, i) => i !== index))
                      }
                    >
                      <X color="#E74C3C" size={14} style={{ marginLeft: 6 }} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            {/* Semptomlar Kısmı */}
            <View style={styles.section}>
              <Text style={styles.label}>Nasıl Hissediyorsun?</Text>
              <View style={styles.chipsContainer}>
                {PREDEFINED_SYMPTOMS.map(symptom => (
                  <TouchableOpacity
                    key={symptom}
                    style={[
                      styles.symptomChip,
                      selectedSymptoms.includes(symptom) &&
                        styles.symptomChipSelected,
                    ]}
                    onPress={() => toggleSymptom(symptom)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedSymptoms.includes(symptom) &&
                          styles.chipTextSelected,
                      ]}
                    >
                      {symptom}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Şiddet Kısmı */}
            <View style={styles.section}>
              <Text style={styles.label}>
                Rahatsızlık Şiddeti: {Math.round(severity)}/5
              </Text>
              <Slider
                value={severity}
                onValueChange={(v: any) => setSeverity(v[0])}
                minimumValue={1}
                maximumValue={5}
                step={1}
                minimumTrackTintColor="#E74C3C"
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F5F5' },
  container: { flex: 1 },
  header: { padding: 20, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000000ff' },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: '#34495E',
    marginTop: 20,
    marginBottom: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#3498DB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  modalContent: { padding: 24 },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: { marginBottom: 25 },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 12,
  },
  inputRow: { flexDirection: 'row', marginBottom: 10 },
  input: { flex: 1, backgroundColor: '#F0F2F5', borderRadius: 12, padding: 15 },
  plusButton: {
    backgroundColor: '#3498DB',
    marginLeft: 10,
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  mealChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F4FD',
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  symptomChip: {
    backgroundColor: '#F0F2F5',
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#DCE3E8',
  },
  symptomChipSelected: { backgroundColor: '#3498DB', borderColor: '#3498DB' },
  chipText: { fontSize: 14, color: '#2C3E50', fontWeight: '500' },
  chipTextSelected: { color: '#FFFFFF' },
  saveButton: {
    backgroundColor: '#2ECC71',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});

export default HomeScreen;
