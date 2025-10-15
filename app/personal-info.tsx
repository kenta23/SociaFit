import { Colors } from "@/constants/Colors";
import { typography } from "@/constants/typography";
import { getUserAvatar } from "@/utils/data";
import { containerStyles } from "@/utils/styles";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



export default function PersonalInfo() {

    const [avatar, setAvatar] = useState<string | null>(null);
    const colorScheme = useColorScheme() ?? 'light';


    useEffect(() => { 
        const getAvatar = async () => { 
            const avatar = await getUserAvatar();
            setAvatar(avatar);
        }
        getAvatar();

    }, []);

    console.log('avatar', avatar);


    return (
        <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }} showsVerticalScrollIndicator={false} style={containerStyles.container}>

                {/* Avatar */}
                 <View style={{ flexDirection: 'column', marginTop: 24, gap: 12, flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}> 
                    <View style={{ flexDirection: 'column', gap: 4 }}> 
                        <View style={{width: 'auto', height: 'auto', position: 'relative'}}>
                            <Image source={avatar ? { uri: avatar } : require('@/assets/images/no-user.png')} style={{ width: 150, borderWidth: 1, borderColor: '#000', height: 150, borderRadius: 100 }} />

                            <View style={{ position: 'absolute', bottom: 0, right: 0, flexDirection: 'row', gap: 4, alignItems: 'center', width: 45, height: 45, justifyContent: 'center', borderRadius: 100, padding: 2, backgroundColor: '#E5E5E5' }}>
                                <Feather name="edit" size={24} color="black" />
                            </View>
                        </View>
                    </View>

                    <Text style={typography.heading}>Your Avatar</Text>
                 </View>


                 <View style={{ flexDirection: 'column', gap: 12, flex: 1, width: '100%', marginTop: 24, alignItems: 'center', justifyContent: 'center' }}>
                      <View style={{ flexDirection: 'column', gap: 4, width: '100%' }}>
                           <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}> 
                               <Text style={[typography.heading, { fontWeight: '500',  }]}>Personal Information</Text>

                               <Pressable>
                                  <Text>Edit</Text>
                               </Pressable>
                           </View>

                        <View style={{ flexDirection: 'column', gap: 8, marginTop: 12, }}> 
                            {/**Name */}
                           <View style={{ flexDirection: 'column', gap: 4}}> 
                               <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center'}}> 
                              
                                      {/** Icon */}
                                      <Ionicons name="person" size={20} color="black" />
                                 
                                 <View style={{ flexDirection: 'column', gap: 4}}>
                                      <Text style={[typography.description, { color: Colors[colorScheme].text['400'] }]}>Full Name</Text>
                                      <Text style={typography.subheading}>John Doe</Text>
                                 </View>
                                 
                               </View>
                           </View>



                             {/**Email */}
                             <View style={{ flexDirection: 'column', gap: 4}}> 
                               <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center'}}> 
                              
                                      {/** Icon */}
                                      <Ionicons name="mail" size={20} color="black" />
                                 
                                 <View style={{ flexDirection: 'column', gap: 4}}>
                                      <Text style={[typography.description, { color: Colors[colorScheme].text['400'] }]}>Email</Text>
                                      <Text style={typography.subheading}>John Doe</Text>
                                 </View>
                                 
                               </View>
                             </View>
                           </View>
                      </View>
                 </View>



            </ScrollView>
        </SafeAreaView>
    )
}