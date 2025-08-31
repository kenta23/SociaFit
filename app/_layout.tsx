import { useColorScheme } from '@/hooks/useColorScheme';
import { supabase } from '@/utils/supabase';
import { Inter_200ExtraLight, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const router = useRouter();




  useEffect(() => {
    const handleAuthState = async () => {
      const { data } = await supabase.auth.getSession();
      console.log('data', data);
      console.log('Current user:', data.session?.user);

      // If user is authenticated and on login page, redirect to tabs
      if (data.session?.user.id && pathname === '/login') {
        console.log('Redirecting to tabs');
        router.replace('/(tabs)');
      }
      // If no user and not on login page, redirect to login
      else if (!data.session?.user.id  && pathname !== '/login') {
        console.log('Redirecting to login');
        router.replace('/login');
      }
    };

    // Initial check
    handleAuthState();

    // Subscribe to auth state changes
    const unsubscribe = supabase.auth.onAuthStateChange(handleAuthState);

    // Cleanup subscription
    return () => unsubscribe.data.subscription.unsubscribe();

  }, [pathname, router]); // Only depend on pathname changes

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
          <Stack.Screen name="privacy" options={{ headerShown: true, title: 'Privacy Policy', gestureEnabled: true, headerBackButtonDisplayMode: 'generic' }} />
          <Stack.Screen name='terms_conditions' options={{ headerShown: true, title: 'Terms and Conditions', gestureEnabled: true, headerBackButtonDisplayMode: 'generic' }} />
          <Stack.Screen name='location' options={{ headerShown: true, title: 'Location', gestureEnabled: true, headerBackButtonDisplayMode: 'generic' }} />
          <Stack.Screen name='location2' options={{ headerShown: true, title: 'Location2', gestureEnabled: true, headerBackButtonDisplayMode: 'generic' }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="tips/[id]" options={{ headerShown: true, title: 'Tips', gestureEnabled: true, headerBackButtonDisplayMode: 'generic' }} />
          <Stack.Screen name="profile" options={{ headerShown: true, title: 'Profile', gestureEnabled: true, headerBackButtonDisplayMode: 'generic' }} />
        </Stack>
        <StatusBar style="auto" />

    </ThemeProvider>
  );
}
