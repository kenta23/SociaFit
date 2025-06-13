import React from 'react';
import { ScrollView } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { SafeAreaView } from 'react-native-safe-area-context';
import { privacy } from '../library/privacy';

export default function Privacy() {
  return (
    <SafeAreaView edges={['top', 'bottom']}>
       <ScrollView contentInsetAdjustmentBehavior="automatic" style={{ height: '100%', width: '100%', paddingHorizontal: 16 }}>
           <Markdown>{privacy}</Markdown>
       </ScrollView>
    </SafeAreaView>
  )
}