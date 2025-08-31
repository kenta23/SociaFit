import { Colors } from '@/constants/Colors';
import { typography } from '@/constants/typography';
import { Database } from '@/database.types';
import { supabase } from '@/utils/supabase';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Checkbox from 'expo-checkbox';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const workOutDays = [
  {
    id: 1,
    name: 'Monday',
    workout: 'Chest, Shoulders, and Triceps',
  },
  {
    id: 2,
    name: 'Tuesday',
    workout: 'Back, Biceps, and Abs',
  },
  {
    id: 3,
    name: 'Wednesday',
    workout: 'Legs, Glutes, and Core',
  },
  {
    id: 4,
    name: 'Thursday',
    workout: 'Upper Body, Lower Body, and Core',
  },
  {
    id: 5,
    name: 'Friday',
    workout: 'Cardio, Strength, and Flexibility',
  },
  {
    id: 6,
    name: 'Saturday',
    workout: 'Rest Day',
  },
  {
    id: 7,
    name: 'Sunday',
    workout: 'Rest Day',
  },
];



export default function settings() {
  const colorScheme = useColorScheme() ?? 'light';
  const [openModal, setOpenModal] = useState<{ [key: number]: boolean }>({});
  const [days, setDays] = useState<any[] | null>([]);
  const [daysOfWeek, setDaysOfWeek] = useState<Database['public']['Tables']['days_of_week']['Row'][] | null>([]);
  const [workoutSplits, setWorkoutSplits] = useState<Database['public']['Tables']['workout_splits']['Row'][] | null>([]);
  const [workoutCategories, setWorkoutCategories] = useState<Database['public']['Tables']['workout_categories']['Row'][] | null>([]);
  const [categories, setCategories] = useState([
     { 
       id: 1, 
       name: 'Chest',
       checked: false,
     },
     { 
       id: 2, 
       name: 'Back',
       checked: false,
     },
     { 
       id: 3, 
       name: 'Legs',
       checked: false,
     },
     { 
       id: 4, 
       name: 'Shoulders',
       checked: false,
     },
     { 
       id: 5, 
       name: 'Arms',
       checked: false,
     },
     { 
       id: 6, 
       name: 'Core',
       checked: false,
     },
     { 
       id: 7, 
       name: 'Cardio',
       checked: false,
     },
     { 
       id: 8, 
       name: 'Rest Day',
       checked: false,
     },
     {
      id: 9,
      name: 'Flexibility',
      checked: false,
     }
  ])


  useEffect(() => { 
     const fetchWorkoutSplits = async () => {
      const user = await supabase.auth.getUser();
      const { data, error } = await supabase.from('days_of_week').select('*')
      const { data: workoutSplits, error: workoutSplitsError } = await supabase.from('workout_splits').select('*, workout_categories(*)').eq('user_id', user.data.user?.id as string);
      const { data: workoutCategories, error: workoutCategoriesError } = await supabase.from('workout_categories').select('*');

      const filteredWorkoutSplits = workoutSplits?.filter((split: any) => split.workout_id === data?.[0].id);
     
      setWorkoutSplits(filteredWorkoutSplits || []);
      setWorkoutCategories(workoutCategories || []);

      
      console.log('data', data);
      console.log('workoutSplits', workoutSplits);
      console.log('workoutCategories', workoutCategories);
   
      setDaysOfWeek(data || []);
     }


     console.log('WORKOUT DAYS', daysOfWeek);
     fetchWorkoutSplits();

  }, []);

  // const [workoutSplits, setWorkoutSplits] = useState<{ id: number, workout: string, checked: boolean }[]>([
  //   {
  //     id: 1,
  //     workout: 'Chest',
  //     checked: false,
  //   },
  //   {
  //     id: 2,
  //     workout: 'Back',
  //     checked: false,
  //   },
  //   {
  //     id: 3,
  //     workout: 'Legs',
  //     checked: false,
  //   },
  //   {
  //     id: 4,
  //     workout: 'Shoulders',
  //     checked: false,
  //   },
  //   {
  //     id: 5,
  //     workout: 'Cardio',
  //     checked: false,
  //   },
  //   {
  //     id: 6,
  //     workout: 'Rest Day',
  //     checked: false,
  //   },
  //   {
  //     id: 7,
  //     workout: 'None',
  //     checked: false,
  //   },
  // ]);


  async function handleWorkoutSplit(item: { id: number }) {
    try {
      const user = await supabase.auth.getUser();
      const selectedWorkoutDay = workoutDays?.find(day => day.id === item.id);
      const newWorkoutSplit = workoutSplits.filter(split => split.checked).map(split => split.workout).join(', ');

      console.log('SELECTED WORKOUT DAY', selectedWorkoutDay);
      console.log('NEW WORKOUT SPLIT', newWorkoutSplit);
      
      if (!selectedWorkoutDay) {
        console.error('No workout day found');
        return;
      }

      const dayColumn = selectedWorkoutDay.name.toLowerCase() as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

      const { data: existingData, error: selectError } = await supabase
        .from('workout_split')
        .select('*')
        .eq('user_id', user.data.user?.id as string) 
        .single();

      console.log('EXISTING DATA CHECK:', existingData);
      console.log('SELECT ERROR:', selectError);

      let result; 
      if (existingData) {       
        console.log('Updating existing record...');
        result = await supabase
          .from('workout_split')
          .update({
            [dayColumn]: newWorkoutSplit,
          })
          .eq('user_id', user.data.user?.id as string);
      }
      //if not exisiting data, insert new record 
      else {
        result = await supabase
          .from('workout_split')
          .insert({
            user_id: user.data.user?.id as string,
            [dayColumn]: newWorkoutSplit,
          });
      }

      console.log('SUPABASE RESULT:', result);
      console.log('DATA:', result.data); 
      console.log('ERROR:', result.error);
      console.log('STATUS:', result.status);
      console.log('STATUS TEXT:', result.statusText);

      if (result.error) {
        console.error('Supabase error:', result.error);
        return;
      }

      // Success! Update local state to reflect the change
      setWorkoutDays(prev => prev.map(day => 
        day.id === item.id 
          ? { ...day, workout: newWorkoutSplit || 'No workout selected' }
          : day
      ));

      console.log('Successfully saved workout split!');
      
    } catch (error) {
      console.error('Error in handleWorkoutSplit:', error);
    }
  }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors[colorScheme].background }} edges={["top"]}>
      <ScrollView style={styles.container}>

        <View style={{ gap: 12 }}>
          <Pressable style={[styles.profileBtn, { backgroundColor: Colors[colorScheme].frameBackground }]}>
            {/* Profile */}
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Image contentFit='cover' source={require('@/assets/images/user-default.png')} style={{ width: 50, height: 50, borderRadius: 100 }} />

              <View style={{ flexDirection: 'column', gap: 4 }}>
                <Text style={typography.heading}>My Name</Text>
                <Text style={typography.description}>Profile, Your Activity, and more</Text>
              </View>
            </View>

            {/** Icon */}
            <FontAwesome5 name="chevron-right" size={15} color={Colors[colorScheme].text} />
          </Pressable>



          {/** Settings */}
          <View style={{ gap: 4, marginVertical: 24, alignItems: 'center' }}>
            <Text style={[typography.heading, { textAlign: 'center' }]}>
              Workout split
            </Text>
            <Text style={[typography.subheading, { textAlign: 'center' }]}>Freely set your split and so we can remind you to workout</Text>
          </View>



          {/** Settings List */}
          <FlatList
            data={daysOfWeek}
            scrollEnabled={false}
            keyExtractor={(item) => item.id.toString()}
            style={{
              backgroundColor: Colors[colorScheme].frameBackground,
              padding: 12,
              borderRadius: 16,
              marginVertical: 12,
            }}
            renderItem={({ item }) => (
              <Pressable onPress={() => setOpenModal(prev => ({ ...prev, [item.id]: !prev[item.id] }))}>
                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: 6, width: '100%', marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Text>{item.name}</Text>

                    <Text style={{ color: Colors[colorScheme].text['200'] }}>
                      {workoutSplits?.find(split => split.workout_id === item.id)?.workout_categories?.name || 'None'}
                    </Text>
                   
                  </View>
                  {/**Horizontal line */}
                  <View style={{ height: 1, backgroundColor: Colors[colorScheme].text['200'], width: '100%' }} />
                </View>

                <Modal
                  animationType='fade'
                  transparent
                  visible={openModal[item.id] || false}
                  onRequestClose={() => setOpenModal(prev => ({ ...prev, [item.id]: false }))}
                >
                  <Pressable
                    style={styles.modalBackdrop}
                    onPress={() => setOpenModal(prev => ({ ...prev, [item.id]: false }))}
                  >
                    <Pressable style={[styles.modalContent, { backgroundColor: Colors[colorScheme].background }]} onPress={() => { }}>
                      <View style={styles.modalHeader}>
                        <View style={{ flexDirection: 'column', gap: 6 }}>
                          <Text style={[typography.heading,]}>Workout Split</Text>
                          <Text style={[typography.description]}>
                            Configure your workout split on {item.name}
                          </Text>
                        </View>

                        <Pressable onPress={() => setOpenModal(prev => ({ ...prev, [item.id]: false }))}>
                          <FontAwesome5 name="times" size={20} color={Colors[colorScheme].text} />
                        </Pressable>
                      </View>

                      <FlatList
                        contentContainerStyle={{ gap: 12 }}
                        style={{ flexGrow: 0 }}
                        scrollEnabled={false}
                        keyExtractor={(workoutCategory) => workoutCategory.id.toString()}
                        data={categories} 
                        renderItem={({ item: category }) => (
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Checkbox
                              value={category.checked}
                              onValueChange={() => {
                                 setCategories(prev => prev.map(cat => cat.id === category.id ? { ...category, checked: !category.checked } : cat));
                              }}
                              hitSlop={10}
                              color={category.id === workoutSplits?.find(split => split.workout_id === category.id)?.category_id ? Colors[colorScheme].green[600] : undefined}
                            />
                            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12 }}>
                              {
                                category.name
                              }
                            </Text>
                          </View>
                        )}
                      />
                      {/**Buttons */}
                      <View style={styles.buttonWrapper}>
                        <Pressable
                          style={[styles.button, { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors[colorScheme].pink['600'] }]}
                          onPress={() => setOpenModal(prev => ({ ...prev, [item.id]: false }))}
                        >
                          <Text style={[typography.description, { color: Colors[colorScheme].pink['600'] }]}>Cancel</Text>
                        </Pressable>

                        <Pressable
                          style={[styles.button, { backgroundColor: Colors[colorScheme].green[600] }]}
                          onPress={() => {
                            handleWorkoutSplit({ id: item.id });
                          }}
                        >
                          <Text style={[typography.description, { color: Colors[colorScheme].background }]}>Save</Text>
                        </Pressable>
                      </View>

                    </Pressable>
                  </Pressable>
                </Modal>
              </Pressable>
            )}
          />

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    minHeight: '100%',
    width: '100%',
    paddingHorizontal: 24,
  },
  buttonWrapper: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 'auto',
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderRadius: 16,
    paddingHorizontal: 8,
  },
  button: {
    padding: 12,
    borderRadius: 16,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    margin: 20,
    minWidth: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
});
