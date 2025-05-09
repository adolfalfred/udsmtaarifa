import FallOutUI from '@/components/FallOutUI';
import { colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeStore } from '@/lib/zustand/useThemeStore';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme as useScheme } from "nativewind";
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import "../global.css";

SplashScreen.preventAutoHideAsync();
// SplashScreen.setOptions({
//   duration: 400,
//   fade: true
// })

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const { setColorScheme } = useScheme();
  const colorScheme = useColorScheme();
  const { theme } = useThemeStore();

  useEffect(() => {
    if (error) throw error;
    setColorScheme(theme);
  }, [error, theme, setColorScheme]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return <FallOutUI />
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView className='flex-1 bg-background-light dark:bg-background-dark'>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: colors.background[colorScheme] }
          }}
        >
          <Stack.Screen name="(stack)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
