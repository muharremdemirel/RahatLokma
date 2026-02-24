import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Utensils, Clock, AlertTriangle, Activity } from 'lucide-react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useRefluxStore } from '../store/useRefluxStore';
import { RefluxEntry } from '../types';

interface Props {
  entry: RefluxEntry;
  onEdit: (entry: RefluxEntry) => void;
}

const RefluxEntryCard: React.FC<Props> = ({ entry, onEdit }) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const deleteEntry = useRefluxStore(state => state.deleteEntry);

  const timeString = new Date(entry.timestamp).toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const getSeverityColor = (val: number) => {
    if (val <= 2) return '#27AE60';
    if (val <= 4) return '#F39C12';
    return '#E74C3C';
  };

  const onOpenMenu = () => {
    const options = ['Düzenle', 'Sil', 'Vazgeç'];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      { options, destructiveButtonIndex, cancelButtonIndex },
      (selectedIndex?: number) => {
        if (selectedIndex === 0) {
          onEdit(entry);
        } else if (selectedIndex === 1) {
          Alert.alert('Kaydı Sil', 'Bu kaydı silmek istiyor musun?', [
            { text: 'Vazgeç', style: 'cancel' },
            {
              text: 'Sil',
              style: 'destructive',
              onPress: () => deleteEntry(entry.id),
            },
          ]);
        }
      },
    );
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onLongPress={onOpenMenu}
      activeOpacity={0.7}
    >
      {/* Yemek ve aat  kısmı*/}
      <View style={styles.topRow}>
        <View style={styles.mealInfo}>
          <Utensils size={18} color="#3498DB" strokeWidth={2.5} />
          <Text style={styles.mealText} numberOfLines={1}>
            {entry.meal}
          </Text>
        </View>
        <View style={styles.timeInfo}>
          <Clock size={14} color="#95A5A6" />
          <Text style={styles.timeText}>{timeString}</Text>
        </View>
      </View>

      {/* Semptom satırı */}
      {entry.symptoms && entry.symptoms.length > 0 && (
        <View style={styles.symptomsWrapper}>
          <Activity size={12} color="#7F8C8D" style={{ marginRight: 4 }} />
          <View style={styles.symptomsList}>
            {entry.symptoms.map((s, idx) => (
              <Text key={idx} style={styles.symptomTag}>
                {s}
                {idx < entry.symptoms.length - 1 ? ', ' : ''}
              </Text>
            ))}
          </View>
        </View>
      )}

      <View style={styles.bottomRow}>
        <View
          style={[
            styles.severityBadge,
            { backgroundColor: getSeverityColor(entry.severity) + '15' },
          ]}
        >
          <AlertTriangle size={14} color={getSeverityColor(entry.severity)} />
          <Text
            style={[
              styles.severityText,
              { color: getSeverityColor(entry.severity) },
            ]}
          >
            Şiddet: {entry.severity}/5
          </Text>
        </View>
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
    borderWidth: 1,
    borderColor: '#EBF0F3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  mealInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  mealText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2C3E50',
    marginLeft: 8,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 13,
    color: '#95A5A6',
    marginLeft: 4,
    fontWeight: '500',
  },
  symptomsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingLeft: 2,
  },
  symptomsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  symptomTag: {
    fontSize: 13,
    color: '#7F8C8D',
    fontStyle: 'italic',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  severityText: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
});

export default RefluxEntryCard;
