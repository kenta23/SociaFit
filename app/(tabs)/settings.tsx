import { Colors } from '@/constants/Colors';
import { typography } from '@/constants/typography';
import { Database } from '@/database.types';
import { supabase } from '@/utils/supabase';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import BottomSheet from '@gorhom/bottom-sheet';
import Checkbox from 'expo-checkbox';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScrollableBottomSheet from '../scrollable-bottomsheet';




export default function settings() {
  const colorScheme = useColorScheme() ?? 'light';
  const [openModal, setOpenModal] = useState<{ [key: number]: boolean }>({});
  const [daysOfWeek] = useState([
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

  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);


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


  async function handleWorkoutDay({workoutDayId, workoutId}: { workoutDayId: number, workoutId: number }) { 
     try {

      console.log('new work out splits', storeWorkoutSplit);
      const filteredWorkoutSplits = storeWorkoutSplit.filter(item => item.checked).map(item => item.id); //only includes item with check marked and just return the id
      
      const workoutDay = workoutDayId;


      const { data: oldWorkoutSplits, error: oldWorkoutSplitsError } = await supabase.from('workout_splits').select('*').eq('workout_id', workoutDay);
      console.log('OLD WORKOUT SPLITS', oldWorkoutSplits);

      const existingSplits = oldWorkoutSplits?.some(split => filteredWorkoutSplits.includes(split.category_id as number)); //checking if no exisiting workout splits 

      console.log('existingSplits', existingSplits);

              console.log('filteredWorkoutSplits', filteredWorkoutSplits);
              const checkUnmatchedWorkoutSplits = oldWorkoutSplits?.length && oldWorkoutSplits.filter(split => !filteredWorkoutSplits.includes(split.category_id as number)) || [];
    
              console.log('checkUnmatchedWorkoutSplits', checkUnmatchedWorkoutSplits);
              // Insert new workout splits
              const workoutSplitInserts = filteredWorkoutSplits.map(categoryId => ({
                category_id: categoryId,
                workout_id: workoutDay
              }));


             if (checkUnmatchedWorkoutSplits.length) { 
                const { data: deleteWorkoutSplits, error: deleteWorkoutSplitsError } = await supabase
                .from('workout_splits')
                .delete()
                .in('category_id', checkUnmatchedWorkoutSplits.map(item => item.category_id as number))
                .eq('workout_id', workoutDay)
                .select('*');

                console.log('DELETED WORKOUT SPLITS', deleteWorkoutSplits);
                console.log('ERROR deleteWorkoutSplitsError', deleteWorkoutSplitsError);

                setOpenModal(prev => ({ ...prev, [workoutId]: false }));
                setStoreWorkoutSplit([]);
                Alert.alert('Success!', 'Deleted one record');
              }

              else { 
                const { data: newWorkoutSplitsData, error: newWorkoutSplitsError } = await supabase
                .from('workout_splits')
                .upsert(workoutSplitInserts, { onConflict: 'category_id, workout_id' })
                .select('*');
    
    
              console.log('NEW WORKOUT SPLITS', newWorkoutSplitsData);
    
              if (newWorkoutSplitsData) {
                Alert.alert('Success!', 'Saved')
    
                setOpenModal(prev => ({ ...prev, [workoutId]: false }));
                setStoreWorkoutSplit([]);

              }
    
              if (newWorkoutSplitsError) {
                Alert.alert('Error!', newWorkoutSplitsError.message);
              }
        }

                        
         fetchWorkoutSplits();
     } catch (error) {
      Alert.alert('Error!', 'Something went wrong');
     }
}



  async function handleWorkoutSplit({ workoutId }: { workoutId: number }) {
    try {
      const user = await supabase.auth.getUser();

      console.log('workoutId', workoutId);

      console.log('new work out splits', storeWorkoutSplit);
      let workoutDay;

      //first, check if the workout day exists
      const { data: checkExistingWorkoutDay, error: workoutDayError } = await supabase
            .from('workout_days')
            .select('*')
            .eq('day', workoutId)
            .eq('user_id', user.data.user?.id as string)
            .single();

     if (checkExistingWorkoutDay)  { 
        workoutDay = checkExistingWorkoutDay.id;
     }

     else { 
        // second, get or create the workout day
      const { data: newWorkoutDay } = await supabase
      .from('workout_days')
      .upsert({
        day: workoutId,
        user_id: user.data.user?.id as string
      }, { onConflict: 'day, user_id' }).eq('user_id', user.data.user?.id as string).eq('day', workoutId).select('*').single();

       if (newWorkoutDay) workoutDay = newWorkoutDay.id;
     }

      if (workoutDay) {
          handleWorkoutDay({ workoutDayId: workoutDay, workoutId: workoutId });
      }
      else { 
        Alert.alert('Error!', 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Error!', 'Something went wrong');
    }
  }

console.log('STORE WORKOUT SPLIT', storeWorkoutSplit);
console.log('workout categories', workoutCategories);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors[colorScheme].background }} edges={["top"]}>
      <GestureHandlerRootView>
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
                            if (splits.length > 4) {
                              let slicedSplits = splits.slice(0, 4);
                              return slicedSplits.map(split => split.workout_categories?.name).filter(Boolean).join(', ').trim() + '...';
                            }
                            else {
                              return splits.map(split => split.workout_categories?.name).filter(Boolean).join(', ').trim();
                            }
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
                          renderItem={({ item: category, index }) => (


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

            {/**Other settings */}

            <View style={{ gap: 4, alignItems: 'flex-start' }}>
              <Text style={[typography.heading, { textAlign: 'left' }]}>
                Others
              </Text>
            </View>

            <FlatList
              data={['Health Details', 'Change Step Goal', 'Unit Measure']}
              scrollEnabled={false}
              style={{
                backgroundColor: Colors[colorScheme].frameBackground,
                padding: 12,
                borderRadius: 16,
                marginVertical: 12,
              }}
              renderItem={({ item }) => {
                let route = '';
                switch (item) {
                  case 'Health Details':
                    route = '/settings/health-details';
                    break;
                  case 'Change Step Goal':
                    route = '/settings/change-step-goal';
                    break;
                  case 'Unit Measure':
                    route = '/settings/unit-measure';
                    break;
                  default:
                    route = '/settings';
                }


                return (
                  <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: 8, width: '100%', marginBottom: 12 }}>
                    <Link href={route as any}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <Text>{item}</Text>
                      </View>

                      {/**Horizontal line */}
                      <View style={{ height: 1, backgroundColor: Colors[colorScheme].text['200'], width: '100%' }} />

                    </Link>
                  </View>

                )
              }
              }
            />


            <ScrollableBottomSheet />
          </View>
        </ScrollView>
        </GestureHandlerRootView>
      </SafeAreaView>

  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
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
