import { termsAndConditions } from '@/library/terms-and-conditions'
import React from 'react'
import { ScrollView } from 'react-native'
import Markdown from 'react-native-markdown-display'
import { SafeAreaView } from 'react-native-safe-area-context'



export default function Terms() {
  return (
    <SafeAreaView edges={['top', 'bottom']}>
     <ScrollView contentInsetAdjustmentBehavior="automatic" style={{ height: '100%', width: '100%', paddingHorizontal: 16 }}>
        <Markdown>{termsAndConditions}</Markdown>
    </ScrollView>
 </SafeAreaView>
  )
}