import DisplayMapContent from '@/components/feeds/display_map_content';
import { Colors } from '@/constants/Colors';
import { typography } from '@/constants/typography';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';




export default function Profile() {

    const colorScheme = useColorScheme() ?? 'light';

    return (
        <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
          <ScrollView style={styles.container}>  
              {/**QR CODE SCANNER */}
              <Pressable style={styles.qrCodeScanner}>
                <Ionicons name='qr-code-outline' size={28} color='#3591DD' />
              </Pressable>
           

            {/**Your Profile View */}
            <View style={styles.parent}>
                <View style={styles.view}>

                    <View style={[styles.frameParent, styles.frameFlexBox]}>
                        <Image style={styles.frameChild} contentFit="cover" source={require('@/assets/images/no-user.png')} />
                 
                        <View style={styles.nameContainer}>
                            <Text style={[typography.heading]}>Rusty Miguel O. Ramos</Text>
                            <Text style={typography.medium}>@dreyyy</Text>
                        </View>
                    </View>


                    <View style={[styles.frameGroup, styles.frameFlexBox]}>
                        <View style={[styles.groupFlexBox]}>
                            <Text style={[typography.medium]}>400</Text>
                            <Text style={[typography.description]}>Total likes</Text>
                        </View>

                        <View style={[styles.groupFlexBox]}>
                            <Text style={[typography.medium]}>26</Text>
                            <Text style={[typography.description]}>Activities</Text>
                        </View>

                        <View style={styles.groupFlexBox}>
                            <Text style={[typography.medium]}>55</Text>
                            <Text style={[typography.description]}>Followers</Text>
                        </View>

                    </View>
                </View>
            </View>

   {/** Horizontal Line */}
   <View style={{ height: 1, backgroundColor: Colors[colorScheme].text['50'], width: '100%', marginVertical: 10 }} />

            {/**YOUR ACTIVITIES */}
            <View style={styles.activitiesContainer}>
                <Text style={typography.subheading}>Your Activities</Text>

            <View style={{ gap: 10, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>            
              {/**Activity 1 */}
                 <View style={[styles.activity, { backgroundColor: Colors[colorScheme].frameBackground, shadowColor: '#DBDADA', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }]}>
                   <View style={{ paddingHorizontal: 10, alignSelf: 'flex-start' }}>     
                     
                       <View style={styles.activityHeader}>   
                        <View style={styles.user}>
                            <Image style={styles.userImage} contentFit="cover" source={require('@/assets/images/no-user.png')} />
                           
                           <View>
                               <Text style={typography.medium}>Rusty Miguel O. Ramos</Text>
                               <Text style={typography.small}>gkjgkjskjkjgs</Text>
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
                                  <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'nowrap' }}>
                                     <DisplayMapContent />                               
                                     <Image  style={styles.activityContentImage} contentFit="cover" source={require('@/assets/images/activityimage.jpg')} />
                                  </View>

                                  <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'nowrap' }}>
                                     <Image  style={styles.activityContentImage} contentFit="cover" source={require('@/assets/images/activityimage.jpg')} />
                                     <Image  style={styles.activityContentImage} contentFit="cover" source={require('@/assets/images/activityimage.jpg')} />
                                  </View>
                             </View>

                   </View>
                </View>


            </View>
        </View>
            
            {/* Add bottom padding for better scrolling experience */}
            <View style={{ height: 50 }} />
         </ScrollView>
     </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    activityContentImageContainer: { 
        height: 'auto',
        flexDirection: 'column',
        gap: 10,
        borderRadius: 12,
        marginTop: 10,
        flex: 1,
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
        height: 'auto',
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
        width: '96%',
        marginHorizontal: 'auto',
        paddingBottom: 10,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#7B7B7B',
    },

    container: { 
        flex: 1,
        width: '100%',
        paddingHorizontal: 24,
      },
    activitiesContainer: { 
         marginTop: 12,
         gap: 10,
    },
    qrCodeScanner: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        width: 'auto',
        height: 60,
        justifyContent: 'center',
    },
    /**Your Profile View Styles */
    parent: {
        marginTop: 25,
        paddingVertical: 12,
        height: 'auto',
    },
    frameFlexBox: {
        alignItems: "center",
        flexDirection: "row"
    },
    groupFlexBox: {
        gap: 4,
        alignItems: "center"
    },
    frameChild: {
        width: 75,
        borderRadius: 100,
        height: 75,
        overflow: "hidden"
    },
    myName: {
        fontSize: 18,
        fontFamily: "Inter_400Regular",
        textAlign: "center"
    },
    username: {
        fontSize: 16,
        fontWeight: "500",
        fontFamily: "Inter_500Medium",
        textAlign: "left",
        alignSelf: "stretch"
    },
    nameContainer: {
        width: 'auto',
        gap: 7,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    frameParent: {
        gap: 13,
        alignSelf: "stretch"
    },
    values: {
        fontSize: 20,
        fontWeight: "600",
        fontFamily: "Inter_600SemiBold"
    },
    description: {
        fontSize: 12,
        fontFamily: "Inter_400Regular"
    },

    followers: {
        width: 61,
        height: 15
    },
    frameGroup: {
        gap: 25,
        justifyContent: "center"
    },
    view: {
        width: "auto",
        alignItems: "center",
        gap: 15,
        justifyContent: "center",
        flexDirection: 'column',
    }

})