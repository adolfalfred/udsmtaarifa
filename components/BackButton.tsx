import { type HeaderBackButtonProps } from '@react-navigation/elements'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useColorScheme } from '@/hooks/useColorScheme'
import { Image, Pressable } from 'react-native'
import { colors } from '@/constants/Colors'
import { HapticTab } from './HapticTab'
import { router } from 'expo-router'

export default function BackButton(props: HeaderBackButtonProps & { canGoBack?: boolean }) {
    const colorScheme = useColorScheme()
    
    if (router.canGoBack())
        return (
            <HapticTab
                onPressIn={() => router.back()}
                {...props}
                className={`p-1.5 rounded-full bg-foreground-light/50 dark:bg-foreground-dark/60`}
            >
                <MaterialIcons color={colors.background[colorScheme]} size={18} name='arrow-back' />
            </HapticTab>
        )
    return (
        <Pressable
            onPress={() => router.push('/')}
            {...props}
        >
            <Image
                source={require('@/assets/images/icon.png')}
                className="w-10 h-10"
            />
        </Pressable>
    )
}