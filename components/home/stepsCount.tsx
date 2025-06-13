import { Colors } from '@/constants/Colors';
import { Image } from 'expo-image';
import { Pedometer } from 'expo-sensors';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import StepsAndCalories from './stepsAndCalories';
interface StepData {
  value: number;
  color: string;
}

interface StepsCountProps {
  totalSteps?: number;
  currentSteps?: number;
  targetSteps?: number;
}

export default function StepsCount() {
    const [currentSteps] = useState(300);
    const [targetSteps] = useState(2700);
    const colorScheme = useColorScheme() ?? 'light';
    const footstepsIcon = colorScheme === 'dark' ? require('@/assets/images/footsteps-dark.svg') : require('@/assets/images/footsteps.svg');
    const [pastStepCount, setPastStepCount] = useState(0);

    const [stepsCountData] = useState<StepData[]>([
        {value: 70, color: Colors[colorScheme].primary},
        {value: 30, color: 'lightgray'}
    ]);

    const watchSteps = async () => {
       const PedometerIsAvailable = await Pedometer.isAvailableAsync();

       if (PedometerIsAvailable) { 
           const end = new Date();
           const start = new Date();
           
           // Set start time to midnight today
           start.setHours(0, 0, 0, 0);
           
           // Set end time to midnight tomorrow
           end.setHours(23, 59, 59, 999);

           console.log('Tracking steps from:', start.toISOString(), 'to:', end.toISOString());

           const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
           if (pastStepCountResult) {
             setPastStepCount(pastStepCountResult.steps);
           }
       }
    }

    const progressPercentage = Math.round((currentSteps / targetSteps) * 100);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.frameParent}>
        <View style={styles.groupParent}>
          {/** Steps count chart  */}
          <View>
            <PieChart
              data={stepsCountData}
              curvedEndEdges
              edgesRadius={200}
              donut
              focusOnPress
              innerCircleColor={Colors[colorScheme].background}
              curvedStartEdges={true}
              isAnimated
              innerRadius={55}
              radius={80}
              centerLabelComponent={() => (
                <Image
                  source={footstepsIcon}
                  style={{ width: 24, height: 24 }}
                />
              )}
            />
          </View>

          <View style={styles.stepsParent}>
            <Text
              style={[
                styles.steps,
                styles.stepsFlexBox,
                { color: Colors[colorScheme].text["0"] },
              ]}
            >
              {`${currentSteps}/${targetSteps} steps`}
            </Text>
            <Text
              style={[
                styles.textDescription,
                styles.stepsFlexBox,
                { color: Colors[colorScheme].text["0"] },
              ]}
            >
              Start making today!
            </Text>
          </View>
        </View>
        <Image
          source={require("@/assets/images/mdi_fire.svg")}
          style={styles.mdifireIcon}
        />
      </SafeAreaView>

      {/** Steps count details  */}
      {/**pass props here */}
         <StepsAndCalories />
    </View>
  );
}

const styles = StyleSheet.create({
    container: { 
        marginTop: 28,
    },
    stepsCountChart: {
        width: 'auto',
        height: 200,
        borderRadius: 24,
        borderStyle: "solid",
    },
    stepsFlexBox: {
        textAlign: "center",
        color: "#000",
        alignSelf: "stretch"
    },
    frameChild: {},
    steps: {
        fontSize: 20,
        lineHeight: 22,
        fontWeight: "500",
        fontFamily: "Inter-Medium"
    },
    textDescription: {
        fontSize: 12,
        fontFamily: "Inter-Regular"
    },
    stepsParent: {
        gap: 6,
        alignSelf: "stretch"
    },
    groupParent: {
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        width: '100%',
    },
    mdifireIcon: {
        top: 14,
        right: 12,
        position: "absolute",
        overflow: "hidden"
    },
    frameParent: {
        paddingVertical: 12,
        backgroundColor: "rgba(172, 172, 172, 0.1)",
        borderRadius: 24,
        borderStyle: "solid",
        borderColor: "#54ee69",
        borderWidth: 1,
        width: "auto",
        height: 279,
        overflow: "hidden"
    }
});