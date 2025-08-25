import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable } from 'react-native';




export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

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
            height: 75,
            backgroundColor: '#191B1A',
          },
        }),
        tabBarLabelStyle: {
          fontFamily: 'Inter_400Regular',
          fontSize: 12,
        },
        tabBarLabelPosition: 'below-icon'
      }}>
      {/** Home */}
       <Tabs.Screen 
         name="index"
         options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={22}  name="house.fill" color={color} />,
         }}
       />

       {/**Feeds */}
       <Tabs.Screen 
        name="feeds"
        options={{
          title: 'Feeds',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="newspaper-variant-outline" size={22} color={color} />,
        }}
      />

      {/**History */}
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <FontAwesome5 name="history" size={22} color={color} />,
        }}
      />


   {/**Settings */}
       <Tabs.Screen 
       name="settings"
       options={{
        title: 'Settings',
        headerShown: true,  
        headerBackButtonDisplayMode: 'default',
        headerLeft: () => <Pressable style={{ marginLeft: 8 }} onPress={() => router.back()}><Image source={require('@/assets/back button.svg')} style={{ width: 26, height: 26 }} /></Pressable>,
        tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={22} color={color} />,
       }} />

    </Tabs>
  );
}
