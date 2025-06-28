import { useColorScheme } from '@/hooks/useColorScheme';
import { colors } from '@/constants/Colors';
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
                name="school"
                options={{ title: 'Schooling', headerShown: false }}
            />
            <Stack.Screen
                name="[id]"
                options={{ title: 'Post', headerShown: false }}
            />
        </Stack>
    );
}
