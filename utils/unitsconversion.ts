import { useStoreUnitMeasure } from "./states";

// Energy unit conversion constants
const ENERGY_CONVERSIONS = {
  'Calories': 1, // Base unit
  'Kilocalories': 1, // Same as calories
  'Kilojoules': 4.184, // 1 calorie = 4.184 kilojoules
} as const;


const DISTANCE_CONVERSIONS = { 
   'Meters': 1,
   'Kilometer': 1000,
   'Miles': 1609.34,
} as const;


const HEIGHT_CONVERSIONS = { 
   'Centimeters': 1,
   'Meters': 100,
} as const;


type EnergyUnit = keyof typeof ENERGY_CONVERSIONS;
type DistanceUnit = keyof typeof DISTANCE_CONVERSIONS;
type HeightUnit = keyof typeof HEIGHT_CONVERSIONS;


/**
 * Converts calories to the selected energy unit
 * @param calories - The number of calories to convert
 * @param targetUnit - The target energy unit (optional, uses store if not provided)
 * @returns The converted value in the target unit
 */
export const convertCaloriesToEnergyUnit = (calories: number, targetUnit?: string): number => {
  const { units } = useStoreUnitMeasure();
  const energyUnit = targetUnit || units.energyUnits as EnergyUnit;
  
  const conversionFactor = ENERGY_CONVERSIONS[energyUnit as EnergyUnit];
  
  if (!conversionFactor) {
    console.warn(`Unknown energy unit: ${energyUnit}. Using calories as default.`);
    return calories;
  }
  
  return calories * conversionFactor;
};


/**
 * Formats the energy value with appropriate unit label
 * @param calories - The number of calories
 * @param targetUnit - The target energy unit (optional, uses store if not provided)
 * @param decimalPlaces - Number of decimal places to round to (default: 1)
 * @returns Formatted string with value and unit
 */
export const formatEnergyValue = (calories: number, targetUnit?: string, decimalPlaces: number = 1): string => {
  const { units } = useStoreUnitMeasure();
  const energyUnit = targetUnit || units.energyUnits;
  const convertedValue = convertCaloriesToEnergyUnit(calories, energyUnit);
  
  switch(energyUnit) {
    case 'Calories':
       return ` cal`;
    case 'Kilocalories':
       return `kCal`;
    case 'Kilojoules':
       return `kJ`;
    default:
       return `kCal`;
  }
};



//height units 
export const convertHeightToHeightUnit = (height: number, targetUnit?: string): number => {
   const heightUnit = targetUnit;
   
   const conversionFactor = HEIGHT_CONVERSIONS[heightUnit as HeightUnit];
   
   if (!conversionFactor) {
     console.warn(`Unknown height unit: ${heightUnit}. Using Centimeters as default.`);
     return height;
   }
   
   return height / conversionFactor;
 };


export const formatHeightValue = (height: number, targetUnit?: string, decimalPlaces: number = 1): string => {

   const heightUnit = targetUnit;

 
   switch(heightUnit) {
     case 'Meters':  
        return `${convertHeightToHeightUnit(height, heightUnit).toFixed(decimalPlaces)} m`;
     case 'Centimeters':
        return `${convertHeightToHeightUnit(height, heightUnit).toFixed(decimalPlaces)} cm`;
     default:
        return `${convertHeightToHeightUnit(height, heightUnit).toFixed(decimalPlaces)} cm`;
   }
 };


 export const distanceConversion = (distance: number, targetUnit?: string): string => {
  const distanceUnit = targetUnit;

  const conversionFactor = DISTANCE_CONVERSIONS[distanceUnit as DistanceUnit];
  
  if (!conversionFactor) {
    console.warn(`Unknown distance unit: ${distanceUnit}. Using Meters as default.`);
    return distance + ' m';
  }
  const result = distance * conversionFactor;
  
  if(distanceUnit === 'Kilometer') {
    return parseFloat(result.toFixed(1)) + ' km';
  }
  if(distanceUnit === 'Miles') {
    return parseFloat(result.toFixed(1)) + ' miles';
  }

  return parseFloat(result.toFixed(1)) + ' m';
 }