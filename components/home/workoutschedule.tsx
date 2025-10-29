import { Colors } from "@/constants/Colors";
import { typography } from "@/constants/typography";
import type { Database } from "@/database.types";
import { supabase } from "@/utils/supabase";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

const days = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
];

export default function WorkoutSchedule() {
	const colorScheme = useColorScheme() ?? "light";
	const [data, setData] = useState<
		(Database["public"]["Tables"]["workout_days"]["Row"] & {
			days_of_week: Database["public"]["Tables"]["days_of_week"]["Row"];
		})[]
	>([]);
	const [workoutSplits, setWorkoutSplits] = useState<
		(Database["public"]["Tables"]["workout_splits"]["Row"] & {
			workout_days: Database["public"]["Tables"]["workout_days"]["Row"];
		})[]
	>([]);

	useEffect(() => {
		async function getData() {
			const user = await supabase.auth.getUser();
			const { data: workoutDays, error: workoutDaysError } = await supabase
				.from("workout_days")
				.select("*, days_of_week(*)")
				.eq("user_id", user.data.user?.id as string);
			const { data: workoutSplits, error: workoutSplitsError } = await supabase
				.from("workout_splits")
				.select("*, workout_days(*)")
				.eq("workout_days.user_id", user.data.user?.id as string);

			if (workoutSplits) {
				// Filter out any workoutSplits where workout_days is null to satisfy the type
				setWorkoutSplits(
					workoutSplits.filter(
						(
							split,
						): split is typeof split & {
							workout_days: NonNullable<typeof split.workout_days>;
						} => split.workout_days !== null,
					),
				);
			}
			if (workoutSplitsError) {
				console.log("workoutSplitsError", workoutSplitsError);
			}
			if (workoutDays) {
				setData(workoutDays);
			}
			if (workoutDaysError) {
				console.log("workoutDaysError", workoutDaysError);
			}
		}
		getData();
	}, []);

	return (
		<View style={styles.parent}>
			<Text
				style={[typography.heading, { color: Colors[colorScheme].text[0] }]}
			>
				Workout Schedule
			</Text>

			<View style={styles.inner}>
				{days.map((dayName, index) => {
					const isWorkoutDay = workoutSplits.find(
						(day) => day.workout_days?.day === index + 1,
					);
					return (
						<View
							key={dayName}
							style={[
								styles.frameWrapper,
								{
									borderColor: isWorkoutDay
										? Colors[colorScheme].green[600]
										: Colors[colorScheme].pink[600],
								},
							]}
						>
							<View style={[styles.item]}>
								{isWorkoutDay ? (
									<MaterialCommunityIcons
										name="arm-flex"
										size={20}
										color={Colors[colorScheme].green[600]}
									/>
								) : (
									<FontAwesome6
										name="x"
										size={20}
										color={Colors[colorScheme].pink[600]}
									/>
								)}
								<Text
									style={[
										typography.description,
										{
											color: isWorkoutDay
												? Colors[colorScheme].green[600]
												: Colors[colorScheme].pink[600],
										},
									]}
								>
									{dayName}
								</Text>
							</View>
						</View>
					);
				})}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	parent: {
		width: "100%",
		gap: 16,
		height: "auto",
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
		textAlign: "left",
		alignItems: "stretch",
	},

	iwwadeleteIcon: {
		overflow: "hidden",
	},

	iwwadeleteParent: {
		marginTop: -7,
		marginLeft: -40,
		minWidth: 52,
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
		position: "absolute",
	},
	inner: {
		borderWidth: 1,
		borderColor: "#DBDADA",
		borderStyle: "solid",
		shadowColor: "#dbdada",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowRadius: 10,
		paddingVertical: 17,
		shadowOpacity: 1,
		borderRadius: 16,
		backgroundColor: "rgba(172, 172, 172, 0.1)",
		height: "auto",
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
