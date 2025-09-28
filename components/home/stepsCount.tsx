import { Colors } from '@/constants/Colors';
import { typography } from '@/constants/typography';
import { Database } from '@/database.types';
import { getDateRanges } from '@/library/helpers';
import { useStoreData, useStoreStepsCount } from '@/utils/states';
import { supabase } from '@/utils/supabase';
import { Image } from 'expo-image';
import { Pedometer } from 'expo-sensors';
import { Subscription } from 'expo-sensors/build/Pedometer';
import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import StepsAndCalories from './stepsAndCalories';



interface StepData {
  value: number;
  color: string;
}


export default function StepsCount() {
    const colorScheme = useColorScheme() ?? 'light';
    const { data: userData, storeData } = useStoreData();
    const { setCurrentSteps, setMonthlySteps, setWeeklySteps, targetSteps,weeklySteps, monthlySteps, currentSteps } = useStoreStepsCount();
   


    const calculateSteps = async (dateRanges: ReturnType<typeof getDateRanges>, type: 'week' | 'month' | 'today'): Promise<number | undefined> => {  
        const pastStepCountResult = dateRanges.week ? await Pedometer.getStepCountAsync(dateRanges.week.start, dateRanges.week.end) 
                                  : dateRanges.month ? await Pedometer.getStepCountAsync(dateRanges.month.start, dateRanges.month.end) 
                                  : await Pedometer.getStepCountAsync(dateRanges.today.start, dateRanges.today.end); 
        if (pastStepCountResult) {
          //add up steps to global states
          setWeeklySteps(pastStepCountResult.steps + weeklySteps);
          setMonthlySteps(pastStepCountResult.steps + monthlySteps);
          setCurrentSteps(pastStepCountResult.steps + currentSteps);

          return pastStepCountResult.steps;
        }

        return;
    
    };


    const subscribe = async (): Promise<Subscription | undefined> => {
      const isAvailable = await Pedometer.isAvailableAsync();
      console.log('isAvailable', isAvailable);
      const user = await supabase.auth.getUser();
  
      const dateRanges = getDateRanges();
   
      if (isAvailable) {
  
          const getResultsData = await Promise.all([calculateSteps(dateRanges, 'today'), calculateSteps(dateRanges, 'week'), calculateSteps(dateRanges, 'month')]);
          //store to the database
          if (getResultsData[0] !== undefined) { 
             const { data: monthlyStepsNewData } = await supabase.from('userdata').update({ monthly_steps: getResultsData[0] }).eq('user_id', user.data.user?.id as string).select().single();
             if (monthlyStepsNewData) { 
              storeData(monthlyStepsNewData as Database['public']['Tables']['userdata']['Row']);
             }
          }

          else if (getResultsData[1] !== undefined) { 
            const { data: weeklyStepsNewData } = await supabase.from('userdata').update({ weekly_steps: getResultsData[1] }).eq('user_id', user.data.user?.id as string).select().single();
            if (weeklyStepsNewData) { 
             storeData(weeklyStepsNewData as Database['public']['Tables']['userdata']['Row']);
            }
         }

         else if (getResultsData[2] !== undefined) { 
            const { data: todayStepsNewData } = await supabase.from('userdata').update({ today_steps: getResultsData[2] }).eq('user_id', user.data.user?.id as string).select().single();
            if (todayStepsNewData) { 
             storeData(todayStepsNewData as Database['public']['Tables']['userdata']['Row']);
            }
         }
         else { 
          console.log('No data to store');
         }

          return Pedometer.watchStepCount(result => {
            setCurrentSteps(result.steps);
          });
        }
      }


    useEffect(() => {
      async function subscribeFn() {
        const subscription = await subscribe();
        return () => subscription && subscription.remove();
      }

    const interval = setInterval(() => {
      subscribeFn();
     }, 3 * 60 * 1000); // 3 minutes

     return () => clearInterval(interval);
     
    }, []);


    const stepsCountData = useMemo<StepData[]>(() => {
        const rawPercent = targetSteps === 0 ? 0 : (currentSteps / targetSteps) * 100;
        const cappedPercent = Math.min(100, Math.max(0, Number.isFinite(rawPercent) ? rawPercent : 0));
        return [
            { value: cappedPercent, color: Colors[colorScheme].primary },
            { value: 100 - cappedPercent, color: 'lightgray' }
        ];
    }, [currentSteps, targetSteps, colorScheme]);


    const footstepsIcon =  useMemo(() => {
      return stepsCountData[0].value > 0 ? require('@/assets/images/footsteps.svg') : require('@/assets/images/footsteps-dark.svg');
    }, [stepsCountData]);


    
  return (
    <View style={styles.container}>
      <View style={styles.frameParent}>
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
              {userData?.streaks ? `🔥 ${userData.streaks} day streak!` : 'Start making today!'}
            </Text>
          </View>
        </View>
        <Image
          source={require("@/assets/images/mdi_fire.svg")}
          style={styles.mdifireIcon}
        />
      </View>

      {/** Steps count details  */}
      {/**pass props here */}
         <StepsAndCalories 
         />
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