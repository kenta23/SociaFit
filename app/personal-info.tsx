import { Colors } from "@/constants/Colors";
import { typography } from "@/constants/typography";
import type { Database } from "@/database.types";
import { getAuthUser } from "@/utils/auth";
import { getUserAvatar } from "@/utils/data";
import { uploadAvatar } from "@/utils/imageUpload";
import { useStoreData } from "@/utils/states";
import { containerStyles } from "@/utils/styles";
import { supabase } from "@/utils/supabase";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { User } from "@supabase/supabase-js";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
	Alert,
	Modal,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	useColorScheme,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as z from "zod";

const schema = z
	.object({
		fullName: z.string().min(1, { error: "Full Name is required" }),
		email: z.email({ error: "Invalid email address" }).optional(),
	})
	.refine((data) => data.fullName !== data.email, {
		error: "Full Name and Email cannot be the same",
		path: ["fullName", "email"],
	})
	.optional();

export default function PersonalInfo() {
	const [avatar, setAvatar] = useState<string | null>(null);
	const colorScheme = useColorScheme() ?? "light";
	const [selectedImage, setSelectedImage] =
		useState<ImagePicker.ImagePickerResult | null>(null);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const { data, storeData } = useStoreData();
	const [authUser, setAuthUser] = useState<User | null>(null);
	const [fullName, setFullName] = useState<string>("");
	const [email, setEmail] = useState<string>("");

	const getAvatar = async () => {
		const avatar = await getUserAvatar();
		const user = await getAuthUser();

		if (user?.data?.user) {
			setAuthUser(user?.data?.user as User);
		}

		setAvatar(avatar);
	};

	const getNewImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		console.log(result);

		if (!result.canceled) {
			setSelectedImage(result);

			const newAvatar = await uploadAvatar(result.assets[0].uri);

			if (newAvatar && typeof newAvatar === "string") {
				setAvatar(newAvatar);
			}
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		getAvatar();
	}, []);

	// console.log("avatar", avatar);

	console.log("Full name", fullName);
	console.log("Email", email);
	console.log("auth user", authUser);

	const handleSave = async () => {
		try {
			const user = await supabase.auth.getUser();

			const parsedData = schema.safeParse({ fullName });

			if (parsedData.error) {
				Alert.alert("Error", parsedData.error.message.toString());
			}

			const { data, error } = await supabase
				.from("userdata")
				.update({
					full_name: parsedData.data?.fullName,
				})
				.eq("user_id", user.data.user?.id as string)
				.select("*")
				.single();

			if (data) {
				Alert.alert("Success", "Personal information updated");
				setOpenModal(false);
				setFullName(data.full_name as string);
				storeData(data as Database["public"]["Tables"]["userdata"]["Row"]);
			}

			if (error) {
				Alert.alert("Error", error.message.toString());
			}
		} catch (error) {
			console.log("Error saving personal information", error);
		}
	};

	return (
		<SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
			<ScrollView
				contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
				showsVerticalScrollIndicator={false}
				style={containerStyles.container}
			>
				<Modal
					transparent
					visible={openModal}
					animationType="fade"
					accessibilityHint="Edit Personal Information"
				>
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
							backgroundColor: "rgba(0, 0, 0, 0.2)",
						}}
					>
						<View style={styles.modalView}>
							{/**Close button */}
							<View
								style={{
									width: "100%",
									alignItems: "flex-end",
								}}
							>
								<Feather
									name="x"
									size={24}
									onPress={() => setOpenModal(false)}
									color="black"
								/>
							</View>

							<View style={{ width: "100%", marginTop: 16 }}>
								<Text style={typography.heading}>
									Edit Personal Information
								</Text>

								<View
									style={{ flexDirection: "column", gap: 16, marginTop: 16 }}
								>
									<View style={{ flexDirection: "column", gap: 6 }}>
										<Text style={typography.medium}>Full Name</Text>
										<TextInput
											defaultValue={data?.full_name ?? ""}
											onChangeText={(text) => {
												setFullName(text);
											}}
											aria-label="Full Name"
											style={[
												typography.description,
												{
													borderWidth: 1,
													borderColor: Colors[colorScheme].text["50"],
													borderRadius: 10,
													padding: 10,
												},
											]}
										/>
									</View>

									{/** Email Input */}

									<View style={{ flexDirection: "column", gap: 6 }}>
										<Text style={typography.medium}>Email</Text>
										<TextInput
											defaultValue={authUser?.email?.toString()}
											editable={false}
											aria-label="Email"
											style={[
												typography.description,
												{
													borderWidth: 1,
													borderColor: Colors[colorScheme].text["50"],
													borderRadius: 10,
													padding: 10,
												},
											]}
										/>
									</View>
								</View>

								{/** Save Button */}
								<Pressable
									onPress={handleSave}
									style={[
										styles.saveButton,
										{ backgroundColor: Colors[colorScheme].green[600] },
									]}
								>
									<Text style={[typography.medium, { color: "#ffff" }]}>
										Save
									</Text>
								</Pressable>
							</View>
						</View>
					</View>
				</Modal>
				{/* Avatar */}
				<View
					style={{
						flexDirection: "column",
						marginTop: 24,
						gap: 12,
						flex: 1,
						width: "100%",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<View style={{ flexDirection: "column", gap: 4 }}>
						<View
							style={{ width: "auto", height: "auto", position: "relative" }}
						>
							<Image
								source={
									avatar
										? { uri: avatar }
										: require("@/assets/images/no-user.png")
								}
								style={{
									width: 150,
									borderWidth: 1,
									borderColor: "#000",
									height: 150,
									borderRadius: 100,
								}}
							/>

							<View
								style={{
									position: "absolute",
									bottom: 0,
									right: 0,
									flexDirection: "row",
									gap: 4,
									alignItems: "center",
									width: 45,
									height: 45,
									justifyContent: "center",
									borderRadius: 100,
									padding: 2,
									backgroundColor: "#E5E5E5",
								}}
							>
								<Pressable onPress={getNewImage}>
									<Feather name="edit" size={24} color="black" />
								</Pressable>
							</View>
						</View>
					</View>

					<Text style={typography.heading}>Your Avatar</Text>
				</View>

				<View
					style={{
						flexDirection: "column",
						gap: 12,
						flex: 1,
						width: "100%",
						marginTop: 24,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<View style={{ flexDirection: "column", gap: 4, width: "100%" }}>
						<View
							style={{
								flexDirection: "row",
								width: "100%",
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<Text style={[typography.heading, { fontWeight: "500" }]}>
								Personal Information
							</Text>

							<Pressable onPress={() => setOpenModal(true)}>
								<Text style={typography.subheading}>Edit</Text>
							</Pressable>
						</View>

						<View style={{ flexDirection: "column", gap: 16, marginTop: 24 }}>
							{/**Name */}
							<View style={{ flexDirection: "column", gap: 4 }}>
								<View
									style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
								>
									{/** Icon */}
									<Ionicons name="person" size={20} color="black" />

									<View style={{ flexDirection: "column", gap: 4 }}>
										<Text
											style={[
												typography.description,
												{ color: Colors[colorScheme].text["400"] },
											]}
										>
											Full Name
										</Text>
										<Text style={typography.medium}>{data?.full_name}</Text>
									</View>
								</View>
							</View>

							{/**Email */}
							<View style={{ flexDirection: "column", gap: 4 }}>
								<View
									style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
								>
									{/** Icon */}
									<Ionicons name="mail" size={20} color="black" />

									<View style={{ flexDirection: "column", gap: 4 }}>
										<Text
											style={[
												typography.description,
												{ color: Colors[colorScheme].text["400"] },
											]}
										>
											Email
										</Text>
										<Text style={typography.medium}>
											{authUser?.email?.toString()}
										</Text>
									</View>
								</View>
							</View>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	saveButton: {
		width: "100%",
		padding: 10,
		borderRadius: 12,
		height: 50,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 24,
	},
	modalView: {
		width: "85%",
		backgroundColor: "white",
		borderRadius: 12,
		padding: 24,
		alignItems: "flex-start",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
});
