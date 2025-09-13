import { Colors } from '@/constants/Colors';
import { typography } from '@/constants/typography';
import { Database } from '@/database.types';
import { supabase } from '@/utils/supabase';
import { Image } from 'expo-image';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import {
  getSdkStatus,
  initialize,
  readRecords,
  RecordResult,
  requestPermission,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';
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
    const [targetSteps, setTargetSteps] = useState<number>(0);
    const colorScheme = useColorScheme() ?? 'light';
    const [pastStepCount, setPastStepCount] = useState<number>(0);
    const [data, setData] = useState<Database['public']['Tables']['userdata']['Row'] | null>(null);
    

    // Helper function to calculate date ranges
    const getDateRanges = () => {
      const now = new Date();
      
      // Today (start of day to end of day)
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);
      
      // This week (Monday to Sunday)
      const startOfWeek = new Date(startOfDay);
      const dayOfWeek = startOfWeek.getDay();
      const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust for Sunday
      startOfWeek.setDate(startOfWeek.getDate() + daysToMonday);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      
      // This month (1st to last day of month)
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      
      return {
        today: { start: startOfDay, end: endOfDay },
        week: { start: startOfWeek, end: endOfWeek },
        month: { start: startOfMonth, end: endOfMonth }
      };
    };

    // Helper function to calculate total steps from Health Connect records
    const calculateTotalSteps = (records: RecordResult<"Steps">[]): number => {
      return records.reduce((total, record) => {
        return total + (record.count || 0);
      }, 0);
    };

    // Helper function to update streaks
    const updateStreaks = async (userId: string, todaySteps: number, stepGoal: number) => {
      try {
        // Get current user data
        const { data: userData, error: fetchError } = await supabase
          .from('userdata')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (fetchError) {
          console.log('Error fetching user data for streaks:', fetchError);
          return 0;
        }

        const currentStreaks = (userData as any)?.streaks || 0;
        const goalMet = todaySteps >= stepGoal;
        
        let newStreaks = 0;
        if (goalMet) {
          newStreaks = currentStreaks + 1;
        } else {
          newStreaks = 0; // Reset streak if goal not met
        }

        // Update streaks in database
        const { error: updateError } = await supabase
          .from('userdata')
          .update({ streaks: newStreaks } as any)
          .eq('user_id', userId);

        if (updateError) {
          console.log('Error updating streaks:', updateError);
          return currentStreaks;
        }

        console.log(`Streaks updated: ${currentStreaks} -> ${newStreaks} (Goal met: ${goalMet})`);
        return newStreaks;
      } catch (error) {
        console.log('Error in updateStreaks:', error);
        return 0;
      }
    };

    // Main Health Connect integration function
    const healthConnectIntegration = async () => {
      try {
        // Check SDK status first
        const status = await getSdkStatus();
        console.log('Health Connect SDK Status:', status);
        
        if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE) {
          console.log('Health Connect SDK is not available on this device');
          Alert.alert('Health Connect Unavailable', 'Health Connect is not available on this device. Please install Health Connect app.');
          return;
        }
        
        if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED) {
          console.log('Health Connect provider update required');
          Alert.alert(
            'Update Required', 
            'Please update Health Connect app to the latest version from Google Play Store.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Play Store', onPress: () => {
                console.log('User should update Health Connect app');
              }}
            ]
          );
          return;
        }

        // Initialize the health connect client
        const isInitialized = await initialize();
        console.log('Health Connect initialized:', isInitialized);

        if (!isInitialized) {
          console.log('Failed to initialize Health Connect');
          return;
        }
    
        // Request permissions for steps data
        const grantedPermissions = await requestPermission([
          { accessType: 'read', recordType: 'Steps' },
        ]);

        console.log('Permission request result:', grantedPermissions);
    
        // Check if permissions were granted
        if (!grantedPermissions || (Array.isArray(grantedPermissions) && grantedPermissions.length === 0)) {
          console.log('No permissions granted');
          Alert.alert(
            'Permissions Required', 
            'Health Connect permissions are required to read your health data. Please grant permissions in the Health Connect app.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Health Connect', onPress: () => {
                console.log('User should open Health Connect app to grant permissions');
              }}
            ]
          );
          return;
        }

        // Get user data
        const user = await supabase.auth.getUser();
        if (!user.data.user?.id) {
          console.log('No authenticated user found');
          return;
        }

        const userId = user.data.user.id;
        const dateRanges = getDateRanges();

        // Read today's steps
        const todayStepsResult = await readRecords('Steps', {
          timeRangeFilter: {
            operator: 'between',
            startTime: dateRanges.today.start.toISOString(),
            endTime: dateRanges.today.end.toISOString(),
          },
        });

        // Read this week's steps
        const weekStepsResult = await readRecords('Steps', {
          timeRangeFilter: {
            operator: 'between',
            startTime: dateRanges.week.start.toISOString(),
            endTime: dateRanges.week.end.toISOString(),
          },
        });

        // Read this month's steps
        const monthStepsResult = await readRecords('Steps', {
          timeRangeFilter: {
            operator: 'between',
            startTime: dateRanges.month.start.toISOString(),
            endTime: dateRanges.month.end.toISOString(),
          },
        });

        // Calculate totals
        const todaySteps = calculateTotalSteps(todayStepsResult.records);
        const weeklySteps = calculateTotalSteps(weekStepsResult.records);
        const monthlySteps = calculateTotalSteps(monthStepsResult.records);

        console.log('Steps data:', {
          today: todaySteps,
          week: weeklySteps,
          month: monthlySteps
        });

        // Get user's step goal
        const { data: userData, error: userError } = await supabase
          .from('userdata')
          .select('steps_goal')
          .eq('user_id', userId)
          .single();

        if (userError) {
          console.log('Error fetching user data:', userError);
          return;
        }

        const stepGoal = userData?.steps_goal || 0; // Default goal

        // Update streaks
        const newStreaks = await updateStreaks(userId, todaySteps, stepGoal);

        // Update database with all step data
        const { error: updateError } = await supabase
          .from('userdata')
          .upsert({
            user_id: userId,
            today_steps: todaySteps,
            weekly_steps: weeklySteps,
            monthly_steps: monthlySteps,
            streaks: newStreaks,
          } as any, { onConflict: 'user_id' });

        if (updateError) {
          console.log('Error updating step data:', updateError);
          Alert.alert('Error', 'Failed to save step data to database');
        } else {
          console.log('Step data updated successfully');
          // Update local state
          setCurrentSteps(todaySteps);
          setTargetSteps(stepGoal);
        }

      } catch (error) {
        console.error('Error in healthConnectIntegration:', error);
        Alert.alert('Error', `Failed to read health data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }


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



    // Function to load user data from database
    const loadUserData = async () => {
      try {
        const user = await supabase.auth.getUser();
        if (!user.data.user?.id) return;

        const { data, error } = await supabase
          .from('userdata')
          .select('*')
          .eq('user_id', user.data.user.id)
          .single();

        if (data) {
          setTargetSteps(data.steps_goal || 0);
          setCurrentSteps(data.today_steps || 0);
          setData(data as Database['public']['Tables']['userdata']['Row']);
          console.log('User data loaded:', data);
        }
        else if (!data) { 
           const { data: healthDetailsData, error: healthDetailsError } = await supabase.from('userdata').insert({ 
            user_id: user.data.user.id,
           }).select('*').single();
           if (healthDetailsData) { 
            setTargetSteps(healthDetailsData.steps_goal || 0);
            setCurrentSteps(healthDetailsData.today_steps || 0);


            setData(healthDetailsData as Database['public']['Tables']['userdata']['Row']);
           }
           else if (healthDetailsError) { 
            console.log('Error loading user data:', healthDetailsError);
           }
        }
        else if (error) {
          console.log('Error loading user data:', error);
        }
      } catch (error) {
        console.log('Error in loadUserData:', error);
      }
    };

    // Function to set up periodic updates
    const setupPeriodicUpdates = () => {
      // Update steps data every 5 minutes
      const interval = setInterval(() => {
        healthConnectIntegration();
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(interval);
    };

    // Test function to manually trigger Health Connect sync
    const testHealthConnectSync = () => {
      console.log('Testing Health Connect sync...');
      healthConnectIntegration();
    };

  useEffect(() => {
    // Load initial user data
    loadUserData();
    
    // Initialize Health Connect integration
    healthConnectIntegration();
    
    // Set up periodic updates
    const cleanup = setupPeriodicUpdates();
    
    return cleanup;
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
              {data?.streaks ? `🔥 ${data.streaks} day streak!` : 'Start making today!'}
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
         <StepsAndCalories 
           data={data}
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