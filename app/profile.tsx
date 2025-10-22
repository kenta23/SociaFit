import ActivityContent from "@/components/feeds/activities";
import { Colors } from "@/constants/Colors";
import { typography } from "@/constants/typography";
import { getAuthUser } from "@/utils/auth";
import { getUserDetails } from "@/utils/data";
import { useStoreData } from "@/utils/states";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	useColorScheme,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface UserDetailsProps {
	followers:
		| {
				created_at: string;
				id: number;
				user_followed: string | null;
				user_id: string | null;
		  }[]
		| null;

	totalLikes:
		| {
				activity: number | null;
				created_at: string;
				id: number;
				user_id: string | null;
		  }[]
		| null;

	countActivities: {
		content: string | null;
		created_at: string;
		distance_travelled: unknown | null;
		id: number;
		post_id: string | null;
		steps_total: number | null;
		user_id: string | null;
	}[];

	name?: string | null;
	email?: string;
}

export default function Profile() {
	const colorScheme = useColorScheme() ?? "light";
	const router = useRouter();
	const [user, setUser] = useState<string | null>(null);
	const [userDetails, setUserDetails] = useState<UserDetailsProps | null>(null);
	const { data } = useStoreData();

	const getUser = async () => {
		const user = await getAuthUser();
		setUser(user.data.user?.id as string);

		const data = await getUserDetails(user.data.user?.id as string);

		console.log("DATA", data);

		setUserDetails(data as unknown as UserDetailsProps);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		getUser();
	}, []);

	console.log("userDetails EMAIL", userDetails?.email);

	return (
		<SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
			<ScrollView style={styles.container}>
				{/**QR CODE SCANNER */}

				<View
					style={{
						flexDirection: "row",
						gap: 8,
						alignItems: "center",
						justifyContent: "flex-end",
					}}
				>
					<Pressable
						onPress={() => router.push("/my-qr-code")}
						style={styles.qrCodeScanner}
					>
						<Ionicons name="qr-code-outline" size={28} color="#24B437" />
					</Pressable>
				</View>

				{/**Your Profile View */}
				<View style={styles.parent}>
					<View style={styles.view}>
						<View style={[styles.frameParent, styles.frameFlexBox]}>
							<Image
								style={styles.frameChild}
								contentFit="cover"
								source={require("@/assets/images/no-user.png")}
							/>

							<View style={styles.nameContainer}>
								<Text style={[typography.heading]}>{data?.full_name}</Text>
								<Text style={typography.medium}>{userDetails?.email}</Text>
							</View>
						</View>

						<View style={[styles.frameGroup, styles.frameFlexBox]}>
							<View style={[styles.groupFlexBox]}>
								<Text style={[typography.medium]}>
									{userDetails?.totalLikes?.length || 0}
								</Text>
								<Text style={[typography.description]}>Total likes</Text>
							</View>

							<View style={[styles.groupFlexBox]}>
								<Text style={[typography.medium]}>
									{userDetails?.countActivities?.length || 0}
								</Text>
								<Text style={[typography.description]}>Activities</Text>
							</View>

							<View style={styles.groupFlexBox}>
								<Text style={[typography.medium]}>
									{userDetails?.followers?.length || 0}
								</Text>
								<Text style={[typography.description]}>Followers</Text>
							</View>
						</View>
					</View>
				</View>

				{/** Horizontal Line */}
				<View
					style={{
						height: 1,
						backgroundColor: Colors[colorScheme].text["50"],
						width: "100%",
						marginVertical: 10,
					}}
				/>

				{/**YOUR ACTIVITIES */}
				<View style={styles.activitiesContainer}>
					<Text style={typography.subheading}>Your Activities</Text>
					<ActivityContent userid={user as string} />
				</View>

				{/* Add bottom padding for better scrolling experience */}
				<View style={{ height: 50 }} />
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "100%",
		paddingHorizontal: 24,
	},
	activitiesContainer: {
		marginTop: 12,
		gap: 10,
	},
	qrCodeScanner: {
		height: 60,
		justifyContent: "center",
	},
	/**Your Profile View Styles */
	parent: {
		paddingVertical: 12,
		height: "auto",
	},
	frameFlexBox: {
		alignItems: "center",
		flexDirection: "row",
	},
	groupFlexBox: {
		gap: 4,
		alignItems: "center",
	},
	frameChild: {
		width: 75,
		borderRadius: 100,
		height: 75,
		overflow: "hidden",
	},
	myName: {
		fontSize: 18,
		fontFamily: "Inter_400Regular",
		textAlign: "center",
	},
	username: {
		fontSize: 16,
		fontWeight: "500",
		fontFamily: "Inter_500Medium",
		textAlign: "left",
		alignSelf: "stretch",
	},
	nameContainer: {
		width: "auto",
		gap: 7,
		flexDirection: "column",
		alignItems: "flex-start",
		justifyContent: "center",
	},
	frameParent: {
		gap: 13,
		alignSelf: "stretch",
	},
	values: {
		fontSize: 20,
		fontWeight: "600",
		fontFamily: "Inter_600SemiBold",
	},
	description: {
		fontSize: 12,
		fontFamily: "Inter_400Regular",
	},

	followers: {
		width: 61,
		height: 15,
	},
	frameGroup: {
		gap: 25,
		justifyContent: "center",
	},
	view: {
		width: "auto",
		alignItems: "center",
		gap: 15,
		justifyContent: "center",
		flexDirection: "column",
	},
});
