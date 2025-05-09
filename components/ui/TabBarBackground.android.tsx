import { colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

export default function BlurTabBarBackground() {
    const colorScheme = useColorScheme()

    return (
        <BlurView
            // System chrome material automatically adapts to the system's theme
            // and matches the native tab bar appearance on iOS.
            tint={colorScheme === 'dark' ? "dark" : "light"}
            intensity={100}
            style={[StyleSheet.absoluteFill, { backgroundColor: colorScheme === 'dark' ? `${colors.background.dark}d0` : `${colors.background.light}d0` }]}
        />
    );
}

export function useBottomTabOverflow() {
    return useBottomTabBarHeight();
}
