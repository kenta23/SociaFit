import MonthlyActivities from '@/components/history/monthlyactivities';
import { ProgressRings } from '@/components/ui/Progressrings';
import { Colors } from '@/constants/Colors';
import { useStoreStepsCount } from '@/utils/states';
import { containerStyles } from '@/utils/styles';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


type StepsCountDisplay = {
  id: number;
  title: string;
  value: number;
  color: string;
}



export default function history() {
  const colorScheme = useColorScheme() ?? 'light';
  const [data, setData] = useState<any>(null);
  const { currentSteps, weeklySteps, monthlySteps, targetSteps } = useStoreStepsCount();
  const [stepsCountDisplay] = useState<StepsCountDisplay[]>([ 
    { 
     id: 1,
     title: 'Today',
     value: currentSteps,
     color: '#b42469'
    },
    { 
     id: 2,
     title: 'This week',
     value: weeklySteps,
     color: '#b4a324'
    },
    { 
     id: 3,
     title: 'This month',
     value: monthlySteps,
     color: '#24b437'
    }
 ]);

  const renderPieChart = () => {
    const clamp = (v: number) => Math.max(0, Math.min(1, v)); //the result should be between 0 and 1 
    const monthlyStepsMultipler = targetSteps * 30;
    const weeklyStepsMultipler = targetSteps * 7;
    
    const ratio = (numerator: number, denominator: number) =>
      denominator > 0 ? numerator / denominator : 0;

    const todayRatio = clamp(ratio(currentSteps, targetSteps));
    const weeklyRatio = clamp(ratio(weeklySteps, weeklyStepsMultipler));
    const monthlyRatio = clamp(ratio(monthlySteps, monthlyStepsMultipler));

    return (
      <ProgressRings
        rings={[
          { color: "green", value: todayRatio },
          { color: "goldenrod", value: weeklyRatio },
          { color: "deeppink", value: monthlyRatio },
        ]}
      />
    );
  };
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors[colorScheme].background }} edges={['top']}>
        <ScrollView contentContainerStyle={containerStyles.container}>
        <View style={styles.stepsFrameParent}>
            <Text style={styles.yourTotalSteps}>Your Total steps</Text>

           <View style={styles.inner}>
              <View style={styles.totalStepsContainer}>
              {/** PIE CHART */}
               {renderPieChart()}

            {/** STEPS COUNT DISPLAY */}
                <View style={styles.countStepsContainer}>
                  {stepsCountDisplay.map((item) => (
                    <View style={styles.stepsItem} key={item.id}>
                      <View style={styles.stepsTitle}>
                         <View style={{ width: 6, height: 6, borderRadius: 100, backgroundColor: item.color }} />
                         <Text style={[styles.titleText]}>{item.title}</Text>
                       </View>
                       <Text style={[styles.text, { color: item.color }]}>{item.value}</Text>
                     </View>
                   ))}
                 </View>
              </View>

            </View>
        </View>


        {/** MONTHLY ACTIVITIES */}
        <MonthlyActivities />
      </ScrollView>
    </SafeAreaView>
  )
}



const styles = StyleSheet.create({
  stepsFrameParent: { flexDirection: 'column', alignItems: 'flex-start', gap: 16, },
  stepsItem:{ 
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4
  },
   header: { 
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'flex-start',
     gap: 14,
     marginTop: 16
   },
   title: { 
     fontSize: 20,
     fontWeight: "500",
     color: "#000",
     textAlign: "center",
     fontFamily: 'Inter_500Medium'
   },

   //chart 
  textTypo: {
    lineHeight: 12,
    fontSize: 12,
    textAlign: "center",
    letterSpacing: -0.2,
    fontFamily: "Inter-Medium",
    fontWeight: "500"
  },
  yourTotalSteps: {
    fontSize: 18,
    textAlign: "left",
    color: "#000",
    fontFamily: "Inter-Medium",
    fontWeight: "500",
    alignSelf: "stretch"
  },
  pieChartIcon: {},
  circle: {

  },
  titleText: {
    fontSize: 10,
    textAlign: "center",
  },
  stepsTitle: {
    gap: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: "stretch"
  },
  text: {
    color: "#b42469",
    fontSize: 12,
    width: '100%',
    alignSelf: 'stretch',
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
    textAlign: 'left'
  },
  frameGroup: {
    justifyContent: "center",
    gap: 5,
    alignSelf: "stretch"
  },
  text1: {
    color: "#b4a324"
  },
  text2: {
    color: "#24b437"
  },
  countStepsContainer: {
    width: 'auto',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 10
  },
  totalStepsContainer: {
    width: '100%',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: 35,
    justifyContent: "space-evenly",
  },
  inner: {
    borderRadius: 24,
    backgroundColor: "rgba(172, 172, 172, 0.1)",
    minHeight: 166,
    height: 'auto',
    paddingVertical: 24,
    overflow: "hidden",
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
})