import { Colors } from "@/constants/Colors";
import { typography } from "@/constants/typography";
import { containerStyles } from "@/utils/styles";
import Checkbox from "expo-checkbox";
import React from "react";
import { FlatList, Pressable, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



export default function UnitMeasure () { 
    const colorScheme = useColorScheme() ?? 'light';
     return (
        <>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
           <Pressable hitSlop={12} style={{ padding: 12 }}>
              <Text style={{ color: Colors[colorScheme].green['600'], fontSize: 16, fontWeight: '500' }}>Done</Text>
           </Pressable>
        </View>
        <SafeAreaView style={{ flex: 1, gap: 24, marginTop: 6 }} edges={["top"]}> 
            <View style={[containerStyles.contentContainer]}>
                <View style={{ gap: 12, alignItems: 'center', width: '80%' }}>
                    <Text style={[typography.heading, { color: Colors[colorScheme].text[0] }]}>Unit Measure</Text>
                    <Text style={[typography.description, { color: Colors[colorScheme].text[0], textAlign: 'center' }]}>Change unit measure based on your preferences</Text>
                </View>
            </View>


            <View
             style={{ gap: 12, width: '100%', alignItems: 'flex-start' }}>

            {/**Energy Units */} 
            <View style={{ alignItems: 'flex-start'}}>
              <Text style={[typography.subheading, { textAlign: 'left' }]}>
                Energy Units
              </Text>
            </View>

             <FlatList
              data={['Calories', 'Kilocalories', 'Kilojoules']}
              scrollEnabled={false}
              style={{
                backgroundColor: Colors[colorScheme].frameBackground,
                padding: 12,
                borderRadius: 16,
                marginVertical: 12,
              }}
              renderItem={({ item }) => {
                return (
                  <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: 12, width: '100%', marginBottom: 12 }}>
                    <Pressable style={{ flexDirection: 'column', gap: 6, width: '100%'}}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                        <Text>{item}</Text>
                        
                        <Checkbox 
                          style={{ borderColor: 'transparent', borderWidth: 0 }}
                          value={item === 'Calories'}
                        />
                      </View>

                      {/**Horizontal line */}
                      <View style={{ height: 1, backgroundColor: Colors[colorScheme].text['200'], width: '100%' }} />

                    </Pressable>
                  </View>
                )
              }
              }
            />

            {/* Distance Units */}
            <View style={{ alignItems: 'flex-start'}}>
              <Text style={[typography.subheading, { textAlign: 'left' }]}>
                Distance Units
              </Text>
            </View>

             <FlatList
              data={['Kilometer', 'Miles', 'Meters']}
              scrollEnabled={false}
              style={{
                backgroundColor: Colors[colorScheme].frameBackground,
                padding: 12,
                borderRadius: 16,
                marginVertical: 12,
              }}
              renderItem={({ item }) => {
                return (
                  <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: 12, width: '100%', marginBottom: 12 }}>
                    <Pressable style={{ flexDirection: 'column', gap: 6, width: '100%'}}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                        <Text>{item}</Text>
                        
                        <Checkbox 
                          style={{ borderColor: 'transparent', borderWidth: 0 }}
                          value={item === 'Calories'}
                        />
                      </View>

                      {/**Horizontal line */}
                      <View style={{ height: 1, backgroundColor: Colors[colorScheme].text['200'], width: '100%' }} />

                    </Pressable>
                  </View>
                )
              }
              }
            />

             {/* Distance Units */}
             <View style={{ alignItems: 'flex-start'}}>
              <Text style={[typography.subheading, { textAlign: 'left' }]}>
                Height Units
              </Text>
            </View>

             <FlatList
              data={['Kilometer', 'Miles', 'Meters']}
              scrollEnabled={false}
              style={{
                backgroundColor: Colors[colorScheme].frameBackground,
                padding: 12,
                borderRadius: 16,
                marginVertical: 12,
              }}
              renderItem={({ item }) => {
                return (
                  <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: 12, width: '100%', marginBottom: 12 }}>
                    <Pressable style={{ flexDirection: 'column', gap: 6, width: '100%'}}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                        <Text>{item}</Text>
                        
                        <Checkbox 
                          style={{ borderColor: 'transparent', borderWidth: 0 }}
                          value={item === 'Calories'}
                        />
                      </View>

                      {/**Horizontal line */}
                      <View style={{ height: 1, backgroundColor: Colors[colorScheme].text['200'], width: '100%' }} />

                    </Pressable>
                  </View>
                )
              }
              }
            />
            </View>
        </SafeAreaView>
        </>
     )
}