import { colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                contentStyle: { backgroundColor: colors.background[colorScheme] }
            }}
        >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="post" options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name="eventpost" options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name="feedbackpost" options={{ animation: 'slide_from_bottom' }} />
        </Stack>
    );
}
