import { Colors } from '@/constants/Colors';
import { typography } from '@/constants/typography';
import { supabase } from '@/utils/supabase';
import { Image } from 'expo-image';
import { Pedometer } from 'expo-sensors';
import React, { useEffect, useState } from 'react';
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
    const [currentSteps, setCurrentSteps] = useState<number>(0);
    const [targetSteps] = useState(2700);
    const colorScheme = useColorScheme() ?? 'light';
    const footstepsIcon = require('@/assets/images/footsteps.svg');
    const [pastStepCount, setPastStepCount] = useState<number>(0);

    const [stepsCountData] = useState<StepData[]>([
        {value: 70, color: Colors[colorScheme].primary},
        {value: 30, color: 'lightgray'}
    ]);

    const subscribe = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      console.log('isAvailable', isAvailable);


      const user = await supabase.auth.getUser();

      if (isAvailable) {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 1);

        //weekly steps count
        start.setDate(start.getDate() - start.getDay());
        const endOfWeek = new Date();
        endOfWeek.setDate(endOfWeek.getDate() - endOfWeek.getDay() + 6);
  
        const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
        const weeklyStepCountResult = await Pedometer.getStepCountAsync(start, endOfWeek);
       

        if (pastStepCountResult) {
            setPastStepCount(pastStepCountResult.steps);
         }

         
        if (weeklyStepCountResult) {
          const { data, error } = await supabase.from('userdata').upsert({
            user_id: user.data.user?.id as string,
            weekly_steps: weeklyStepCountResult.steps,
          }, { onConflict: 'user_id' }).eq('user_id', user.data.user?.id as string).select('*').single();

           console.log('weeklyStepCountResult', data);
           console.log('weeklyStepCountResult error', error?.message);
        }
  
        return Pedometer.watchStepCount(result => {
          setCurrentSteps(result.steps);
        });
      }
    };

  useEffect(() => {
    (async () => {
      const subscription = await subscribe();
      return () => subscription && subscription.remove();
    })()

  }, []);

  console.log('currentSteps', currentSteps);
  console.log('pastStepCount', pastStepCount);

    
    
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
                typography.heading,
                styles.stepsFlexBox,
                { color: Colors[colorScheme].text['0'] },
              ]}
            >
              {`${currentSteps}/${targetSteps} steps`}
            </Text>
            <Text
              style={[
                typography.description,
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