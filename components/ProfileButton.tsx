import { useSessionStore } from '@/lib/zustand/useSessionStore';
import { useColorScheme } from '@/hooks/useColorScheme';
import { TouchableOpacity, View } from 'react-native';
import { colors } from '@/constants/Colors';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function ProfileButton(props: {
    tintColor?: string;
    pressColor?: string;
    pressOpacity?: number;
    canGoBack: boolean;
}) {
    const { user } = useSessionStore()
    const colorScheme = useColorScheme()
    return (
        <View
            {...props}
            className='flex-row gap-2 items-center justify-between'
        >
            <Link href='/(stack)/(protected)/notifications/notification' asChild>
                <TouchableOpacity className={`h-10 w-10 rounded-full overflow-hidden items-center justify-center`}>
                    <MaterialIcons name='notifications-on' size={20} color={colors.foreground[colorScheme]} />
                </TouchableOpacity>
            </Link>
            <Link href='/(stack)/(protected)/profile' asChild>
                <TouchableOpacity className={`h-10 w-10 rounded-full overflow-hidden`}>
                    <Image
                        style={{
                            flex: 1,
                            width: '100%',
                            backgroundColor: `${colors.foreground[colorScheme]}10`,
                            borderRadius: '100%'
                        }}
                        source={user?.image}
                        contentFit="cover"
                    />
                </TouchableOpacity>
            </Link>
        </View>
    )
}