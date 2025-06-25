import { useSessionStore } from '@/lib/zustand/useSessionStore';
import { useColorScheme } from '@/hooks/useColorScheme';
import { TouchableOpacity } from 'react-native';
import { colors } from '@/constants/Colors';
import { Image } from 'expo-image';
import { Link } from 'expo-router';

export default function ProfileButton(props: {
    tintColor?: string;
    pressColor?: string;
    pressOpacity?: number;
    canGoBack: boolean;
}) {
    const { user } = useSessionStore()
    const colorScheme = useColorScheme()
    return (
        <Link href='/(stack)/(protected)/profile' asChild>
            <TouchableOpacity
                {...props}
                className={`h-10 w-10 rounded-full overflow-hidden`}
            >
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
    )
}