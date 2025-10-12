import { getUserAvatar } from "@/utils/data";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



export default function PersonalInfo() {

    const [avatar, setAvatar] = useState<string | null>(null);


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
            <ScrollView contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }} showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

                {/* Avatar */}
                 <View style={{ flexDirection: 'column', marginTop: 24, backgroundColor: 'red', gap: 12, flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}> 
                       <View style={{ flexDirection: 'column', gap: 4 }}> 
                        <View style={{width: 'auto', height: 'auto', position: 'relative'}}>
                            <Image source={avatar ? { uri: avatar } : require('@/assets/images/no-user.png')} style={{ width: 150, borderWidth: 1, borderColor: '#000', height: 150, borderRadius: 100 }} />

                            <View style={{ position: 'absolute', bottom: 0, right: 0, flexDirection: 'row', gap: 4, alignItems: 'center', width: 45, height: 45, justifyContent: 'center', borderRadius: 100, padding: 2, backgroundColor: '#E5E5E5' }}>
                                <Feather name="edit" size={24} color="black" />
                            </View>
                        </View>
                    </View>
                 </View>



            </ScrollView>
        </SafeAreaView>
    )
}