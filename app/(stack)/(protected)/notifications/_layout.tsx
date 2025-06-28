import BackButton from '@/components/BackButton';
import { colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerTitleAlign: 'center',
                headerStyle: { backgroundColor: `${colors.background[colorScheme]}f0` },
                contentStyle: { backgroundColor: colors.background[colorScheme] },
                headerShadowVisible: false,
                headerLeft: (props) => <BackButton {...props} />,
            }}
        >
            <Stack.Screen
                name="notification"
                options={{ title: 'Notifications' }}
            />
            <Stack.Screen
                name="[id]"
                options={{ title: 'Notification' }}
            />
        </Stack>
    );
}
