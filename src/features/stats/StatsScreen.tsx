import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useRefluxStore } from '../../store/useRefluxStore';

const StatsScreen = () => {
  const navigation = useNavigation();
  const entries = useRefluxStore((state) => state.entries);

  const topSymptoms = useMemo(() => {
    const counts: { [key: string]: number } = {};
    entries.forEach(e => e.symptoms?.forEach(s => counts[s] = (counts[s] || 0) + 1));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [entries]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>❮ Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analiz Raporu</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoBox}>
          <Text style={{ fontSize: 20 }}>ℹ️</Text>
          <Text style={styles.infoText}>
            Güncellenecek :/
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{entries.length}</Text>
            <Text style={styles.statLabel}>Toplam Kayıt</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statVal, { color: '#E74C3C' }]}>
              {entries.length > 0 ? (entries.reduce((a, b) => a + b.severity, 0) / entries.length).toFixed(1) : '0'}
            </Text>
            <Text style={styles.statLabel}>Ortalama Şiddet</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>En çok belirttiğin rahatsızlıklar</Text>
        
        <View style={styles.card}>
          {topSymptoms.length > 0 ? (
            topSymptoms.map(([name, count], index) => (
              <View 
                key={name} 
                style={[styles.symptomRow, index === topSymptoms.length - 1 ? { borderBottomWidth: 0 } : {}]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 18 }}>-</Text>
                  <Text style={styles.symptomName}>{name}</Text>
                </View>
                <Text style={styles.symptomCount}>{count} kez</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Henüz yeterli semptom verisi yok.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FB' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    paddingTop: 10,
    paddingBottom: 15, 
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  backButton: { padding: 5, flexDirection: 'row', alignItems: 'center' },
  backButtonText: { fontSize: 17, color: '#007AFF', fontWeight: '500' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1C1C1E' },
  content: { padding: 20 },
  infoBox: { flexDirection: 'row', backgroundColor: '#E0F0FF', padding: 15, borderRadius: 16, marginBottom: 25, alignItems: 'center' },
  infoText: { fontSize: 13, color: '#005BB5', marginLeft: 12, flex: 1, lineHeight: 18, fontWeight: '500' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 24, width: '48%', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  statVal: { fontSize: 32, fontWeight: '800', color: '#007AFF' },
  statLabel: { fontSize: 13, color: '#8E8E93', marginTop: 5, fontWeight: '600' },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#1C1C1E', marginBottom: 15, letterSpacing: -0.5 },
  card: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  symptomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  symptomName: { fontSize: 16, color: '#1C1C1E', marginLeft: 12, fontWeight: '600' },
  symptomCount: { fontSize: 15, color: '#007AFF', fontWeight: '800' },
  emptyText: { textAlign: 'center', color: '#8E8E93', fontStyle: 'italic', paddingVertical: 20 }
});

export default StatsScreen;