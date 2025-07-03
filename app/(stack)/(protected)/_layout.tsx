import { useSessionStore } from '@/lib/zustand/useSessionStore';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useQueryClient } from '@tanstack/react-query';
import BackButton from '@/components/BackButton';
import { colors } from '@/constants/Colors';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { socket } from '@/lib/socket';

export default function StackLayout() {
    const colorScheme = useColorScheme();
    const { user } = useSessionStore();
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!user?.id) return;
        socket.on("room-created", (id) => { console.log(id) });
        socket.on("user-joined", () => { });
        socket.on("add-message", async () => {
            await queryClient.invalidateQueries({
                refetchType: "active",
                queryKey: ["message"],
            })
            await queryClient.invalidateQueries({
                refetchType: "active",
                queryKey: ["chat"],
            })
        });

        return () => {
            socket.off("room-created");
            socket.off("user-joined");
        }
    }, [queryClient, user?.id])

    useEffect(() => {
        if (!user?.id) return;

    }, [user?.id]);

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
