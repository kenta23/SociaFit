import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';




export default function Profile() {

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
                            <Text style={[styles.myName]}>Rusty Miguel O. Ramos</Text>
                            <Text style={styles.username}>@dreyyy</Text>
                        </View>
                    </View>


                    <View style={[styles.frameGroup, styles.frameFlexBox]}>
                        <View style={[styles.groupFlexBox]}>
                            <Text style={[styles.values]}>400</Text>
                            <Text style={[styles.description]}>Total likes</Text>
                        </View>

                        <View style={[styles.groupFlexBox]}>
                            <Text style={[styles.values]}>26</Text>
                            <Text style={[styles.description]}>Activities</Text>
                        </View>

                        <View style={styles.groupFlexBox}>
                            <Text style={[styles.values]}>55</Text>
                            <Text style={[styles.description]}>Followers</Text>
                        </View>

                    </View>
                </View>
            </View>


            {/**YOUR ACTIVITIES */}
            <View style={styles.activitiesContainer}>
                <Text style={styles.activitiesTitle}>Your Activities</Text>

               <View style={{ gap: 10, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>          
             
                 <View style={styles.activity}>
                   <View style={{ paddingHorizontal: 12, alignSelf: 'flex-start' }}>     
                       <View style={styles.activityHeader}>
                        
                        <View style={styles.user}>
                            <Image style={styles.userImage} contentFit="cover" source={require('@/assets/images/no-user.png')} />
                           
                           <View>
                               <Text style={styles.userName}>Rusty Miguel O. Ramos</Text>
                               <Text style={styles.date}>gkjgkjskjkjgs</Text>
                           </View>
                        </View>


                        <View style={styles.activityOption}>
                            <Ionicons name='ellipsis-vertical' size={24} color='#3591DD' />
                        </View>
                     </View>
                   </View>



                   <View style={styles.activityContent}>
                        <Text style={styles.activityContentText}>Content....</Text>


                         {/**ACTIVITY MEDIA */}
                        <View style={styles.activityContentImage}>
                             <View style={styles.activityContentImageContainer}>
                                <Image  style={styles.activityContentImage} contentFit="cover" source={require('@/assets/images/activityimage.jpg')} />
                                <Image  style={styles.activityContentImage} contentFit="cover" source={require('@/assets/images/activityimage.jpg')} />
                                <Image  style={styles.activityContentImage} contentFit="cover" source={require('@/assets/images/activityimage.jpg')} />
                                <Image  style={styles.activityContentImage} contentFit="cover" source={require('@/assets/images/activityimage.jpg')} />
                             </View>
                        </View>
                   </View>
                </View>


               <View style={styles.activity}>
                   <View style={{ paddingHorizontal: 12, alignSelf: 'flex-start' }}>     
                       <View style={styles.activityHeader}>
                        
                        <View style={styles.user}>
                            <Image style={styles.userImage} contentFit="cover" source={require('@/assets/images/no-user.png')} />
                           
                           <View>
                               <Text style={styles.userName}>Rusty Miguel O. Ramos</Text>
                               <Text style={styles.date}>gkjgkjskjkjgs</Text>
                           </View>
                        </View>


                        <View style={styles.activityOption}>
                            <Ionicons name='ellipsis-vertical' size={24} color='#3591DD' />
                        </View>
                     </View>
                   </View>



                   <View style={styles.activityContent}>
                        <Text style={styles.activityContentText}>Content....</Text>


                         {/**ACTIVITY MEDIA */}
                        <View style={styles.activityContentImage}>
                             <View style={styles.activityContentImageContainer}>
                                <Image  style={styles.activityContentImage} contentFit="cover" source={require('@/assets/images/activityimage.jpg')} />
                                <Image  style={styles.activityContentImage} contentFit="cover" source={require('@/assets/images/activityimage.jpg')} />
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
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        borderRadius: 12,
        marginTop: 10,
    },
    activityContentImage: { 
        width: '100%',
        minWidth: 150,
        height: 150,
        borderRadius: 8,
        flex: 1,
    },
    activityContentText: {  
        textAlign: 'left',
        fontSize: 14,
        fontFamily: "Inter_400Regular",
        fontWeight: "400",
    },
    activityContent: { 
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: 'white',
        height: 'auto',
        minHeight: 100,
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
        minHeight: 100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 'auto',
        width: '100%',  
    },
    activity: { 
        backgroundColor: 'lightgray',
        borderRadius: 24,
        height: 'auto',
        width: '96%',
        marginHorizontal: 'auto',
        paddingBottom: 10,
        marginTop: 10,
    },
    activitiesTitle: { 
        fontSize: 18,
        fontFamily: "Inter_500Medium",
        fontWeight: "500",
        textAlign: "center",
        marginBottom: 10,
    },
    container: { 
        flex: 1,
        width: '100%',
        paddingHorizontal: 12,
      },
    activitiesContainer: { 
         marginTop: 30,
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
        padding: 16,
        height: 'auto',
        minHeight: 200,
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