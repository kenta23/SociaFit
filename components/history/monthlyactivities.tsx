import { supabase } from '@/utils/supabase';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from "expo-image";
import { Link, useRouter } from 'expo-router';
import * as React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";



export default function MonthlyActivities() {
  	const router = useRouter();
  	return ( 
    		<View style={styles.parent}>
      			<View style={styles.view}>
        				<Text style={[styles.title]}>Monthly Activities</Text>

                     <Pressable onPress={() => { 
						 supabase.auth.signOut();
						 router.replace('/login');
					 }}><Text>Sign out</Text></Pressable>

                   {/**Map activities here */}
        			<Link href="/">      
                         <View style={styles.container}>
          					<View style={styles.containerInner}>
            						<View style={[styles.frameParent, styles.frameFlexBox]}>
              							<View style={styles.postInfo}>
                								<Text style={styles.date}>May 20, 2025</Text>
                								<Text style={styles.yourPostContents}>your post contents or just ......</Text>
              							</View>
              							<View style={[styles.frameFlexBox, { gap: 12 }]}>
                							<Image style={styles.imagePost} contentFit="cover" source={require('@/assets/images/user_post.png')} />
                							<Ionicons name="arrow-forward-outline" size={24} color="black" />
              							</View>
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
    	width: '100%',
        marginTop: 32,
  	},
    title: {
        fontSize: 18,
        fontWeight: "500",
        fontFamily: "Inter_500Medium",
        textAlign: "left",
        alignSelf: "stretch"
    },
  	frameFlexBox: {
    		alignItems: "center",
    		flexDirection: "row",
  	},
  	monthlyActivities: {
    		fontSize: 18,
    		fontWeight: "500",
    		fontFamily: "Inter-Medium"
  	},
   	date: {
    		fontSize: 16,
    		fontFamily: "Inter-Regular"
  	},
  	yourPostContents: {
        width: "auto",
        fontSize: 12,
        lineHeight: 12,
        fontFamily: "Inter_200ExtraLight",
        color: "#000",
        textAlign: "left"
  	},
  	postInfo: {
    		width: 'auto',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
    		gap: 8
  	},
  	imagePost: {
    		width: 87,
    		borderRadius: 8,
    		height: 87,
    		overflow: "hidden"
  	},
  	fluentMdl2forwardIcon: {
    		overflow: "hidden"
  	},
  	frameGroup: {
    		gap: 10
  	},
  	frameParent: {
    		gap: 34
  	},
  	containerInner: {
    		borderRadius: 24,
    		backgroundColor: "rgba(172, 172, 172, 0.2)",
    		paddingHorizontal: 22,
    		paddingVertical: 15,
    		overflow: "hidden",
    		alignSelf: "stretch"
  	},
  	container: {
        width: '100%',
        alignSelf: "stretch",       
  	},
  	view: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: 16,
        width: '100%',
  	}
});


