import { colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background[colorScheme] }
            }}
        >
            <Stack.Screen
                name="index"
                options={{ title: 'Login', headerShown: false }}
            />
            <Stack.Screen
                name="register"
                options={{ title: 'Register', headerShown: false }}
            />
        </Stack>
    );
}
