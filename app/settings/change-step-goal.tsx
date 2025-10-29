import { Colors } from "@/constants/Colors";
import { typography } from "@/constants/typography";
import type { Database } from "@/database.types";
import { useStoreData, useStoreHealthDetails } from "@/utils/states";
import { containerStyles } from "@/utils/styles";
import { supabase } from "@/utils/supabase";
import { AntDesign } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import {
  getSdkStatus,
  initialize,
  readRecords,
  requestPermission,
  type RecordResult,
} from "react-native-health-connect";
import { SafeAreaView } from "react-native-safe-area-context";

interface HealthDetails {
	weight: number; // in kg
	height: number; // in cm
	age: number;
	gender: "male" | "female";
	walkingPace: "slow" | "average" | "brisk";
}

export default function ChangeStepGoal() {
	const colorScheme = useColorScheme() ?? "light";
	const { healthDetails } = useStoreHealthDetails();
	const [derivedWalkingPace, setDerivedWalkingPace] =
		useState<HealthDetails["walkingPace"]>("average");
	const [averageSpeedMs, setAverageSpeedMs] = useState<number | null>(null);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const isLongPressingRef = useRef<boolean>(false);
	const { data, storeData } = useStoreData();
	const [stepGoal, setStepGoal] = useState<number>(data?.steps_goal || 0);

	// Derive walking pace from Health Connect distance data
	useEffect(() => {
		const fetchWalkingSpeed = async () => {
			try {
				await getSdkStatus();
				const ok = await initialize();
				if (!ok) return;

				await requestPermission([
					{ accessType: "read", recordType: "Distance" },
				]);

				const end = new Date();
				const start = new Date(
					end.getFullYear(),
					end.getMonth(),
					end.getDate(),
				); // today

				const distanceRecords = await readRecords("Distance", {
					timeRangeFilter: {
						operator: "between",
						startTime: start.toISOString(),
						endTime: end.toISOString(),
					},
				});

				// Compute average speed across records (meters / second)
				const totals = (
					distanceRecords.records as RecordResult<"Distance">[]
				).reduce(
					(acc, rec) => {
						const distanceM = rec.distance?.inMeters ?? 0;
						const startMs = new Date(rec.startTime).getTime();
						const endMs = new Date(rec.endTime).getTime();
						const durationSec = Math.max(0, (endMs - startMs) / 1000);
						return {
							distanceM: acc.distanceM + distanceM,
							durationSec: acc.durationSec + durationSec,
						};
					},
					{ distanceM: 0, durationSec: 0 },
				);

				if (totals.durationSec > 0 && totals.distanceM > 0) {
					const avg = totals.distanceM / totals.durationSec; // m/s
					setAverageSpeedMs(avg);
					// Map to pace buckets (approx thresholds)
					const pace: HealthDetails["walkingPace"] =
						avg < 1.2 ? "slow" : avg < 1.7 ? "average" : "brisk";
					setDerivedWalkingPace(pace);
				}
			} catch (e) {
				console.log("Failed to derive walking speed from Health Connect", e);
			}
		};
		fetchWalkingSpeed();
	}, []);

	function calculateCaloriesBurned(steps: number): number {
		// Convert height to meters
		const heightInMeters = ((healthDetails?.height ?? 0) as number) / 100;
		const walkingPace = derivedWalkingPace;

		// Calculate stride length
		const strideLength = heightInMeters * 0.414;

		// Calculate distance walked
		const distance = strideLength * steps;

		// Determine MET value based on walking pace
		const metValues = {
			slow: 2.8,
			average: 3.5,
			brisk: 5.0,
		};

		const met = metValues[walkingPace];

		// Calculate time spent walking using derived average speed (fallback 1.34 m/s)
		const walkingSpeed = averageSpeedMs ?? 1.34; // m/s
		const timeInHours = distance / walkingSpeed / 3600;

		// Calculate base calories burned
		const weight = (healthDetails?.weight ?? 0) as number;
		const baseCalories = met * weight * timeInHours;

		// Apply gender and age adjustments
		const gender = (healthDetails?.gender ?? "male") as HealthDetails["gender"];
		const age = (healthDetails?.age ?? 30) as number;
		const ageAdjustment =
			gender === "male" ? 1 + (age - 30) * 0.01 : 1 + (age - 30) * 0.008;

		return baseCalories * ageAdjustment;
	}

	console.log("DATA", data);

	const estimatedCalories = useMemo(() => {
		return calculateCaloriesBurned(stepGoal || data?.steps_goal || 0);
	}, [stepGoal, averageSpeedMs, healthDetails, derivedWalkingPace]);

	// Cleanup interval and timeout on unmount
	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const startLongPress = () => {
		isLongPressingRef.current = true;

		// Clear any existing timeout
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		// Wait 1 second before starting the interval
		timeoutRef.current = setTimeout(() => {
			if (isLongPressingRef.current) {
				intervalRef.current = setInterval(() => {
					if (isLongPressingRef.current && stepGoal < 55000) {
						setStepGoal((prev) => prev + 1);
					} else {
						stopLongPress();
					}
				}, 100);
			}
		}, 850);
	};

	const startLongPressMinus = () => {
		isLongPressingRef.current = true;

		// Clear any existing timeout
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		// Wait 1 second before starting the interval
		timeoutRef.current = setTimeout(() => {
			if (isLongPressingRef.current) {
				intervalRef.current = setInterval(() => {
					if (isLongPressingRef.current && stepGoal > 0) {
						setStepGoal((prev) => prev - 1);
					} else {
						stopLongPress();
					}
				}, 100);
			}
		}, 850);
	};
	const stopLongPress = () => {
		isLongPressingRef.current = false;

		// Clear timeout if it hasn't fired yet
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}

		// Clear interval if it's running
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	};

	const saveNewStepsGoal = async () => {
		const user = await supabase.auth.getUser();

		const { data, error } = await supabase
			.from("userdata")
			.update({
				steps_goal: stepGoal,
			})
			.eq("user_id", user.data.user?.id as string)
			.select("*")
			.single();

		if (data) {
			Alert.alert("Success!", "Steps goal updated");
			storeData(data as Database["public"]["Tables"]["userdata"]["Row"]);
		}

		if (error) {
			Alert.alert("Error!", error.message);
		}
	};

	return (
		<>
			<View style={{ flex: 1, alignItems: "flex-end" }}>
				<Pressable
					hitSlop={12}
					onPress={saveNewStepsGoal}
					style={{ padding: 12 }}
				>
					<Text
						style={{
							color: Colors[colorScheme].green["600"],
							fontSize: 16,
							fontWeight: "500",
						}}
					>
						Done
					</Text>
				</Pressable>
			</View>
			<SafeAreaView style={{ flex: 1 }} edges={["top"]}>
				<View style={[containerStyles.contentContainer]}>
					<View style={{ gap: 12, alignItems: "center", width: "80%" }}>
						<Text
							style={[
								typography.heading,
								{ color: Colors[colorScheme].text[0] },
							]}
						>
							Change Step Goal
						</Text>
						<Text
							style={[
								typography.description,
								{ color: Colors[colorScheme].text[0], textAlign: "center" },
							]}
						>
							Set a change for your goals based on how active you’d like to be
							each day
						</Text>
					</View>

					<View
						style={{
							gap: 12,
							alignItems: "center",
							width: "80%",
							marginTop: 24,
						}}
					>
						<View
							style={{
								flexDirection: "row",
								gap: 12,
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<Pressable
								onPressIn={startLongPressMinus}
								onPressOut={stopLongPress}
								onPress={() => setStepGoal(stepGoal <= 0 ? 0 : stepGoal - 1)}
								disabled={stepGoal <= 0}
							>
								<AntDesign
									name="minus"
									size={32}
									color={Colors[colorScheme].pink["400"]}
								/>
							</Pressable>
							<TextInput
								keyboardType="number-pad"
								onChangeText={(text: string) => {
									const formattedText = text.replace(/[^0-9]/g, "");
									setStepGoal(Number(formattedText) || 0);
								}}
								value={(stepGoal || data?.steps_goal)?.toString()}
								style={{
									backgroundColor: Colors[colorScheme].text["50"],
									borderColor: "transparent",
									borderRadius: 24,
									padding: 12,
									width: 120,
									textAlign: "center",
								}}
							/>
							<Pressable
								onPressIn={startLongPress}
								onPressOut={stopLongPress}
								onPress={() => setStepGoal(stepGoal + 1)}
								disabled={stepGoal >= 100000}
							>
								<AntDesign
									name="plus"
									size={32}
									color={Colors[colorScheme].green["400"]}
								/>
							</Pressable>
						</View>

						<View style={{ alignItems: "center", justifyContent: "center" }}>
							<Text
								style={{
									textAlign: "center",
									color: Colors[colorScheme].text[0],
								}}
							>
								Equivalent to{" "}
								<Text
									style={{
										fontWeight: "700",
										color: Colors[colorScheme].text[0],
									}}
								>
									{Number.isFinite(estimatedCalories)
										? Math.max(0, Math.round(estimatedCalories))
										: 0}
								</Text>{" "}
								kCal to burn
							</Text>
							<Text
								style={{
									textAlign: "center",
									color: Colors[colorScheme].text[0],
									marginTop: 4,
									opacity: 0.7,
								}}
							>
								Pace: {derivedWalkingPace}{" "}
								{averageSpeedMs ? `(${averageSpeedMs.toFixed(2)} m/s)` : ""}
							</Text>
						</View>
					</View>
				</View>
			</SafeAreaView>
		</>
	);
}

const styles = StyleSheet.create({
	contentContainer: {
		gap: 24,
		marginVertical: "auto",
		alignItems: "center",
		justifyContent: "center",
	},
});
