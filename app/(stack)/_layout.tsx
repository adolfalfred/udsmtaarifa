import { useSessionStore } from '@/lib/zustand/useSessionStore';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useQueryClient } from '@tanstack/react-query';
import { colors } from '@/constants/Colors';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const { isLoggedIn } = useSessionStore();
    const queryClient = useQueryClient()

    useEffect(() => {
        queryClient.clear();
    }, [isLoggedIn, queryClient]);

    console.log('https://udsmtaarifalive.adlewolf.com')

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
