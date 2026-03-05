import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Profil ve Ayarlar</Text>
        <Text style={styles.subtitle}>Tema ve hesap yönetimi çok yakında burada olacak.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F2F7' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1C1C1E', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#8E8E93', textAlign: 'center' },
});

export default ProfileScreen;