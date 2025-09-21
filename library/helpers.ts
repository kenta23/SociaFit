import { Database } from "@/database.types";
import { useStoreData } from "@/utils/states";
import { supabase } from "@/utils/supabase";
import { getSdkStatus, initialize, readRecords, RecordResult, requestPermission } from "react-native-health-connect";

  // Helper function to calculate date ranges
  export const getDateRanges = () => {
    const now = new Date();
    
    // Today (start of day to end of day)
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1); //miliseconds 
    
    // This week (Monday to Sunday)
    const startOfWeek = new Date(startOfDay);
    const dayOfWeek = startOfWeek.getDay();
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust for Sunday
    startOfWeek.setDate(startOfWeek.getDate() + daysToMonday); //start at monday
    
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
  export const calculateTotalSteps = (records: RecordResult<"Steps">[]): number => records.reduce((total: number, record: any) => {
      return total + (record.count || 0);
    }, 0);

export const calculateTotalStepsPedometer = (steps: number): number => steps;
  // Helper function to update streaks
  export const updateStreaks = async (userId: string, todaySteps: number, stepGoal: number) => {
    const { data: userData, storeData } = useStoreData();
    try {

      // Get current user data from store
      const currentStreaks = userData?.streaks || 0;
      const goalMet = todaySteps >= stepGoal;
      
      let newStreaks = 0;
      if (goalMet) {
        newStreaks = currentStreaks + 1;
      } else {
        newStreaks = 0; // Reset streak if goal not met
      }

      // Update streaks in database
      const { data: updateData, error: updateError } = await supabase
        .from('userdata')
        .update({ streaks: newStreaks })
        .eq('user_id', userId)
        .select('*')
        .single();

        if(updateData) { 
          storeData(updateData as Database['public']['Tables']['userdata']['Row']);
        }

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


export const healthConnectIntegration = async (): Promise<void | Error> => {
    const { data: userData, storeData } = useStoreData();
  try {
    // Check SDK status first
    const status = await getSdkStatus();
    console.log('Health Connect SDK Status:', status);


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

    const stepGoal = userData?.steps_goal || 0; // Default goal

    // Update streaks
    const newStreaks = await updateStreaks(userId, todaySteps, stepGoal);

    // Update database with all step data
    const { data: updateData, error: updateError } = await supabase
      .from('userdata')
      .upsert({
        user_id: userId,
        today_steps: todaySteps,
        weekly_steps: weeklySteps,
        monthly_steps: monthlySteps,
        streaks: newStreaks,
      } as any, { onConflict: 'user_id' })
      .select('*')
      .single();

    if (updateData) { 
      storeData(updateData as Database['public']['Tables']['userdata']['Row']);
      return;
    }

    if (updateError) {
      console.log('Error updating step data:', updateError);
      return updateError as Error;
    } else {
      console.log('Step data updated successfully');
    }

  } catch (error) {
    console.error('Error in healthConnectIntegration:', error);
    return error as Error;
  }
}