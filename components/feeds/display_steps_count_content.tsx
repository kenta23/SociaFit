import { Colors } from "@/constants/Colors";
import { useStoreDistance, useStoreStepsCount } from "@/utils/states";
import { Image } from "expo-image";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { Region } from 'react-native-maps';

const DEFAULT_REGION: Region = {
    latitude:  14.771812737924256, 
    longitude: 121.06465829558094,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  
interface StepData {
  value: number;
  color: string;
}



export default function DisplayStepsCountContent() {
  const { coordinates } = useStoreDistance();
  const [region, setRegion] = useState<Region>({...coordinates[0], latitudeDelta: 0.01, longitudeDelta: 0.01});
  const { currentSteps, targetSteps } = useStoreStepsCount();
  const colorScheme = useColorScheme() ?? 'light';

  useEffect(() => {
    if (coordinates.length > 0) {
      setRegion({...coordinates[0], latitudeDelta: 0.01, longitudeDelta: 0.01});
    }
  }, [coordinates]);


  const stepsCountData = useMemo<StepData[]>(() => {
    const rawPercent = targetSteps === 0 ? 0 : (currentSteps / targetSteps) * 100;
    const cappedPercent = Math.min(100, Math.max(0, Number.isFinite(rawPercent) ? rawPercent : 0));
    return [
        { value: cappedPercent, color: Colors[colorScheme].primary },
        { value: 100 - cappedPercent, color: 'lightgray' }
    ];
}, [currentSteps, targetSteps, colorScheme]);
 

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
       <PieChart
         data={stepsCountData}
         curvedEndEdges
         edgesRadius={200}
         donut
         innerCircleColor={Colors[colorScheme].background}
         curvedStartEdges={true}
         isAnimated
         innerRadius={35}
         radius={50}
         centerLabelComponent={() => (
           <Image
             source={require('@/assets/images/footsteps.svg')}
             style={{ width: 18, height: 18 }}
           />
         )}
       />
       <Text style={styles.stepsCountText}>{`${currentSteps}/${targetSteps} steps`}</Text>
    </View>
 </View>
  )
}


const styles = StyleSheet.create({ 
  container: { 
      width: "100%",
      maxWidth: 155,
      minWidth: 110,
      height: 160,
      borderWidth: 1,
      borderColor: '#54EE69',
      borderRadius: 8,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
  },
  stepsCountText: { 
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "Inter-Medium",
    color: "#000",
    textAlign: "center",
    marginTop: 10,
  },
  contentWrapper: { 
   flexDirection: "column",
   alignItems: "center",
   justifyContent: "center",
   gap: 10,
  },     
})