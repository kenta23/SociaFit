import { useColorScheme } from '@/hooks/useColorScheme';
import { Inter_200ExtraLight, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { getAuth } from '@react-native-firebase/auth';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';



export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const router = useRouter();
  const auth = getAuth();

  // useEffect(() => {
  //   const handleAuthState = () => {
  //     const currentUser = auth.currentUser;

  //     console.log('Current user:', currentUser);

  //     // If user is authenticated and on login page, redirect to tabs
  //     if (currentUser && pathname === '/login') {
  //       console.log('Redirecting to tabs');
  //       router.replace('/(tabs)');
  //     }
  //     // If no user and not on login page, redirect to login
  //     else if (!currentUser && pathname !== '/login') {
  //       console.log('Redirecting to login');
  //       router.replace('/login');
  //     }
  //   };

  //   // Initial check
  //   handleAuthState();

  //   // Subscribe to auth state changes
  //   const unsubscribe = auth.onAuthStateChanged(handleAuthState);

  //   // Cleanup subscription
  //   return () => unsubscribe();
  // }, [pathname]); // Only depend on pathname changes

  const [loaded] = useFonts({
    Inter_200ExtraLight,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="privacy" options={{ headerShown: true, title: 'Privacy Policy', gestureEnabled: true, headerBackButtonDisplayMode: 'generic'}} />
        <Stack.Screen name='terms_conditions' options={{ headerShown: true, title: 'Terms and Conditions',  gestureEnabled: true, headerBackButtonDisplayMode: 'generic' }} />
        <Stack.Screen name='location' options={{ headerShown: true, title: 'Location',  gestureEnabled: true, headerBackButtonDisplayMode: 'generic' }} />
        <Stack.Screen name='location2' options={{ headerShown: true, title: 'Location2',  gestureEnabled: true, headerBackButtonDisplayMode: 'generic' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
