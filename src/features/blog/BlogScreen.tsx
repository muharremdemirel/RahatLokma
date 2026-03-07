import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Kategori Listemiz 
const CATEGORIES = ['Tümü', 'Tarifler', 'İpuçları', 'Tetikleyiciler'];

// Örnek blog yazıları şu an için statik. İleride veri tabanından çekeceğiz burayı
const BLOG_POSTS = [
  {
    id: '1',
    category: 'İpuçları',
    title: 'Mideyi Rahatlatan 5 Mucizevi Bitki Çayı',
    readTime: '3 dk okuma',
    icon: '🫖',
    color: '#E5F1FF', 
  },
  {
    id: '2',
    category: 'Tarifler',
    title: 'Reflü Dostu, Mideyi Yormayan Kahvaltı',
    readTime: '5 dk okuma',
    icon: '🍳',
    color: '#E8F8F5', 
  },
  {
    id: '3',
    category: 'Tetikleyiciler',
    title: 'Kahve Tüketimi Reflüyü Nasıl Etkiler?',
    readTime: '4 dk okuma',
    icon: '🧂',
    color: '#FDEDEC', 
  },
  {
    id: '4',
    category: 'İpuçları',
    title: 'Uyumadan Önce Dikkat Etmeniz Gerekenler',
    readTime: '2 dk okuma',
    icon: '🛌',
    color: '#F4ECF7', 
  },
];

const BlogScreen = () => {
  const [activeCategory, setActiveCategory] = useState('Tümü');

  // Kategoriye göre yazıları filtreleme
  const filteredPosts = activeCategory === 'Tümü' 
    ? BLOG_POSTS 
    : BLOG_POSTS.filter(post => post.category === activeCategory);

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Keşfet</Text>
      <Text style={styles.subtitle}>Miden için faydalı içerikler.</Text>
      
      {/* Kategoriler (Yatay Scroll) */}
      <View style={styles.categoriesWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoriesContent}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.categoryChip, 
                activeCategory === item && styles.activeCategoryChip
              ]}
              onPress={() => setActiveCategory(item)}
            >
              <Text style={[
                styles.categoryText, 
                activeCategory === item && styles.activeCategoryText
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} activeOpacity={0.7}>
              <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                <Text style={styles.icon}>{item.icon}</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardCategory}>{item.category.toUpperCase()}</Text>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.cardFooter}>{item.readTime}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7', 
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1C1C1E',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 4,
    fontWeight: '500',
    marginBottom: 20,
  },
  categoriesWrapper: {
    marginHorizontal: -20, 
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 20,
    marginRight: 10,
  },
  activeCategoryChip: {
    backgroundColor: '#007AFF', 
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A3A3C',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120, 
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 32,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 6,
    lineHeight: 22,
  },
  cardFooter: {
    fontSize: 13,
    color: '#AEAEB2',
    fontWeight: '500',
  },
});

export default BlogScreen;