import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { Database } from '@/database.types';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useStoreData, useStoreHealthDetails, useStoreWorkoutSplits } from '@/utils/states';
import { supabase } from '@/utils/supabase';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, Pressable } from 'react-native';

type WorkoutSplitType = (Database['public']['Tables']['workout_splits']['Row'] & { workout_days: Database['public']['Tables']['workout_days']['Row'] } & { workout_categories: Database['public']['Tables']['workout_categories']['Row']})[];


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { storeData, data } = useStoreData();
  const { categories, setCategories, workoutSplits, setWorkoutSplits} = useStoreWorkoutSplits();
  const { healthDetails, setHealthDetails } = useStoreHealthDetails();


  console.log('data from zustand', data);


  useEffect(() => {
      async function getData() { 
        const user = await supabase.auth.getUser();
  

        if(user.data.user?.id) {          
          const { data, error } = await supabase.from('userdata').select('*').eq('user_id', user.data.user?.id as string).single();
          const { data: splits, error: workoutSplitsError } = await supabase
          .from('workout_splits')
          .select(`
            *,
            workout_days(*),
            workout_categories(*)
          `).eq('workout_days.user_id', user.data.user?.id as string);
          setWorkoutSplits(splits as WorkoutSplitType);
    
    
        const { data: categories, error: workoutCategoriesError } = await supabase
          .from('workout_categories')
          .select('*');
        // Initialize categories with checked status based on existing workout splits
        if (categories) {
          setCategories(categories as (Database['public']['Tables']['workout_categories']['Row'][]));
        }
        const { data: healthDetails, error: healthDetailsError } = await supabase.from('health_details').select('*').eq('user_id', user.data.user?.id as string).single();
       
        if(healthDetails) { 
          setHealthDetails(healthDetails as Database['public']['Tables']['health_details']['Row']);
        }
          if(data) { 
            storeData(data);
          }
          if(error) { 
            console.log('error', error);
          }
        }
      }

      getData();
  }, [])

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
          headerShown: true,  
          headerBackButtonDisplayMode: 'default',
          headerLeft: () => <Pressable style={{ marginLeft: 8 }} onPress={() => router.back()}><Image source={require('@/assets/back button.svg')} style={{ width: 26, height: 26 }} /></Pressable>,
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
