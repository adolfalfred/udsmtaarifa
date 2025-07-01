import { useColorScheme } from '@/hooks/useColorScheme';
import { colors } from '@/constants/Colors';
import socketIO from "socket.io-client";
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useSessionStore } from '@/lib/zustand/useSessionStore';

export const ws = socketIO(process.env.EXPO_PUBLIC_LIVE_SERVER as string);

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const { user } = useSessionStore()

    useEffect(() => {
        if (user?.id) return;
        ws.on("room-created", async () => { });
        ws.on("get-users", async (roomId: string) => { });
        ws.on("user-disconnected", async (peerId: string) => { });
        ws.on("is-typing", () => { });
        ws.on("not-typing", () => { });
        ws.on("add-message", () => { });
        ws.on("room-error", ({ error, message }) => {
            console.log(error, message);
        });

        return () => {
            ws.off("room-created");
            ws.off("get-users");
            ws.off("user-disconnected");
            ws.off("is-typing");
            ws.off("not-typing");
            ws.off("add-message");
            ws.off("room-error");
        };
    }, [user?.id])

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background[colorScheme] }
            }}
        >
            <Stack.Screen
                name="messages"
                options={{ title: 'Messages', headerShown: false }}
            />
            <Stack.Screen
                name="[id]"
                options={{ title: 'Message', headerShown: false }}
            />
        </Stack>
    );
}
