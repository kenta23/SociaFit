import { supabase } from '@/utils/supabase';
import { GoogleAuthProvider } from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login() {

   GoogleSignin.configure({ 
    webClientId: '500513973402-7f82v30o6ohpj3ctfb35mvv3qv8njnaq.apps.googleusercontent.com',
   });

   async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const signInResult = await GoogleSignin.signIn();

    let idToken = signInResult.data?.idToken;

    if (!idToken) {
      // if you are using older versions of google-signin, try old style result
      idToken = signInResult.data?.idToken;
    }
    if (!idToken) {
      throw new Error('No ID token found');
    }
  
    // Create a Google credential with the token
    const googleCredential = GoogleAuthProvider.credential(signInResult.data?.idToken);

    // Sign-in the user with the credential
   try {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });
    console.log(data, error);
    return data;
   } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (e.g. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
    } else {
      // some other error happened
    }
   }
}

  return (
    <ImageBackground
      resizeMode="cover"
      source={require("../assets/images/login-background.png")}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.title}>
            Track your Growth and makes it a habit
          </Text>

          <View style={styles.loginContainer}>
            <Text style={styles.description}>Login account using</Text>

            <View style={styles.loginButtonContainer}>
                   <Pressable style={styles.loginButton} onPress={onGoogleButtonPress}>
                             <Image style={styles.loginButtonImage} source={require('../assets/images/google.png')} />
                      </Pressable>          
              <Pressable style={styles.loginButton}>
                <Image
                  style={styles.loginButtonImage}
                  source={require("../assets/images/facebook.png")}
                />
              </Pressable>
              <Pressable style={styles.loginButton}>
                <Image
                  style={styles.loginButtonImage}
                  source={require("../assets/images/twitter.png")}
                />
              </Pressable>
            </View>
          </View>


          <View style={styles.belowLoginContainer}>
             <Text style={styles.belowLoginText}>By logging in, you agree to our <Link href="/privacy" style={styles.privacy}>Privacy Policy</Link> and <Link href="/terms_conditions" style={styles.terms}>Terms and Conditions</Link></Text> 
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  terms: {
    color: "#73ee84",
    textDecorationLine: 'underline',
  },
  privacy: {
    color: "#eedb73",
    textDecorationLine: 'underline',
  },
  belowLoginContainer: {
    marginTop: 45,
  },
  belowLoginText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 15,
    fontFamily: "Inter-Regular",
    textAlign: "left",
    width: 279,
  },
  loginButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#fff",
  },
  loginButtonImage: {
    width: 30,
    resizeMode: "contain",
    height: 30,
  },
  loginButtonContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
  },
  description: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: "Inter-Regular",
    color: "#fff",
    textAlign: "left",
  },
  loginContainer: {
    marginTop: 24,
    flexDirection: "column",
    gap: 12,
  },
  title: {
    fontSize: 32,
    color: "#fff",
    lineHeight: 40,
    fontWeight: "700",
    fontFamily: "Inter-Bold",
    textAlign: "left",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
});
