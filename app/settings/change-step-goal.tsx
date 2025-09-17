import { Colors } from '@/constants/Colors';
import { typography } from '@/constants/typography';
import { useStoreHealthDetails } from '@/utils/states';
import { containerStyles } from '@/utils/styles';
import { AntDesign } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';
import {
  getSdkStatus,
  initialize,
  readRecords,
  RecordResult,
  requestPermission
} from 'react-native-health-connect';
import { SafeAreaView } from 'react-native-safe-area-context';

interface HealthDetails {
    weight: number; // in kg
    height: number; // in cm
    age: number;
    gender: 'male' | 'female';
    walkingPace: 'slow' | 'average' | 'brisk';
}
  


export default function ChangeStepGoal() {  
    const colorScheme = useColorScheme() ?? 'light';
    const [stepGoal, setStepGoal] = useState<number>(0);
    const { healthDetails } = useStoreHealthDetails()
    const [derivedWalkingPace, setDerivedWalkingPace] = useState<HealthDetails['walkingPace']>('average');
    const [averageSpeedMs, setAverageSpeedMs] = useState<number | null>(null);

      // Derive walking pace from Health Connect distance data
      useEffect(() => {
        const fetchWalkingSpeed = async () => {
          try {
            await getSdkStatus();
            const ok = await initialize();
            if (!ok) return;

            await requestPermission([
              { accessType: 'read', recordType: 'Distance' },
            ]);

            const end = new Date();
            const start = new Date(end.getFullYear(), end.getMonth(), end.getDate()); // today

            const distanceRecords = await readRecords('Distance', {
              timeRangeFilter: { operator: 'between', startTime: start.toISOString(), endTime: end.toISOString() }
            });

            // Compute average speed across records (meters / second)
            const totals = (distanceRecords.records as RecordResult<'Distance'>[]).reduce(
              (acc, rec) => {
                const distanceM = rec.distance?.inMeters ?? 0;
                const startMs = new Date(rec.startTime).getTime();
                const endMs = new Date(rec.endTime).getTime();
                const durationSec = Math.max(0, (endMs - startMs) / 1000);
                return {
                  distanceM: acc.distanceM + distanceM,
                  durationSec: acc.durationSec + durationSec,
                };
              },
              { distanceM: 0, durationSec: 0 }
            );

            if (totals.durationSec > 0 && totals.distanceM > 0) {
              const avg = totals.distanceM / totals.durationSec; // m/s
              setAverageSpeedMs(avg);
              // Map to pace buckets (approx thresholds)
              const pace: HealthDetails['walkingPace'] = avg < 1.2 ? 'slow' : avg < 1.7 ? 'average' : 'brisk';
              setDerivedWalkingPace(pace);
            }
          } catch (e) {
            console.log('Failed to derive walking speed from Health Connect', e);
          }
        };
        fetchWalkingSpeed();
      }, []);



      function calculateCaloriesBurned(steps: number): number {
        // Convert height to meters
        const heightInMeters = ((healthDetails?.height ?? 0) as number) / 100;
        const walkingPace = derivedWalkingPace;
        
        // Calculate stride length
        const strideLength = heightInMeters * 0.414;
        
        // Calculate distance walked
        const distance = strideLength * steps;
        
        // Determine MET value based on walking pace
        const metValues = {
          slow: 2.8,
          average: 3.5,
          brisk: 5.0
        };
        
        const met = metValues[walkingPace];
        
        // Calculate time spent walking using derived average speed (fallback 1.34 m/s)
        const walkingSpeed = averageSpeedMs ?? 1.34; // m/s
        const timeInHours = distance / walkingSpeed / 3600;
        
        // Calculate base calories burned
        const weight = (healthDetails?.weight ?? 0) as number;
        const baseCalories = met * weight * timeInHours;
        
        // Apply gender and age adjustments
        const gender = (healthDetails?.gender ?? 'male') as HealthDetails['gender'];
        const age = (healthDetails?.age ?? 30) as number;
        const ageAdjustment = gender === 'male' 
          ? 1 + (age - 30) * 0.01 
          : 1 + (age - 30) * 0.008;
        
        return baseCalories * ageAdjustment;
      }

      const estimatedCalories = useMemo(() => {
        return calculateCaloriesBurned(stepGoal || 0);
      }, [stepGoal, averageSpeedMs, healthDetails]);

      return ( 
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors[colorScheme].background }} edges={["top"]}>
            <View style={[containerStyles.contentContainer]}>
                <View style={{ gap: 12, alignItems: 'center', width: '80%' }}>
                    <Text style={[typography.heading, { color: Colors[colorScheme].text[0] }]}>Change Step Goal</Text>
                    <Text style={[typography.description, { color: Colors[colorScheme].text[0], textAlign: 'center' }]}>Set a change for your goals based on how active you’d like to be each day</Text>
                </View>


                <View style={{ gap: 12, alignItems: 'center', width: '80%', marginTop: 24 }}>
                       <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
                          <Pressable onPress={() => setStepGoal(stepGoal <= 0 ? 0 : stepGoal - 1)} disabled={stepGoal <= 0}>
                            <AntDesign name="minus" size={32} color={Colors[colorScheme].pink['400']} />
                          </Pressable>
                           <TextInput
                             keyboardType="number-pad"
                             onChangeText={(text: string) => { 
                               const formattedText = text.replace(/[^0-9]/g, '');
                               setStepGoal(Number(formattedText) || 0);
                             }}
                             value={(stepGoal || 0).toString()}
                              style={{
                                 backgroundColor: Colors[colorScheme].text['50'],
                                 borderColor: 'transparent',
                                 borderRadius: 24,
                                 padding: 12,
                                 width: 120,
                                 textAlign: 'center',
                              }}
                            >         
                            </TextInput>
                          <Pressable onLongPress={() => setStepGoal(stepGoal + 1)} onPress={() => setStepGoal(stepGoal + 1)} disabled={stepGoal >= 100000}>
                             <AntDesign name="plus" size={32} color={Colors[colorScheme].green['400']} />
                          </Pressable>
                       </View>

                       <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                         <Text style={{ textAlign: 'center' }}>
                           Equivalent to <Text style={{ fontWeight: '700' }}>{Number.isFinite(estimatedCalories) ? Math.max(0, Math.round(estimatedCalories)) : 0}</Text> kCal to burn
                         </Text>
                         <Text style={{ textAlign: 'center', marginTop: 4, opacity: 0.7 }}>
                           Pace: {derivedWalkingPace} {averageSpeedMs ? `(${averageSpeedMs.toFixed(2)} m/s)` : ''}
                         </Text>
                       </View>
                </View>
            </View>
        </SafeAreaView>
      )
}


const styles = StyleSheet.create({ 
    contentContainer: {
        gap: 24,
        marginVertical: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
      },
})