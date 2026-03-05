import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { RefluxEntry } from '../types';
import moment from 'moment';
import { useRefluxStore } from '../store/useRefluxStore'; // Store'u ekledik

interface Props {
  entry: RefluxEntry;
  onEdit: (entry: RefluxEntry) => void;
}

const RefluxEntryCard = ({ entry, onEdit }: Props) => {
  const { deleteEntry } = useRefluxStore(); // Silme fonksiyonunu çekiyoruz

  const getSeverityColor = (severity: number) => {
    if (severity <= 2) return '#34C759';
    if (severity === 3) return '#FF9500';
    return '#FF3B30';
  };

  const severityColor = getSeverityColor(entry.severity);

  // Silme onayı penceresi
  const handleDelete = () => {
    Alert.alert(
      "Kaydı Sil",
      "bu öğünü silmek istediğinden emin misin?",
      [
        { text: "Vazgeç", style: "cancel" },
        { 
          text: "Sil", 
          style: "destructive", 
          onPress: () => deleteEntry(entry.id) 
        }
      ]
    );
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onEdit(entry)} 
      activeOpacity={0.7}
    >
      <View style={styles.headerContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.mealText} numberOfLines={1} ellipsizeMode="tail">
            {entry.meal}
          </Text>
          <Text style={styles.timeText}>{moment(entry.timestamp).format('HH:mm')}</Text>
        </View>
        
        {/* SİLME BUTONU - Sağ Üste Eklendi */}
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Text style={{ fontSize: 18 }}>d</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.symptomsContainer}>
        {entry.symptoms && entry.symptoms.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.symptomsScrollContent}
          >
            {entry.symptoms.map((symptom, idx) => (
              <View key={idx} style={styles.symptomBadge}>
                <Text style={styles.symptomBadgeText}>{symptom}</Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noSymptomText}>Semptom belirtilmedi</Text>
        )}
      </View>
      
      <View style={styles.footer}>
        <View style={[styles.severityDot, { backgroundColor: severityColor }]} />
        <Text style={styles.severityLabel}>Rahatsızlık Seviyesi:</Text>
        <Text style={styles.severityValue}>{entry.severity}/5</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { 
    backgroundColor: '#FFFFFF',
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 12, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E5EA', 
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  mealText: { 
    fontSize: 17, 
    fontWeight: '600', 
    color: '#1C1C1E',
    letterSpacing: -0.3,
  },
  timeText: { 
    fontSize: 12, 
    color: '#8E8E93', 
    fontWeight: '500',
    marginTop: 2,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 10,
  },
  symptomsContainer: {
    height: 28, 
    marginBottom: 12,
    justifyContent: 'center',
  },
  symptomsScrollContent: { 
    alignItems: 'center',
  },
  symptomBadge: { 
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 12, 
    marginRight: 6, 
  },
  symptomBadgeText: { 
    fontSize: 12, 
    color: '#636366', 
    fontWeight: '500',
  },
  noSymptomText: {
    fontSize: 12,
    color: '#AEAEB2',
    fontStyle: 'italic',
  },
  footer: { 
    flexDirection: 'row', 
    alignItems: 'center',
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  severityLabel: {
    fontSize: 13,
    color: '#8E8E93',
    marginRight: 4,
  },
  severityValue: { 
    fontSize: 13,
    fontWeight: '700', 
    color: '#1C1C1E',
  },
});

export default RefluxEntryCard;