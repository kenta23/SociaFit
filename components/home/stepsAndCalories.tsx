import { typography } from '@/constants/typography';
import { useStoreData, useStoreUnitMeasure } from '@/utils/states';
import { supabase } from '@/utils/supabase';
import { convertCaloriesToEnergyUnit, formatEnergyValue } from '@/utils/unitsconversion';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function StepsAndCalories () {
   const [weight, setWeight] = useState<number>(0);
   const { units } = useStoreUnitMeasure();
   const {  data } = useStoreData();
  
  /*60 kg → ~0.04 kcal/step

80 kg → ~0.05 kcal/step

100 kg → ~0.06 kcal/step*/
//Calories=Distance(km)×Weight(kg)×0.5 to 0.7
  const caloriesPerStep: number = weight === 60 ? 0.04 : weight === 80 ? 0.05 : weight === 100 ? 0.06 : 0;
  const caloriesBurnt: number = useMemo(() =>  data?.today_steps ? data.today_steps * (data?.ds_travelled ?? 0) * caloriesPerStep : 0, [data?.today_steps, caloriesPerStep]);


useEffect(() => {
   async function getData() {
    const user = await supabase.auth.getUser();
    const { data: healthDetailsData, error: healthDetailsError } = await supabase.from('health_details').select('*').eq('user_id', user.data.user?.id as string).single();
    if (healthDetailsData) {
      setWeight(healthDetailsData.weight ?? 0);
    }
    if (healthDetailsError) {
      console.log('healthDetailsError', healthDetailsError?.message);
    }
  }
   getData();
}, []);


  return (
    <View style={styles.container}>
      {/** Steps count */}
      <View style={styles.frameParent}>
        <View style={styles.frameGroup}>
          <View style={styles.stepsCountParent}>
            <Text
              style={[typography.description, styles.todayClr]}
            >{`Steps count `}</Text>
            <Text style={[typography.heading, styles.text]}>{data?.today_steps ?? 0}</Text>
          </View>
          <Text style={[typography.medium, styles.todayClr]}>Today</Text>
        </View>
      </View>

      {/** Calories burnt */}
      <View style={styles.frameParent}>
        <View style={styles.frameGroup}>
          <View style={styles.stepsCountParent}>
            <Text style={[typography.description, styles.todayClr]}>
              Calories burnt
            </Text>
                <Text style={[typography.heading, styles.text]}>{convertCaloriesToEnergyUnit(caloriesBurnt, units.energyUnits)}</Text>
          </View>
          <Text style={[typography.medium, styles.todayClr]}>{formatEnergyValue(caloriesBurnt, units.energyUnits)}</Text>
        </View>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
    container: { 
         width: '100%',
         flexDirection: 'row',
         justifyContent: 'space-between',
         alignItems: 'center',
         gap: 10,
         marginTop: 16,
    },
    todayClr: {
        color: "#000",
        letterSpacing: -0.2,
        textAlign: "left"
        },
        text: {
        fontSize: 18,
        letterSpacing: -0.4,
        lineHeight: 18,
        fontWeight: "600",
        fontFamily: "Inter-SemiBold",
        color: "#b4a324",
        textAlign: "left",
        alignSelf: "stretch"
        },
        stepsCountParent: {
        width: 76,
        gap: 7
        },
        today: {
        fontSize: 12,
        lineHeight: 12,
        fontFamily: "Inter-Regular",
        textAlign: "left"
        },

  frameGroup: {
        position: "absolute",
        marginTop: -18,
        marginLeft: -67.5,
        top: "50%",
        left: "50%",
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 27
     },
frameParent: {
        borderRadius: 8,
        borderStyle: "solid",
        borderColor: "#f4ecd0",
        borderWidth: 1,
        flex: 1,
        width: "auto",
        height: 64,
        overflow: "hidden"
        }  
})