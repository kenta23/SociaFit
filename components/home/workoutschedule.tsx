import { Colors } from '@/constants/Colors';
import { typography } from '@/constants/typography';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';


const days = [{
  day: 'Monday',
  isWorkout: true,
},
{
  day: 'Tuesday',
  isWorkout: true,
},
{
  day: 'Wednesday',
  isWorkout: true,
},
{
  day: 'Thursday',
  isWorkout: false,
},
{
  day: 'Friday',
  isWorkout: true,
},
{
  day: 'Saturday',
  isWorkout: false,
},
{
  day: 'Sunday',
  isWorkout: false,
},
];

export default function WorkoutSchedule() {
  const colorScheme = useColorScheme() ?? 'light';
  return (
      <View style={styles.parent}>
        <Text style={typography.heading}>Workout Schedule</Text>  


        <View style={styles.inner}>
            {days.map((dayObj, index) => (
              <View
                key={dayObj.day}
                style={[
                  styles.frameWrapper,
                  dayObj.isWorkout ? {
                    borderColor: Colors[colorScheme].green[600],
                  } : {
                    borderColor: Colors[colorScheme].pink[600],
                  },
                ]}
              >
                <View style={[styles.item]}>
                  {dayObj.isWorkout ? (
                    <MaterialCommunityIcons name="arm-flex" size={20} color={Colors[colorScheme].green[600]} />
                  ) : (
                    <FontAwesome6 name="x" size={20} color={Colors[colorScheme].pink[600]} />
                  )}
                  <Text style={[typography.description, {
                    color: dayObj.isWorkout ? Colors[colorScheme].green[600] : Colors[colorScheme].pink[600],
                  }]}>{dayObj.day}</Text>
                </View>
              </View>
            ))}
       </View>
        </View>
  )
}


const styles = StyleSheet.create({
  parent: {
     width: "100%",
     gap: 16,
     height: 'auto',
     marginVertical: 16,
  },
  frameWrapper: {
    height: 43,
    borderRadius: 100,
    width: 126,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderStyle: "solid",
  },
  item: {
    gap: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
 
  title: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Inter_500Medium",
    textAlign: 'left',
    alignItems: 'stretch'
  },

  iwwadeleteIcon: {
    overflow: "hidden"
  },

  iwwadeleteParent: {
    marginTop: -7,
    marginLeft: -40,
    minWidth: 52
  },
  frameParent: {
    width: 323,
    height: 500,
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    alignContent: "center",
    rowGap: 24,
    columnGap: 42,
    flexDirection: "row",
    left: "50%",
    top: "50%",
    position: "absolute"
  },
  inner: {
    borderWidth: 1,
    borderColor: "#DBDADA",
    borderStyle: "solid",
    shadowColor: "#dbdada",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 10,
    paddingVertical: 17,
    shadowOpacity: 1,
    borderRadius: 16,
    backgroundColor: "rgba(172, 172, 172, 0.1)",
    height: 'auto',
    overflow: "hidden",
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 24,
    columnGap: 42,
  },
 
});
