import { Colors } from "@/constants/Colors";
import { typography } from "@/constants/typography";
import { useStoreData } from "@/utils/states";
import { containerStyles } from "@/utils/styles";
import { supabase } from "@/utils/supabase";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { AuthResponse } from "@supabase/supabase-js";
import {
    type BarcodeScanningResult,
    type CameraType,
    CameraView,
    useCameraPermissions,
} from "expo-camera";
import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
import { type RelativePathString, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Button,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Snackbar from "react-native-snackbar";
import QRCode from "react-qr-code";

export default function MyQRCode() {
	const [facing, setFacing] = useState<CameraType>("back");
	const [permission, requestPermission] = useCameraPermissions();
	const colorScheme = useColorScheme() ?? "light";
	const [cameraOn, setCameraOn] = useState<boolean>(false);
	const router = useRouter();
	const [user, setUser] = useState<AuthResponse["data"]["user"] | null>(null);
	const { data } = useStoreData();

	useEffect(() => {
		const getUser = async () => {
			const user = await supabase.auth.getUser();
			setUser(user.data.user);
		};
		getUser();
	}, []);

	const handleCopyQRCode = async () => {
		await Clipboard.setStringAsync("com.sociafit.app://profile");
		Snackbar.show({
			text: "QR Code copied to clipboard",
			duration: Snackbar.LENGTH_SHORT,
		});
	};

	if (!permission) {
		// Camera permissions are still loading.
		return <View />;
	}

	if (!permission.granted) {
		// Camera permissions are not granted yet.
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text style={typography.title}>
					We need your permission to show the camera
				</Text>
				<Button onPress={requestPermission} title="grant permission" />
			</View>
		);
	}

	const handleBarcodeScanned = (event: BarcodeScanningResult) => {
		console.log("event", event);

		setCameraOn(false);
		router.push(event.data as RelativePathString);
		setCameraOn(false);
	};

	return cameraOn ? (
		<View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>
			<Pressable
				onPress={() => setFacing(facing === "back" ? "front" : "back")}
				style={styles.scanBtn}
			>
				<MaterialIcons name="cameraswitch" size={24} color="#54E067" />
			</Pressable>

			<CameraView
				style={styles.camera}
				onBarcodeScanned={handleBarcodeScanned}
				barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
				facing={facing}
			/>
		</View>
	) : (
		<SafeAreaView
			edges={["bottom"]}
			style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}
		>
			<ScrollView
				contentContainerStyle={{
					justifyContent: "space-between",
					flex: 1,
					marginBottom: 24,
				}}
				style={containerStyles.container}
			>
				<View>
					<Pressable
						onPress={() => setCameraOn(!cameraOn)}
						style={styles.scanBtn}
					>
						<MaterialCommunityIcons
							name="qrcode-scan"
							size={24}
							color="#54E067"
						/>
					</Pressable>
					<View style={styles.profileContainer}>
						<View style={styles.profileInfo}>
							<Image
								contentFit="cover"
								source={require("@/assets/images/user-default.png")}
								style={styles.profileImage}
							/>

							<View style={styles.profileName}>
								<Text style={typography.title}>{data?.full_name}</Text>
								<Text style={typography.subheading}>{user?.email}</Text>
							</View>
						</View>

						<View style={styles.qrContentContainer}>
							<View style={styles.qrcodeContainer}>
								<QRCode
									value={`com.sociafit.app://profile-visit/${user?.id}`}
									size={190}
								/>
							</View>

							<Text
								style={[
									typography.description,
									{ textAlign: "center", wordWrap: "break-word" },
								]}
							>
								Your QR code can share with others, save it or click share
								button{" "}
							</Text>
						</View>
					</View>
				</View>

				<Pressable
					onPress={handleCopyQRCode}
					style={{
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: Colors[colorScheme].green[600],
						padding: 16,
						borderRadius: 100,
						width: "100%",
						height: 60,
					}}
				>
					<Text
						style={[
							typography.subheading,
							{ color: "white", textAlign: "center" },
						]}
					>
						Save QR Code
					</Text>
				</Pressable>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	scanBtn: {
		padding: 10,
		alignItems: "flex-end",
	},
	camera: {
		width: "100%",
		height: "65%",
		borderRadius: 12,
		overflow: "hidden",
	},
	profileContainer: {
		marginTop: 16,
		gap: 8,
		alignItems: "center",
		justifyContent: "center",
	},

	profileInfo: {
		gap: 8,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "column",
	},
	profileImage: {
		width: 100,
		height: 100,
		borderRadius: 100,
	},

	profileName: {
		gap: 4,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "column",
	},
	qrcodeContainer: {
		padding: 24,
		marginTop: 16,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: "#73EE84",
		alignItems: "center",
		justifyContent: "center",
	},
	qrContentContainer: {
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "column",
		marginTop: 16,
		gap: 8,
	},
});
