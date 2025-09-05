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

const sampledata =[
  {
    "category_id": 2,
    "created_at": "2025-09-01T12:51:53.122996",
    "id": 1,
    "workout_categories": {
      "category": "strength",
      "created_at": "2025-08-31T10:40:23.182744",
      "id": 2,
      "name": "Back"
    },
    "workout_id": 1
  },
  {
    "category_id": 5,
    "created_at": "2025-09-01T12:52:37.71055",
    "id": 2,
    "workout_categories": {
      "category": "strength",
      "created_at": "2025-08-31T10:40:23.182744",
      "id": 5,
      "name": "Arms"
    },
    "workout_id": 1
  },
  {
    "category_id": 5,
    "created_at": "2025-09-03T12:13:52.26582",
    "id": 4,
    "workout_categories": {
      "category": "strength",
      "created_at": "2025-08-31T10:40:23.182744",
      "id": 5,
      "name": "Arms"
    },
    "workout_id": 5
  },
  {
    "category_id": 7,
    "created_at": "2025-09-03T12:14:38.352767",
    "id": 6,
    "workout_categories": {
      "category": "cardio",
      "created_at": "2025-08-31T10:40:23.182744",
      "id": 7,
      "name": "Cardio"
    },
    "workout_id": 1
  }
]

 const sampledata2 =[ 
   { 
     "category_id": 2,
     "created_at": "2025-09-01T12:51:53.122996", 
     "id": 1, 
     "workout_categories": {
       "category": "strength", 
       "created_at": "2025-08-31T10:40:23.182744", 
       "id": 2, 
       "name": "Back" 
    }, 
    "workout_id": 1 
  }, 
  { 
    "category_id": 5, 
    "created_at": "2025-09-01T12:52:37.71055", 
    "id": 2, 
    "workout_categories": null, 
    "workout_id": 1 
  }, 
  { 
    "category_id": 5, 
    "created_at": "2025-09-03T12:13:52.26582", 
    "id": 4, 
    "workout_categories": null, 
    "workout_id": 5 
  }, 
  {
     "category_id": 7, 
     "created_at": "2025-09-03T12:14:38.352767", 
     "id": 6, 
     "workout_categories": null, 
     "workout_id": 1 
    }
  ]



  //updating workout split 
  //1. check workout split 
  //2. store to a state 
  //3. update the database

export default function settings() {
  const colorScheme = useColorScheme() ?? 'light';
  const [openModal, setOpenModal] = useState<{ [key: number]: boolean }>({});
  const [days, setDays] = useState<any[] | null>([]);
  const [daysOfWeek, setDaysOfWeek] = useState([
    {
      id: 1,
      name: 'Monday',
    },
    {
      id: 2,
      name: 'Tuesday',
    },
    {
      id: 3,
      name: 'Wednesday',
    },
    {
      id: 4,
      name: 'Thursday',
    },
    {
      id: 5,
      name: 'Friday',
    },
    {
      id: 6,
      name: 'Saturday',
    },
    {
      id: 7,
      name: 'Sunday',
    },
  ]);

  const [workoutSplits, setWorkoutSplits] = useState<any[] | null>([]);
  const [workoutCategories, setWorkoutCategories] = useState<Database['public']['Tables']['workout_categories']['Row'][] | null>([]);
  const [storeWorkoutSplit, setStoreWorkoutSplit] = useState<{id: number, checked: boolean}[]>([]);


  const fetchWorkoutSplits = async () => {
    const user = await supabase.auth.getUser();
    // Query workout_splits with related workout_categories
    const { data: splits, error: workoutSplitsError } = await supabase
      .from('workout_splits')
      .select(`
        *,
        workout_days(*),
        workout_categories(*)
      `).eq('workout_days.user_id', user.data.user?.id as string);



    const { data: categories, error: workoutCategoriesError } = await supabase
      .from('workout_categories')
      .select('*');

    setWorkoutSplits(splits as any);

    // Initialize categories with checked status based on existing workout splits
    if (categories) {
      setWorkoutCategories(categories);
    }

    console.log('workoutSplits', workoutSplits);
    console.log('ERROR', workoutSplitsError);
  }


  useEffect(() => {
    fetchWorkoutSplits();
  }, []);



  async function handleWorkoutSplit({ workoutId }: { workoutId: number }) {
    try {
      const user = await supabase.auth.getUser();
     
      console.log('workoutId', workoutId);

    console.log('new work out splits', storeWorkoutSplit);
    const newWorkoutSplits = storeWorkoutSplit.map(item => item.id);

    // First, get or create the workout day
    const { data: upSertWorkoutDay } = await supabase
      .from('workout_days')
      .upsert({ 
         day: workoutId,
         user_id: user.data.user?.id as string
      }, { onConflict: 'day, user_id' }).eq('user_id', user.data.user?.id as string).eq('day', workoutId).select('*').single();

    console.log('upSertWorkoutDay', upSertWorkoutDay);
      
    if (upSertWorkoutDay) {
        const workoutDay = upSertWorkoutDay.id;

     // Insert new workout splits
    const workoutSplitInserts = newWorkoutSplits.map(categoryId => ({
      category_id: categoryId,
      workout_id: workoutDay
    }));
  
    const { data: newWorkoutSplitsData, error: newWorkoutSplitsError } = await supabase.from('workout_splits').upsert(workoutSplitInserts, { onConflict: 'category_id, workout_id' });

    
    console.log('new workout splits', newWorkoutSplitsData);
    console.log('new workout splits error', newWorkoutSplitsError);

    setOpenModal(prev => ({ ...prev, [workoutId]: false }));
    setStoreWorkoutSplit([]);

    fetchWorkoutSplits();
  }
    } catch (error) {
      console.error('Error in handleWorkoutSplit:', error);
    }
}

console.log('STORE WORKOUT SPLIT', storeWorkoutSplit);


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
              <Pressable onPress={() => {
                // Initialize storeWorkoutSplit with existing data when opening modal
                const existingSplits = workoutSplits?.filter(split => split.workout_days?.day === item.id) || [];
                const initialChecked = existingSplits.map(split => ({
                  id: split.workout_categories?.id!,
                  checked: true
                }));
                setStoreWorkoutSplit(initialChecked);
                setOpenModal(prev => ({ ...prev, [item.id]: !prev[item.id] }));
              }}>
                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: 6, width: '100%', marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Text>{item.name}</Text>

                    <Text style={{ color: Colors[colorScheme].text['200'] }}>
                      {(() => {
                        const splits = workoutSplits?.filter(split => split.workout_days?.day === item.id);

                        if (splits && splits.length > 0) {
                          const categoryNames = splits
                            .map(split => split.workout_categories?.name)
                            .filter(Boolean)
                            .join(', ');
                          return categoryNames;
                        }
                        return 'None';
                      })()}
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

                        <Pressable onPress={() => {
                          setStoreWorkoutSplit([]); // Clear state when closing modal
                          setOpenModal(prev => ({ ...prev, [item.id]: false }));
                        }}>
                          <FontAwesome5 name="times" size={20} color={Colors[colorScheme].text} />
                        </Pressable>
                      </View>

                      <FlatList
                        contentContainerStyle={{ gap: 12 }}
                        style={{ flexGrow: 0 }}
                        scrollEnabled={false}
                        keyExtractor={(workoutCategory) => workoutCategory.id.toString()}
                        data={workoutCategories}
                        renderItem={ ({ item: category, index }) => (
                         

                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Checkbox
                              value={storeWorkoutSplit.some(split => split.id === category.id) || false}
                              onValueChange={(checked) => {
                                console.log('category', category, 'checked:', checked);
                                console.log('workoutday', item.id);

                                setStoreWorkoutSplit(prev => {
                                  const exists = prev.some(split => split.id === category.id);

                                  if (checked && !exists) {
                                    // Add to state if checked and not already present
                                    return [...prev, { id: category.id, checked: true }];
                                  } else if (!checked && exists) {
                                    // Remove from state if unchecked and present
                                    return prev.filter(split => split.id !== category.id);
                                  }
                                  return prev; // No change needed
                                });  
                              }}
                              hitSlop={12}
                              color={storeWorkoutSplit.some(split => split.id === category.id) ? Colors[colorScheme].green[600] : undefined}
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
                          onPress={() => {
                            setStoreWorkoutSplit([]); // Clear state when canceling
                            setOpenModal(prev => ({ ...prev, [item.id]: false }));
                          }}
                        >
                          <Text style={[typography.description, { color: Colors[colorScheme].pink['600'] }]}>Cancel</Text>
                        </Pressable>

                        <Pressable
                          style={[styles.button, { backgroundColor: Colors[colorScheme].green[600] }]}
                          onPress={() => handleWorkoutSplit({ workoutId: item.id })}
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
