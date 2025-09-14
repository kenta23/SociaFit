import { Colors } from '@/constants/Colors';
import { typography } from '@/constants/typography';
import { containerStyles } from '@/utils/styles';
import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';
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
     


      function calculateCaloriesBurned(steps: number, healthDetails: HealthDetails): number {
        const { weight, height, age, gender, walkingPace } = healthDetails;
        
        // Convert height to meters
        const heightInMeters = height / 100;
        
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
        
        // Calculate time spent walking (assuming average speed of 1.34 m/s)
        const walkingSpeed = 1.34; // m/s
        const timeInHours = distance / walkingSpeed / 3600;
        
        // Calculate base calories burned
        const baseCalories = met * weight * timeInHours;
        
        // Apply gender and age adjustments
        const ageAdjustment = gender === 'male' 
          ? 1 + (age - 30) * 0.01 
          : 1 + (age - 30) * 0.008;
        
        return baseCalories * ageAdjustment;
      }

      return ( 
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors[colorScheme].background }} edges={["top"]}>
            <View style={[containerStyles.contentContainer]}>
                <View style={{ gap: 12, alignItems: 'center', width: '80%' }}>
                    <Text style={[typography.heading, { color: Colors[colorScheme].text[0] }]}>Change Step Goal</Text>
                    <Text style={[typography.description, { color: Colors[colorScheme].text[0], textAlign: 'center' }]}>Set a change for your goals based on how active you’d like to be each day</Text>
                </View>


                <View style={{ gap: 12, alignItems: 'center', width: '80%', marginTop: 24 }}>
                       <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
                           <AntDesign name="minus" size={32} color={Colors[colorScheme].pink['400']} />
                            <TextInput
                              onChange={(e: any) => setStepGoal(Number(e.target.value))}
                              value={stepGoal.toString() || '100'}
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
                           <AntDesign name="plus" size={32} color={Colors[colorScheme].green['400']} />
                       </View>

                       <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ textAlign: 'center' }}>Equivalent to 10000 to burn</Text>
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