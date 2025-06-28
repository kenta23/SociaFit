import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';




export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab, 
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {
            height: 70,
            backgroundColor: '#191B1A',
          },
        }),
        tabBarLabelStyle: {
          fontFamily: 'Inter_400Regular',
          fontSize: 12,
          lineHeight: 16,
        },
        tabBarLabelPosition: 'below-icon'
      }}>
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <FontAwesome5 name="history" size={28} color={color} />,
        }}
      />
      <Tabs.Screen 
        name="feeds"
        options={{
          title: 'Feeds',
          tabBarIcon: ({ color }) => <FontAwesome name="feed" size={28} color={color} />,
        }}
      />
      <Tabs.Screen 
         name="index"
         options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28}  name="house.fill" color={color} />,
         }}
       />
       <Tabs.Screen 
       name="Home"
       options={{
        title: 'Home',
       }} />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
