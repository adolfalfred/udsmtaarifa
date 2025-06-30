import { type ExternalPathString, type RelativePathString, Stack, useRouter } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useExpoNotificationState } from '@/lib/zustand/useNotificationStore';
import { registerForPushNotificationsAsync } from '@/lib/expo-notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useThemeStore } from '@/lib/zustand/useThemeStore';
import { useColorScheme as useScheme } from "nativewind";
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Notifications from "expo-notifications";
import * as SplashScreen from 'expo-splash-screen';
import FallOutUI from '@/components/FallOutUI';
import { refreshSession } from '@/lib/auth';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/Colors';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import 'react-native-reanimated';
import "../global.css";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 400,
  fade: true
})

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 1000 * 60 * 60 } } })

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const { setColorScheme } = useScheme();
  const colorScheme = useColorScheme();
  const { theme } = useThemeStore();
  const { setExpoPushToken, setNotification } = useExpoNotificationState()
  const router = useRouter()

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log("🔔 Notification Received: App is running!", notification);
      console.log(JSON.stringify(notification.request.content, null, 2))
      setNotification(notification);
    });
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      setNotification(response.notification);
      const url = response.notification.request.content.data?.url;
      console.log("🔔 Notification Response: User interacts with the notification!");
      console.log(JSON.stringify(response.notification.request.content, null, 2))
      if (url) router.push(url as RelativePathString | ExternalPathString);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) throw error;
    setColorScheme(theme);
  }, [error, theme, setColorScheme]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
    refreshSession()
  }, [loaded]);

  if (!loaded) return <FallOutUI />
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView className='flex-1 bg-background-light dark:bg-background-dark'>
          <BottomSheetModalProvider>
            <Stack
              screenOptions={{
                contentStyle: { backgroundColor: colors.background[colorScheme] }
              }}
            >
              <Stack.Screen name="(stack)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </BottomSheetModalProvider>
          <StatusBar style="auto" />
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
