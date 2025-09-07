import DistanceMap from '@/components/home/distance';
import StepsCount from '@/components/home/stepsCount';
import Streaks from '@/components/home/streaks';
import WorkoutTips from '@/components/home/tips';
import WorkoutSchedule from '@/components/home/workoutschedule';
import { Colors } from '@/constants/Colors';
import { typography } from '@/constants/typography';
import { containerStyles } from '@/utils/styles';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors[colorScheme].background }} edges={["top"]}>
      <ScrollView style={containerStyles.container}
      >
        {/**User Profile */}
        <View style={{ marginTop: 16 }}>
          <Pressable
            style={styles.frameParent}
            onPress={() => router.push("/profile")}
          >
            <Image
              source={require("@/assets/images/user-default.png")}
              contentFit="cover"
              style={styles.userImage}
            />
            <Text
              style={[typography.subheading, { color: Colors[colorScheme].text["0"] }]}
            >
              Hello Rusty Miguel!
            </Text>
          </Pressable>
        </View>

        <View style={{ marginTop: 2, gap: 32, alignItems: "center" }}>
          {/**Steps Count */}
          <StepsCount />

          {/**Distance */}
          <DistanceMap />

          {/**Streaks */}
          <Streaks />

          {/**Workout Schedule */}
          <WorkoutSchedule />

          {/**Workout Tips */}
          <WorkoutTips />
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
 userImage: {
  borderRadius: 100,
  width: 40,
  height: 40,
  },
user: {
  fontSize: 14,
  textAlign: "left",
  fontFamily: 'Inter_400Regular'
  },
frameParent: {
  flex: 1,
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  gap: 12
  }
});
