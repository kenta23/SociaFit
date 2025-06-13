import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Streaks() {
  
  const streakDescription = (count: number): string => { 
     if(count === 0) { 
         return "Start your streak today!"
     }
     else if (count === 1) { 
        return `You made straight ${count} streak, keep it up!`
     }
     else if (count >= 5) { 
        return `You made straight ${count} streaks, keep it up!`
     }
     else { 
        return `You made straight ${count} streaks, keep it up!`
     }
  }

  return (
    <View style={styles.frameParent}>
      <View style={styles.frameWrapper}>
        <View style={styles.mdifireParent}>
          <Image contentFit='contain' source={require('@/assets/images/mdi_fire.svg')} style={styles.mdifireIcon}/>
          <Text style={styles.streakCount}>49</Text>
        </View>
      </View>
      <Text style={styles.description}>
        You made straight 49 streaks, keep it up!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mdifireIcon: {
    width: "100%",
    height: 74,
  },
  streakCount: {
    alignSelf: "stretch",
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Inter-Bold",
    color: "#e35420",
    textAlign: "center",
  },
  mdifireParent: {
    position: "absolute",
    marginTop: -53,
    marginLeft: -44,
    top: "50%",
    left: "50%",
    width: 88,
    gap: 4,
    alignItems: "center",
  },
  frameWrapper: {
    borderRadius: 100,
    backgroundColor: "#54ee69",
    width: 150,
    height: 150,
    overflow: "hidden",
  },
  description: {
    fontSize: 20,
    fontFamily: "Inter-Regular",
    color: "#000",
    width: 304,
    textAlign: "center",
  },
  frameParent: {
    flex: 1,
    width: "100%",
    gap: 17,
    alignItems: "center",
  },
});
    