import StepsCount from '@/components/home/stepsCount';
import { Colors } from '@/constants/Colors';
import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';


  return (
    <SafeAreaView edges={["top"]}>
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme].background },
        ]}
      >
        {/**User Profile */}
        <View style={{ marginTop: 16}}>
          <Pressable style={styles.frameParent} onPress={() => {}}>
            <Image
              source={require('@/assets/images/user-default.png')}
              contentFit='cover'
              style={styles.userImage}
            />
            <Text style={[styles.user, { color: Colors[colorScheme].text['0'] }]}>Hello Rusty Miguel!</Text>
          </Pressable>
        </View>

        {/**Steps Count */}
        <StepsCount />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
 container: { 
    minHeight: '100%',
    width: '100%',
    paddingHorizontal: 16,
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
