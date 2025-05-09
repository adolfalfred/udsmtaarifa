import { colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const isLoggedIn = false;
    return (
        <Stack
            screenOptions={{
                contentStyle: { backgroundColor: colors.background[colorScheme] }
            }}
        >
            <Stack.Protected guard={!isLoggedIn}>
                <Stack.Screen name="(unprotected)" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Protected guard={isLoggedIn}>
                <Stack.Screen name="(protected)" options={{ headerShown: false }} />
            </Stack.Protected>
        </Stack>
    );
}
