import { Colors } from '@/constants/Colors';
import { typography } from '@/constants/typography';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Image } from 'expo-image';
import React from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
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
  return (
    <SafeAreaView edges={["top"]}>
      <ScrollView style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background },
      ]}
      >
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
            data={workOutDays}
            scrollEnabled={false}
            keyExtractor={(item) => item.id.toString()}
            style={{
              backgroundColor: Colors[colorScheme].frameBackground,
              padding: 12,
              borderRadius: 16,
              marginVertical: 12,
            }}
            renderItem={({ item }) => (
              <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: 6, width: '100%', marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <Text>{item.name}</Text>
                  {/**Horizontal line */}
                  <Text style={{ color: Colors[colorScheme].text['200'] }}>
                    {item.workout}
                  </Text>
                </View>
                <View style={{ height: 1, backgroundColor: Colors[colorScheme].text['200'], width: '100%'}} />
              </View>
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
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderRadius: 16,
    paddingHorizontal: 8,
  }
})