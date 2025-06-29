import MonthlyActivities from '@/components/history/monthlyactivities';
import { ProgressRings } from '@/components/ui/Progressrings';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const stepsCountDisplay = [ 
   { 
    id: 1,
    title: 'Today',
    value: 200,
    color: '#b42469'
   },
   { 
    id: 2,
    title: 'This week',
    value: 1400,
    color: '#b4a324'
   },
   { 
    id: 3,
    title: 'This month',
    value: 2300,
    color: '#24b437'
   }
];




export default function history() {
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();

  return (
    <SafeAreaView edges={['top']}>
        <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme].background  }]}>
          <View style={styles.header}>
            {/* <Pressable onPress={() => router}><Image style={{ width: 26, height: 26 }} contentFit='cover' source={require('@/assets/back button.svg')}/></Pressable> */}
            <Text style={styles.title}>History</Text>
          </View>

        <View style={styles.stepsFrameParent}>
            <Text style={styles.yourTotalSteps}>Your Total steps</Text>

           <View style={styles.inner}>
              <View style={styles.totalStepsContainer}>
              {/** PIE CHART */}
                <ProgressRings
                  rings={[
                    {  color: "green", value: 0.75,  }, //1 is the max value
                    {  color: "goldenrod", value: 0.6, },
                    {  color: "deeppink", value: 0.45, },
                  ]}
                />

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
  container: { 
    minHeight: '100%',
    width: '100%',
    paddingHorizontal: 24,
  },
  stepsFrameParent: { flexDirection: 'column', alignItems: 'flex-start', gap: 16, marginTop: 24, width: '100%' },
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