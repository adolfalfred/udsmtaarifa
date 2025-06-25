import type { NativeStackHeaderRightProps } from '@react-navigation/native-stack';
import { Text, TouchableOpacity, View, Modal, Pressable } from 'react-native';
import { useSessionStore } from '@/lib/zustand/useSessionStore';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useColorScheme } from '@/hooks/useColorScheme';
import { colors } from '@/constants/Colors';
import { signOut } from '@/lib/auth';
import { useState } from 'react';

export default function DropdownMenu(props: NativeStackHeaderRightProps) {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const { setIsLoggedIn, setUser } = useSessionStore()
    const colorScheme = useColorScheme()

    const logoutFxn = () => {
        setUser(null)
        setIsLoggedIn(false)
        signOut()
    }

    return (
        <>
            <Pressable
                onPress={() => setDropdownVisible(true)}
                {...props}
                className='rounded-full bg-foreground-light/5 dark:bg-foreground-dark/5 h-10 w-10 flex-col items-center justify-center'
            >
                <FontAwesome6 size={18} name='ellipsis-vertical' color={`${colors.foreground[colorScheme]}d0`} />
            </Pressable>

            <Modal
                transparent
                animationType="none"
                visible={isDropdownVisible}
                onRequestClose={() => setDropdownVisible(false)}
            >
                <Pressable
                    onPress={() => setDropdownVisible(false)}
                    className="flex-1"
                >
                    <View className="absolute top-16 right-2 bg-active-light dark:bg-active-dark rounded-lg w-40 p-1" style={{ elevation: 5 }}>
                        <TouchableOpacity
                            onPress={logoutFxn}
                            className="p-3"
                        >
                            <Text className="text-foreground-light dark:text-foreground-dark text-lg">Logout</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}
