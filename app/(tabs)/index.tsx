import DistanceMap from '@/components/home/distance';
import StepsCount from '@/components/home/stepsCount';
import Streaks from '@/components/home/streaks';
import { Colors } from '@/constants/Colors';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();


  return (
    <SafeAreaView edges={["top"]}>
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme].background },
        ]}
      >
        {/**User Profile */}
        <View style={{ marginTop: 16 }}>
          <Pressable
            style={styles.frameParent}
            onPress={() => router.push("/login")}
          >
            <Image
              source={require("@/assets/images/user-default.png")}
              contentFit="cover"
              style={styles.userImage}
            />
            <Text
              style={[styles.user, { color: Colors[colorScheme].text["0"] }]}
            >
              Hello Rusty Miguel!
            </Text>
          </Pressable>
        </View>

        <View style={{ marginTop: 2, gap: 24, alignItems: "center" }}>
          {/**Steps Count */}
          <StepsCount />

          {/**Distance */}
          <DistanceMap />

          {/**Streaks */}
          <Streaks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
 container: { 
    minHeight: '100%',
    width: '100%',
    paddingHorizontal: 24,
  },
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
