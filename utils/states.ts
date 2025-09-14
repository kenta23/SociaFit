import { Database } from '@/database.types';
import { create } from 'zustand';


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



