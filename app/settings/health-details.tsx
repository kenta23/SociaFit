import { Colors } from "@/constants/Colors";
import { typography } from "@/constants/typography";
import { Database } from "@/database.types";
import { useStoreHealthDetails } from "@/utils/states";
import { containerStyles } from "@/utils/styles";
import { supabase } from "@/utils/supabase";
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import React, { useCallback, useRef, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";



const WEIGHT_VALUES: number[] =  Array.from({ length: 454 }, (_, index) => index + 1);
const HEIGHT_VALUES: number[] =  Array.from({ length: 250 }, (_, index) => index + 30);
const GENDER_VALUES: string[] = ['Male', 'Female', 'Not Set', 'Other'];
const AGE_VALUES: number[] =  Array.from({ length: 100 }, (_, index) => index + 1);


export default function HealthDetails () { 
  const colorScheme = useColorScheme() ?? 'light';
  const bottomSheetRef = useRef<BottomSheet>(null);  
  const [storeBottomSheetContent, setStoreBottomSheetContent] = useState<{ id: number, value: number[] | string[] }[]>([{ id: 0, value: [] }]);
  const { healthDetails, setHealthDetails } = useStoreHealthDetails();
 


  function handleBottomSHeetContent(index: number) {
        bottomSheetRef.current?.snapToIndex(1, { 
          duration: 300,
          velocity: 100,
        });
        if(index > 4 ) return;

       switch (index) {
         case 0:
          setStoreBottomSheetContent([{ 
            id: index,
            value: WEIGHT_VALUES
          }]);
          break;
         case 1:
          setStoreBottomSheetContent([{ 
            id: index,
            value: HEIGHT_VALUES
          }]);
          break;
         case 2:
          setStoreBottomSheetContent([{ 
            id: index,
            value: AGE_VALUES,
          }]);
          break;
         case 3:
          setStoreBottomSheetContent([{ 
            id: index,
            value: GENDER_VALUES
          }]);
          break;
      }
  }


  const handleBottomSheetChange = useCallback((index: number) => {
    console.log('handleBottomSheetChange', index);

    if(index <= 0) bottomSheetRef.current?.close();
  }, []);


  async function handleUpdateHealthDetails(item: string, index: number) { 
    try {
       const user = await supabase.auth.getUser();

      console.log('item', item);


      let dataToUpdate: Database['public']['Tables']['health_details']['Insert'] = {
        user_id: user.data.user?.id as string,
      }

      switch(index) { 
         case 0:
          dataToUpdate.weight = Number(item);
          break;
         case 1:
          dataToUpdate.height = Number(item);
          break;
         case 2:
          dataToUpdate.age = Number(item);
          break;
         case 3:
          dataToUpdate.gender = item.trim();
          break;
         case 4:
          dataToUpdate.BMI = Number(item);
          break;
      }

         //set BMI 
         const weight = dataToUpdate.weight ? dataToUpdate.weight : healthDetails?.weight;
         const height = dataToUpdate.height ? dataToUpdate.height : healthDetails?.height;
         
         console.log('WEIGHT', weight);
         console.log('HEIGHT', height);
         dataToUpdate.BMI = weight && height ? weight / Math.pow(height / 100, 2) : 0;
         console.log('BMI', dataToUpdate.BMI);
      
        

      console.log('dataToUpdate', dataToUpdate);
      const {data, error } = await supabase.from('health_details').upsert(dataToUpdate, { onConflict: 'user_id' }).eq('user_id', user.data.user?.id as string).select('*').single();

      if (data) { 
        Alert.alert('Success!', 'Health details updated');
        bottomSheetRef.current?.close();
        setHealthDetails(data as Database['public']['Tables']['health_details']['Row']);
      }

      if (error) { 
        Alert.alert('Error!', error.message.toString());
      }
      
    } catch (error) {
      Alert.alert('Error!', 'Something went wrong');
    } 
  }



  const renderItem = useCallback((item: { id: number, value: number[] | string[] }) => (
    <View
      key={item.id}
    >
      {item.value.map((i, idx) => {
        let text = i.toString();
        if (item.id === 0) text += ' kg';
        else if (item.id === 1) text += ' cm';
        else text;
        const lowOpacity = item.id === 0 ? healthDetails?.weight === i ? 0.5 : 1 : item.id === 1 ? healthDetails?.height === i ? 0.5 : 1 : item.id === 2 ? healthDetails?.age === i ? 0.5 : 1 : item.id === 3 ? healthDetails?.gender === i ? 0.5 : 1 : 1

        return (
          <Pressable
          disabled={lowOpacity === 0.5}
          onPress={() => handleUpdateHealthDetails(i.toString(), item.id)}
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 12,
            marginHorizontal: 12,
            padding: 12,
            opacity: lowOpacity,
            backgroundColor: Colors[colorScheme].text['50'],
            borderRadius: 16,
            marginVertical: 8,
          }}
          key={idx}>
            <Text key={idx} style={typography.heading}>
               {text}
            </Text>
          </Pressable>
        );
      })}
    </View>

  ) , [healthDetails]);


  return ( 
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors[colorScheme].background }} edges={["top"]}>
     <GestureHandlerRootView>
         <View style={containerStyles.container}>
           <View style={styles.contentContainer}> 
                {/**Header */}
                <View style={{ flexDirection: 'column', gap: 4 }}>
                  <Text style={typography.heading}>Physical and Health Information</Text>
                  <Text style={typography.description}>Changing your information must be detailed as possible </Text>
                </View>


            {/**Options */}    
            <FlatList
              data={['Weight', 'Height', 'Age', 'Gender']}
              scrollEnabled={false}
              keyExtractor={(item) => item}
              style={{
                backgroundColor: Colors[colorScheme].frameBackground,
                padding: 12,
                borderRadius: 16,
                marginVertical: 12,
                width: '90%',
              }}
              renderItem={({ item, index }) => {
                return (
                  <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 12 }}>
                     <Pressable style={{ width: '100%', gap: 10 }} onPress={() => handleBottomSHeetContent(index)}> 
                        <View>
                         <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                           <Text>{item}</Text>

                           <Text style={[typography.description, { color: Colors[colorScheme].green['400'] }]}>{index === 0 ? healthDetails?.weight + ' kg' : index === 1 ? healthDetails?.height + ' cm' : index === 2 ? healthDetails?.age + ' years' : healthDetails?.gender}</Text>
                        </View>

                        {/**Horizontal line */}
                        <View style={{ height: 1, backgroundColor: Colors[colorScheme].text['200'], width: '100%' }} />

                      </View>

                     </Pressable>
                  </View>

                )
              }
              }
            />


            <View style={{ flexDirection: 'column', gap: 6, alignItems: 'center', justifyContent: 'center'}}>
               <Image source={require('@/assets/images/scale.png')} style={{ width: 35, height: 35 }} contentFit="cover"/>
                 <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                   <Text style={[typography.medium, { color: Colors[colorScheme].text['400'] }]}>Your BMI</Text>
                   <Text style={typography.heading}>{healthDetails?.BMI} - {healthDetails?.BMI ? healthDetails?.BMI < 18.5 ? 'Underweight' : healthDetails?.BMI > 18.5 && healthDetails?.BMI < 24.9 ? 'Normal' : healthDetails?.BMI > 25 && healthDetails?.BMI < 29.9 ? 'Overweight' : 'Obesity' : 'N/A'}</Text>
                 </View>
            </View>

           </View>
       </View>


        <BottomSheet
          snapPoints={['10%', '25%', '50%', '60%']}
          index={-1}
          onChange={handleBottomSheetChange}
          ref={bottomSheetRef}
          enableDynamicSizing={false}
          enablePanDownToClose
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              opacity={0.4}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              pressBehavior="close"
            />
          )}
        > 
             <View> 
             <BottomSheetScrollView>
                {storeBottomSheetContent.map(renderItem)}
          </BottomSheetScrollView>
             </View>
       </BottomSheet>

      </GestureHandlerRootView>  
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