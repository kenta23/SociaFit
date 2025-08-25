import { typography } from '@/constants/typography';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';


export default function WorkoutTips() { 
     return (
         <View style={styles.parent}>
             <Text style={typography.heading}>Workout Tips</Text>

                 <View style={styles.frameParent}>

                 <Link href={{
                     pathname: '/tips/[id]',
                     params: { id: '1' },
                 }}>
                    <View style={styles.item}>
                         <Image style={styles.backgroundImage} contentFit="cover" source={require('@/assets/tip 1.png')}/>
                          <Text style={[styles.theImportanceOf, styles.tooBusyToTypo]}>The Importance of a Bench Press Arch</Text>
                         <Image style={[styles.akarIconsarrowUp, styles.tooBusyToPosition]} contentFit="cover" source={require('@/assets/arrow-up.svg')} />
                         <View style={styles.frameGroup}>
                             <View style={[styles.chestWorkoutWrapper, styles.wrapperLayout]}>
                                 <Text style={[styles.chestWorkout, styles.proPosition]}>Chest workout</Text>
                             </View>
                             <View style={[styles.beginnerWrapper, styles.wrapperLayout]}>
                                 <Text style={[styles.beginner, styles.proPosition]}>Beginner</Text>
                             </View>
                             <View style={[styles.proWrapper, styles.wrapperLayout]}>
                                 <Text style={[styles.pro, styles.proPosition]}>Pro</Text>
                             </View>
                         </View>
                      </View>
                     </Link>


                     <Link href={{
                     pathname: '/tips/[id]',
                     params: { id: '2' },
                 }}>
                    <View style={styles.item}>
                         <Image style={styles.backgroundImage} contentFit="cover" source={require('@/assets/tip 2.png')}/>
                         <Text style={[styles.tooBusyTo, styles.tooBusyToPosition]}>Too Busy to Work Out? Try ThisWeekend-Only Workout Plan.</Text>
                         <Image style={[styles.akarIconsarrowUp, styles.tooBusyToPosition]} contentFit="cover" source={require('@/assets/arrow-up.svg')} />
                         <View style={styles.frameGroup}>
                             <View style={[styles.beginnerWrapper, styles.wrapperLayout]}>
                                 <Text style={[styles.beginner, styles.proPosition]}>Workout</Text>
                             </View>
                             <View style={[styles.beginnerWrapper, styles.wrapperLayout]}>
                                 <Text style={[styles.beginner, styles.proPosition]}>Beginner</Text>
                             </View>
                             <View style={[styles.beginnerWrapper, styles.wrapperLayout]}>
                                 <Text style={[styles.fitness, styles.fitnessPosition]}>Fitness</Text>
                             </View>
                         </View>
                      </View>
                     </Link>


                     <Link href={{
                     pathname: '/tips/[id]',
                     params: { id: '3' },
                 }}>
                    <View style={styles.item}>
                         <Image style={styles.backgroundImage} contentFit="cover" source={require('@/assets/tip 3.png')}/>
                         <Text style={[styles.tooBusyTo, styles.tooBusyToPosition]}>How to Make Exercise a Regular Habit in 6 Steps</Text>
                         <Image style={[styles.akarIconsarrowUp, styles.tooBusyToPosition]} contentFit="cover" source={require('@/assets/arrow-up.svg')} />
                         <View style={styles.frameGroup}>
                             <View style={[styles.habitWrapper, styles.wrapperLayout]}>
                                 <Text style={[styles.habit, styles.proPosition]}>Habit</Text>
                             </View>
                             <View style={[styles.beginnerFrame, styles.wrapperLayout]}>
                                 <Text style={[styles.beginner, styles.proPosition]}>Beginner</Text>
                             </View>
                             <View style={[styles.fitnessContainer, styles.wrapperLayout]}>
                                 <Text style={[styles.fitness1, styles.fitnessPosition]}>Fitness</Text>
                             </View>
                         </View>
                       </View>
                     </Link>
                 </View>
         </View>

     );
}


const styles = StyleSheet.create({
    parent: {
        flex: 1,
        marginVertical: 8,
        width: '100%',
        height: 'auto',
        gap: 20
    },
    tooBusyToTypo: {
        color: "#fff",
        fontSize: 16,
        left: 15,
        textAlign: "left",
        fontFamily: "Inter_500Medium",
        fontWeight: "500"
    },
    tooBusyToPosition: {
        height: 38,
        top: 26,
        position: "absolute"
    },
    wrapperLayout: {
        height: 17,
        backgroundColor: "#b4a324",
        borderRadius: 100,
        overflow: "hidden"
    },
    proPosition: {
        height: 9,
        fontFamily: "Inter-Regular",
        fontSize: 8,
        left: "50%",
        top: "50%",
        marginTop: -4.5,
        color: "#fff",
        position: "absolute",
        textAlign: "left"
    },
    fitnessPosition: {
        marginLeft: -14.5,
        height: 9,
        fontFamily: "Inter-Regular",
        fontSize: 8,
        left: "50%",
        top: "50%",
        marginTop: -4.5,
        color: "#fff",
        position: "absolute",
        textAlign: "left"
    },
    title: {
        fontSize: 18,
        color: "#000",
        textAlign: "left",
        fontFamily: "Inter_500Medium",
        fontWeight: "500",
        alignSelf: "stretch"
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        position: "absolute",
        borderRadius: 24,
    },
    theImportanceOf: {
        width: 230,
        top: 26,
        fontSize: 16,
        left: 15,
        position: "absolute"
    },
    akarIconsarrowUp: {
        right: 9,
        borderRadius: 50,
        width: 38,
        overflow: "hidden"
    },
    chestWorkout: {
        marginLeft: -27.5,
        width: 57
    },
    chestWorkoutWrapper: {
        width: 67
    },
    beginner: {
        marginLeft: -17.5,
        width: 35
    },
    beginnerWrapper: {
        width: 61
    },
    pro: {
        marginLeft: -6.5,
        width: 13
    },
    proWrapper: {
        width: 39
    },
    frameGroup: {
        bottom: 9,
        left: 22,
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        position: "absolute"
    },
    item: {
        borderRadius: 24,
        backgroundColor: "rgba(172, 172, 172, 0.1)",
        height: 120,
        width: '100%',
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
    },
    tooBusyTo: {
        width: 243,
        color: "#fff",
        fontSize: 16,
        left: 15,
        textAlign: "left",
        fontFamily: "Inter-Medium",
        fontWeight: "500"
    },
    fitness: {
        width: 30
    },
    habit: {
        marginLeft: -10,
        width: 21
    },
    habitWrapper: {
        width: 44
    },
    beginnerFrame: {
        width: 51
    },
    fitness1: {
        width: 29
    },
    fitnessContainer: {
        width: 47
    },
    frameParent: {
        gap: 25,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",   
    },
});
