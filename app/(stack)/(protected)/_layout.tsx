import { useColorScheme } from '@/hooks/useColorScheme';
import BackButton from '@/components/BackButton';
import { colors } from '@/constants/Colors';
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
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
                name="profile"
                options={{
                    title: "Profile"
                }}
            />
            <Stack.Screen
                name="post"
                options={{
                    animation: 'slide_from_bottom',
                    title: "Post News",
                }}
            />
            <Stack.Screen
                name="eventpost"
                options={{
                    animation: 'slide_from_bottom',
                    title: "Post Event"
                }}
            />
            <Stack.Screen
                name="feedbackpost"
                options={{
                    animation: 'slide_from_bottom',
                    title: "Post Feedback"
                }}
            />
        </Stack>
    );
}
