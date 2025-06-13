import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Feeds() {
  const router = useRouter();
  return (
    <SafeAreaView>
       <Pressable style={{ backgroundColor: 'red', padding: 10, borderRadius: 10 }} onPress={() => router.push('/location')}>
        <Text>Location</Text>
       </Pressable>
       <Pressable style={{ backgroundColor: 'blue', padding: 10, borderRadius: 10 }} onPress={() => router.push('/location2')}>
        <Text>Location2</Text>
       </Pressable>
    </SafeAreaView>
  )
}