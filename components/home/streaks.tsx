import { Colors } from "@/constants/Colors";
import { typography } from "@/constants/typography";
import { supabase } from "@/utils/supabase";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

export default function Streaks() {
	const [streakCount, setStreakCount] = useState<number>(0);
	const colorScheme = useColorScheme() ?? "light";

	useEffect(() => {
		async function getData() {
			const user = await supabase.auth.getUser();
			const { data: userData, error: userError } = await supabase
				.from("userdata")
				.select("*")
				.eq("user_id", user.data.user?.id as string)
				.single();
			if (userData) {
				setStreakCount(userData.streaks || 0);
			}
			if (userError) {
				console.log("userError", userError);
			}
		}
		getData();
	}, []);

	const streakDescription = (count: number): string => {
		if (count === 0) {
			return "Start your streak today!";
		}
		if (count === 1) {
			return `You made straight ${count} streak, keep it up!`;
		}
		if (count >= 5) {
			return `You made straight ${count} streaks, keep it up!`;
		}
		return `You made straight ${count} streaks, keep it up!`;
	};

	return (
		<View style={styles.frameParent}>
			<View style={styles.frameWrapper}>
				<View style={styles.mdifireParent}>
					<Image
						contentFit="contain"
						source={
							streakCount > 0
								? require("@/assets/images/mdi_fire.svg")
								: require("@/assets/images/fire_gray.png")
						}
						style={styles.mdifireIcon}
					/>
					<Text
						style={[
							styles.streakCount,
							{
								color:
									streakCount > 0 ? "#e35420" : Colors[colorScheme].text["50"],
							},
						]}
					>
						{streakCount}
					</Text>
				</View>
			</View>
			<Text
				style={[
					typography.subheading,
					{ color: Colors[colorScheme].text["0"] },
				]}
			>
				{streakDescription(streakCount)}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	mdifireIcon: {
		width: "100%",
		height: 74,
	},
	streakCount: {
		alignSelf: "stretch",
		fontSize: 24,
		fontWeight: "700",
		fontFamily: "Inter-Bold",
		textAlign: "center",
	},
	mdifireParent: {
		position: "absolute",
		marginTop: -53,
		marginLeft: -44,
		top: "50%",
		left: "50%",
		width: 88,
		gap: 4,
		alignItems: "center",
	},
	frameWrapper: {
		borderRadius: 100,
		backgroundColor: "#54ee69",
		width: 150,
		height: 150,
		overflow: "hidden",
	},
	description: {
		fontSize: 20,
		fontFamily: "Inter-Regular",
		color: "#000",
		width: 304,
		textAlign: "center",
	},
	frameParent: {
		flex: 1,
		width: "100%",
		gap: 17,
		alignItems: "center",
	},
});
