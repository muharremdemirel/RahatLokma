import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet, Platform, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';

// Sayfalar
import HomeScreen from '../features/home/HomeScreen';
import StatsScreen from '../features/stats/StatsScreen';
import BlogScreen from '../features/blog/BlogScreen';
import ProfileScreen from '../features/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const RootNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarTransparent: true, 
        
        tabBarBackground: () => (
          <View style={StyleSheet.absoluteFill}>
            {/* HomeScreen'deki blur ile aynı tip ve miktar */}
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType="light"
              blurAmount={15} 
            />
            {/* HomeScreen arka planı ile aynı renk (Opacity biraz daha yüksek) */}
            <View 
              style={[
                StyleSheet.absoluteFill, 
                { backgroundColor: 'rgba(242, 242, 247, 0.7)' } 
              ]} 
            />
          </View>
        ),

        tabBarIcon: ({ focused }) => {
          let icon = '';
          if (route.name === 'Kayıtlar') icon = 'a';
          else if (route.name === 'Analiz') icon = 'b';
          else if (route.name === 'Blog') icon = 'c';
          else if (route.name === 'Profil') icon = 'P';
          
          return (
            <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.4 }}>
              {icon}
            </Text>
          );
        },
        
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 70 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
        },
      })}
    >
      <Tab.Screen name="Kayıtlar" component={HomeScreen} />
      <Tab.Screen name="Analiz" component={StatsScreen} />
      <Tab.Screen name="Blog" component={BlogScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default RootNavigator;