import { supabase } from '@/utils/supabase';
import { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } from '@react-native-google-signin/google-signin';
import { makeRedirectUri } from 'expo-auth-session';
import * as QueryParams from "expo-auth-session/build/QueryParams";
import { Image } from 'expo-image';
import { useLinkingURL } from 'expo-linking';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ImageBackground, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Login() {
   const [email, setEmail] = useState<string>('');
   const [errorMessage, setErrorMessage] = useState('');
   const [message, setMessage] = useState('');
   const [loading, setLoading] = useState(false);
   const [user, setUser] = useState<any>(null);


   console.log('USERTRR', supabase.auth.getUserIdentities().then((res) => {
    console.log('res', res);
   }));


   useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      console.log('user', user);
    }
    fetchUser();
   }, []);

   GoogleSignin.configure({
    webClientId: '49993852450-49f8n1c7qhd8dnsmsd00ro7g6o0smto3.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
    scopes: [
      /* what APIs you want to access on behalf of the user, default is email and profile
      this is just an example, most likely you don't need this option at all! */
      'https://www.googleapis.com/auth/drive.readonly',
    ],
    offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    accountName: 'SociaFit', // [Android] specifies an account name on the device that should be used
  });

   GoogleSignin.configure({ 
     scopes: ['email'],
     webClientId: '49993852450-49f8n1c7qhd8dnsmsd00ro7g6o0smto3.apps.googleusercontent.com',
     offlineAccess: true,
   });

   const redirectTo = makeRedirectUri({ 
    scheme: 'sociafit',
    native: 'sociafit://', 
   });

   async function onGoogleButtonPress() {
    try {
      // Check for Google Play services first
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  
      // Sign in

      const signIn = async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const response = await GoogleSignin.signIn();
          if (isSuccessResponse(response)) {
            console.log('signInResult', response.data);
            // Send to Supabase Auth
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: response.data?.idToken as string,
            });

            if (error) {
              Alert.alert('Supabase Error', error?.message);
            } else {
              Alert.alert('Success!', `Welcome, ${data?.user?.email}`);
            }
          } else {
            Alert.alert('Login Failed', 'No ID Token was returned');
            return;
          }
        } catch (error) {
          if (isErrorWithCode(error)) {
            switch (error.code) {
              case statusCodes.IN_PROGRESS:
                Alert.alert('Login In Progress', 'You are already logging in');
                break;
              case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                Alert.alert('Play Services Not Available', 'Play services are not available or outdated');
                break;
              default:
                Alert.alert('Login Error', 'Something went wrong during Google Sign-In' + error?.code);
            }
          } else {
            Alert.alert('Login Failed', 'No ID Token was returned');
            return;
          }
        }
      };

      signIn();

    } catch (err: any) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        Alert.alert('Login Cancelled', 'You cancelled the login flow');
      } else if (err.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Login In Progress', 'You are already logging in');
      } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play Services Not Available', 'Play services are not available or outdated');
      } else {
        // some other error happened
        Alert.alert('Login Error', 'Something went wrong during Google Sign-In');
      }
    }
}


const sendMagicLink = async () => {
  if (!email) {
    setErrorMessage('Please enter your email first');
    return;
  }

  setLoading(true);
  setErrorMessage('');
  setMessage('');

  try {
    const { error } = await supabase.auth.signInWithOtp({ 
      email, 
      options: { 
        emailRedirectTo: redirectTo
      }
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setMessage('Login link has been sent! Check your email inbox.');
    }
  } catch (err: any) {
    setErrorMessage(err?.message || 'Something went wrong');
  } finally {
    setLoading(false);
  }
};


const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);
  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;
  if (!access_token) return;
  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) throw error;
  return data.session;
};


const url = useLinkingURL();

useEffect(() => {
  if (url) {
    createSessionFromUrl(url);
  }
}, [url]);

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

            {/**Input email */}
            {errorMessage ? <Text style={{ color:'red'}}>{errorMessage}</Text> : null }
{message ? <Text style={{ color:'green'}}>{message}</Text> : null }
{loading ? <ActivityIndicator color="#000" /> : (
  <>
    <TextInput placeholder='Email' style={styles.input} value={email} onChangeText={setEmail} />
    <Pressable style={{ backgroundColor:'blue', padding:10, borderRadius:10, marginBottom:10 }} onPress={sendMagicLink}>
      <Text style={{ color:'white' }}>Login with email</Text>
    </Pressable>
  </>
)}

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
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
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
