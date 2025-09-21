import { Database } from '@/database.types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type WorkoutSplitType = (Database['public']['Tables']['workout_splits']['Row'] & { workout_days: Database['public']['Tables']['workout_days']['Row'] } & { workout_categories: Database['public']['Tables']['workout_categories']['Row']})[];

interface Data { 
     data: Database['public']['Tables']['userdata']['Row'] | null;
     storeData: (healthData: Database['public']['Tables']['userdata']['Row']) => void;   
}

interface StepsCount { 
    targetSteps: number;
    currentSteps: number;
    weeklySteps: number;
    monthlySteps: number;
    setWeeklySteps: (steps: number) => void;
    setMonthlySteps: (steps: number) => void;
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


//get energy units, distance units, height units
//create a function to update the unit measure
//create a function to formulate the unit measure base on the selected units 

interface UnitMeasure { 
   units: { 
    energyUnits: string;
    distanceUnits: string;
    heightUnits: string;
   }
   setUnits: (units: { energyUnits: string; distanceUnits: string; heightUnits: string }) => void;
   getUnits: () => { energyUnits: string; distanceUnits: string; heightUnits: string };
   unitsConversion: (units: { energyUnits: string; distanceUnits: string; heightUnits: string }) => void;
}


interface Distance { 
  distance: number;
  setDistance: (distance: number) => void;
}


export const useStoreData = create<Data>((set) => ({
  data: null,
  storeData: (data: Database['public']['Tables']['userdata']['Row']) => set({ data }),
}));


export const useStoreStepsCount = create<StepsCount>((set) => ({ 
    targetSteps: 0, //today steps
    currentSteps: 0,
    weeklySteps: 0,
    monthlySteps: 0,
    setTargetSteps: (steps: number) => set({ targetSteps: steps }),
    setCurrentSteps: (steps: number) => set({ currentSteps: steps }),
    setWeeklySteps: (steps: number) => set({ weeklySteps: steps }),
    setMonthlySteps: (steps: number) => set({ monthlySteps: steps }),
}))


export const useStoreUnitMeasure = create<UnitMeasure>()(
  persist((set, get) => ({ 
      units: {
        energyUnits: 'Calories',
        distanceUnits: 'Kilometer',
        heightUnits: 'Centimeters',
      },
      setUnits: (units: { energyUnits: string; distanceUnits: string; heightUnits: string }) => set({ units }),
      unitsConversion: (units: { energyUnits: string; distanceUnits: string; heightUnits: string }) => set({ units }),
      getUnits: () => { 
        return get().units;
      },
    }),
    {
      name: 'unit-measure-storage', // unique name for the storage key
    }
  )
)

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


export const useStoreDistance = create<Distance>((set) => ({ 
   distance: 0,
   setDistance: (distance: number) => set({ distance }),
}));



