import { colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, Stack } from 'expo-router';
import { TouchableOpacity, Image } from 'react-native';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerTitleAlign: 'center',
                headerStyle: { backgroundColor: `${colors.background[colorScheme]}f0` },
                contentStyle: { backgroundColor: colors.background[colorScheme] },
                headerLeft: () => {
                    if (router.canGoBack()) return (
                        <TouchableOpacity onPress={() => router.back()} className='ml-1 p-1.5 rounded-full bg-foreground-light/50 dark:bg-foreground-dark/60'>
                            <MaterialIcons color={colors.background[colorScheme]} size={18} name='arrow-back' />
                        </TouchableOpacity>
                    )
                    return (
                        <TouchableOpacity onPress={() => router.push('/')} className='mx-4'>
                            <Image
                                source={require('@/assets/images/icon.png')}
                                className="w-10 h-10"
                            />
                        </TouchableOpacity>
                    )
                },
            }}
        >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
                name="post"
                options={{
                    animation: 'slide_from_bottom',
                    title: "Post News"
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
