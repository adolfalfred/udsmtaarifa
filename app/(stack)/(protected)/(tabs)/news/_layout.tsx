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
                options={{ title: 'News', headerShown: false }}
            />
            <Stack.Screen
                name="[id]"
                options={{ title: 'Post', headerShown: false }}
            />
        </Stack>
    );
}
