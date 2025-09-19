import { useStoreUnitMeasure } from "./states";


export const unitsConversion = () => { 
     const { units } = useStoreUnitMeasure();

     if(units.energyUnits === 'Calories') { 
        return units.energyUnits;
     } else if(units.energyUnits === 'Kilocalories') { 
        return units.energyUnits;
     } else if(units.energyUnits === 'Kilojoules') { 
        return units.energyUnits;
     } else { 
        return units.energyUnits;
     }
}