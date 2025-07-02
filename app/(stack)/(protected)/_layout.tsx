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
                name="[id]"
                options={{
                    title: "Message"
                }}
            />
            <Stack.Screen
                name="notifications"
                options={{
                    animation: 'fade_from_bottom',
                    title: "Notifications"
                }}
            />
            <Stack.Screen
                name="profile"
                options={{
                    title: "Profile"
                }}
            />
            <Stack.Screen
                name="editprofile"
                options={{
                    animation: 'fade_from_bottom',
                    title: "Edit Profile"
                }}
            />
            <Stack.Screen
                name="post"
                options={{
                    animation: 'fade_from_bottom',
                    title: "Post News",
                }}
            />
            <Stack.Screen
                name="eventpost"
                options={{
                    animation: 'fade_from_bottom',
                    title: "Post Event"
                }}
            />
            <Stack.Screen
                name="feedbackpost"
                options={{
                    animation: 'fade_from_bottom',
                    title: "Post Feedback"
                }}
            />
            <Stack.Screen
                name="createchat"
                options={{
                    animation: 'fade_from_bottom',
                    title: "Create Chat"
                }}
            />
        </Stack>
    );
}
