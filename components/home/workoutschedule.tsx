import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text, View } from 'react-native';


const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function WorkoutSchedule() {
  return (
      <View style={styles.parent}>
        <Text style={styles.title}>Workout Schedule</Text>  


        <View style={styles.inner}>
            <View style={[styles.frameWrapper, styles.workoutDays]}>
              <View style={[styles.item]}>
                <MaterialCommunityIcons name="fire" size={24} color="black" />
                <Text>Monday</Text>
              </View>
            </View>


            <View style={[styles.frameWrapper, styles.workoutDays]}>
              <View style={[styles.item]}>
                <MaterialCommunityIcons name="fire" size={24} color="black" />
                <Text>Tuesday</Text>
              </View>
            </View>
            <View style={[styles.frameWrapper, styles.workoutDays]}>
              <View style={[styles.item]}>
                <MaterialCommunityIcons name="fire" size={24} color="black" />
                <Text>Wednesday</Text>
              </View>
            </View>
            <View style={[styles.frameWrapper, styles.nonWorkoutDays]}>
              <View style={[styles.item]}>
                <FontAwesome6 name="x" size={20} color="#ED3C3C" />
                <Text >Thursday</Text>
              </View> 
            </View>
            <View style={[styles.frameWrapper, styles.workoutDays]}>
              <View style={[styles.item]}>
                <MaterialCommunityIcons name="fire" size={24} color="black" />
                <Text>Friday</Text>
              </View>
            </View>
              <View style={[styles.frameWrapper, styles.nonWorkoutDays]}>
              <View style={[styles.item]}>
                <FontAwesome6 name="x" size={20} color="#ED3C3C" />
                <Text>Saturday</Text>
              </View>
            </View>
            <View style={[styles.frameWrapper, styles.nonWorkoutDays]}>
              <View style={[styles.item]}>
                <FontAwesome6 name="x" size={20} color="#ED3C3C" />
                <Text>Sunday</Text>
              </View>
            </View>
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
  workoutDays: {
    backgroundColor: "#73ee84"
  },
  nonWorkoutDays: { 
    borderColor: "#e9a8c9",
    borderWidth: 1,
    borderStyle: "solid",
  },
  frameWrapper: {
    height: 43,
    borderRadius: 100,
    width: 126,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    gap: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
 
  title: {
    fontSize: 18,
    fontWeight: "600",
    fontStyle: 'normal'
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
    shadowColor: "#dbdada",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 10,
    paddingVertical: 12,
    shadowOpacity: 1,
    borderRadius: 16,
    backgroundColor: "rgba(172, 172, 172, 0.1)",
    height: 260,
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
