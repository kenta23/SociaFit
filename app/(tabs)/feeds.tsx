import ActivityContent from '@/components/feeds/activities';
import { Colors } from '@/constants/Colors';
import { getAuthUser } from '@/utils/auth';
import { containerStyles } from '@/utils/styles';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Feeds() {
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();
  const user =  getAuthUser();
  const [userid, setUserid] = useState<string | null>(null);

  useEffect(() => { 
    const getUser = async () => { 
      const user = await getAuthUser();
      setUserid(user.data.user?.id as string);
    }
    getUser();
  }, []);


  

  return (
    <SafeAreaView  style={[containerStyles.container, {backgroundColor: Colors[colorScheme].background}]}>
           <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}> 
               <ActivityContent userid={userid as string} />

            </ScrollView> 
        
           <Pressable onPress={() => router.push('/share-activity')} style={[styles.editBtn, {backgroundColor: Colors[colorScheme].primary}]} hitSlop={12}> 
              <View>
                   <FontAwesome6 name="edit" size={24} color="white" />
               </View>   
           </Pressable>

        
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({ 
  container: { 
    flex: 1,
    width: '100%',
  },
  editBtn: { 
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 100,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
})