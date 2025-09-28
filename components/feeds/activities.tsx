import { Colors } from '@/constants/Colors';
import { typography } from '@/constants/typography';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import DisplayMapContent from './display_map_content';
import DisplayStepsCountContent from './display_steps_count_content';



export default function ActivityContent () { 
   const colorScheme = useColorScheme() ?? 'light';

 return (
    <View style={{ gap: 10, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>            
    {/**Activity 1 */}
       <View style={[styles.activity, { backgroundColor: Colors[colorScheme].frameBackground, shadowColor: '#DBDADA', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }]}>
         <View style={{ paddingHorizontal: 10, alignSelf: 'flex-start' }}>     
           
             <View style={styles.activityHeader}>   
              <View style={styles.user}>
                  <Image style={styles.userImage} contentFit="cover" source={require('@/assets/images/no-user.png')} />
                 
                 <View>
                     <Text style={typography.medium}>Rusty Miguel O. Ramos</Text>
                     {/**DATE POSTED */}
                     <Text style={typography.small}>{(new Date()).getMonth() + 1}/{new Date().getDate()}/{new Date().getFullYear()}</Text>
                 </View> 
              </View>


              <View style={styles.activityOption}>
                  <Ionicons name='ellipsis-vertical' size={24} color='#3591DD' />
              </View>
           </View>
         </View>



         <View style={styles.activityContent}>
              <Text style={typography.description}>Content....</Text>
               {/**ACTIVITY MEDIA */}
                   <View style={styles.activityContentImageContainer}>
                      {/**MAP CONTENT */}
                        <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'nowrap', height: 'auto' }}>
                           <DisplayMapContent />            
                           <DisplayStepsCountContent />                      
                        </View>

                  {/** DISPLAY PHOTOS*/}
                 
                        {/* <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'nowrap' }}>
                           <Image  style={styles.activityContentImage} contentFit="cover" source={require('@/assets/images/activityimage.jpg')} />
                           <Image  style={styles.activityContentImage} contentFit="cover" source={require('@/assets/images/activityimage.jpg')} />
                        </View> */}
                   </View>


                   {/** NUMBER OF REACTIONS */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 18 }}> 
                      <Entypo name="heart" size={16} color={Colors[colorScheme].green['600']} />
                      <Text style={typography.medium}>10</Text>
                </View>


                {/**Reaction button */}
                <Pressable style={[styles.reactionBtn, { borderColor: Colors[colorScheme].text['200'] }]}> 
                      <Entypo name="heart-outlined" size={16} color={Colors[colorScheme].green['600']} />
                      <Text style={[typography.medium, { color: Colors[colorScheme].green['600'] }]}>Like</Text>
                </Pressable>

         </View>
      </View>





  </View>
 )
    
}


const styles = StyleSheet.create({
    reactionBtn: {
         borderTopWidth: 0.5,
         padding: 5,
         flexDirection: 'row',
         width: '100%',
         alignItems: 'center',
         justifyContent: 'center',
         gap: 5,
         marginTop: 10,
    },
    activityContentImageContainer: { 
        flexDirection: 'column',
        gap: 10,
        borderRadius: 12,
        marginTop: 10,

        width: '100%',
    },
    activityContentImage: { 
        width: '100%',
        maxWidth: 155,
        minWidth: 110,
        height: 150,
        borderRadius: 8,
       
    },
    activityContent: { 
        paddingHorizontal: 16,
        paddingVertical: 8,


    },
    activityOption: { 
        padding: 8,
    },
    userImage: { 
        width: 30,
        height: 30,
        borderRadius: 100,
    },
    user: { 
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    userName: { 
        fontSize: 12,
        fontFamily: "Inter_500Medium",
        fontWeight: "500",
    },
    date: { 
        fontSize: 9,
        fontWeight: "400",
        fontFamily: "Inter_400Regular",
    },
    activityHeader: { 
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 'auto',
        width: '100%',  
    }, 
    activity: { 
        borderRadius: 24,
        height: 'auto',
        width: '100%',
        marginHorizontal: 'auto',
        paddingBottom: 10,
        borderWidth: 1,
        borderColor: '#7B7B7B',
    },

   
  
})