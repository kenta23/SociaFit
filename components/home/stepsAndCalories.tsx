import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function StepsAndCalories() {
  return (
    <View style={styles.container}>
      <View style={styles.frameParent}>
        <View style={styles.frameGroup}>
          <View style={styles.stepsCountParent}>
            <Text
              style={[styles.stepsCount, styles.todayClr]}
            >{`Steps count `}</Text>
            <Text style={styles.text}>1200</Text>
          </View>
          <Text style={[styles.today, styles.todayClr]}>Today</Text>
        </View>
      </View>

      <View style={styles.frameParent}>
        <View style={styles.frameGroup}>
          <View style={styles.stepsCountParent}>
            <Text style={[styles.stepsCount, styles.todayClr]}>
              Calories burnt
            </Text>
            <Text style={styles.text}>539</Text>
          </View>
          <Text style={[styles.today, styles.todayClr]}>kCal</Text>
        </View>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
    container: { 
         width: '100%',
         flexDirection: 'row',
         justifyContent: 'space-between',
         alignItems: 'center',
         gap: 10,
         marginTop: 16,
    },
    todayClr: {
        color: "#000",
        letterSpacing: -0.2,
        textAlign: "left"
        },
        stepsCount: {
        fontSize: 10,
        lineHeight: 10,
        fontWeight: "300",
        fontFamily: "Inter-Light",
        textAlign: "left",
        alignSelf: "stretch"
        },
        text: {
        fontSize: 18,
        letterSpacing: -0.4,
        lineHeight: 18,
        fontWeight: "600",
        fontFamily: "Inter-SemiBold",
        color: "#b4a324",
        textAlign: "left",
        alignSelf: "stretch"
        },
        stepsCountParent: {
        width: 76,
        gap: 7
        },
        today: {
        fontSize: 12,
        lineHeight: 12,
        fontFamily: "Inter-Regular",
        textAlign: "left"
        },

  frameGroup: {
        position: "absolute",
        marginTop: -18,
        marginLeft: -67.5,
        top: "50%",
        left: "50%",
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 27
     },
frameParent: {
        borderRadius: 8,
        borderStyle: "solid",
        borderColor: "#f4ecd0",
        borderWidth: 1,
        flex: 1,
        width: "auto",
        height: 64,
        overflow: "hidden"
        }  
})