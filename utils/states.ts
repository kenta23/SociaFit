import { Database } from '@/database.types';
import { create } from 'zustand';

type WorkoutSplitType = (Database['public']['Tables']['workout_splits']['Row'] & { workout_days: Database['public']['Tables']['workout_days']['Row'] } & { workout_categories: Database['public']['Tables']['workout_categories']['Row']})[];

interface Data { 
     data: Database['public']['Tables']['userdata']['Row'] | null;
     storeData: (healthData: Database['public']['Tables']['userdata']['Row']) => void;   
}

interface StepsCount { 
    targetSteps: number;
    currentSteps: number;
    setTargetSteps: (steps: number) => void;
    setCurrentSteps: (steps: number) => void;
}

interface WorkoutSplits { 
  workoutSplits: WorkoutSplitType;
  categories: Database['public']['Tables']['workout_categories']['Row'][];
  setWorkoutSplits: (splits: WorkoutSplitType) => void;
  setCategories: (categories: Database['public']['Tables']['workout_categories']['Row'][]) => void;
}


interface HealthDetails { 
  healthDetails: Database['public']['Tables']['health_details']['Row'] | null;
  setHealthDetails: (details: Database['public']['Tables']['health_details']['Row']) => void;
 }

export const useStoreData = create<Data>((set) => ({
  data: null,
  storeData: (data: Database['public']['Tables']['userdata']['Row']) => set({ data }),
}));


export const useStoreStepsCount = create<StepsCount>((set) => ({ 
    targetSteps: 0,
    currentSteps: 0,
    setTargetSteps: (steps: number) => set({ targetSteps: steps }),
    setCurrentSteps: (steps: number) => set({ currentSteps: steps }),
}))

export const useStoreHealthDetails = create<HealthDetails>((set) => ({ 
  healthDetails: null,
  setHealthDetails: (details: Database['public']['Tables']['health_details']['Row']) => set({ healthDetails: details }),
}))

export const useStoreWorkoutSplits = create<WorkoutSplits>((set) => ({ 
   workoutSplits: [],
   categories: [],
   setCategories: (categories: Database['public']['Tables']['workout_categories']['Row'][]) => set({ categories }),
   setWorkoutSplits: (splits: WorkoutSplitType) => set({ workoutSplits: splits }),
}))



