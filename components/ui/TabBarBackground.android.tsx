import { colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';

export default function BlurTabBarBackground() {
    const colorScheme = useColorScheme()
    return (
        <View
            style={[StyleSheet.absoluteFill, { backgroundColor: colorScheme === 'dark' ? `${colors.background.dark}f0` : `${colors.background.light}f0` }]}
        />
    );
}

export function useBottomTabOverflow() {
    return useBottomTabBarHeight();
}
