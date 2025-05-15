import { useState } from 'react';
import { Image } from 'expo-image';
import { Text, TouchableOpacity, View, Modal, Pressable } from 'react-native';
import { useSessionStore } from '@/lib/zustand/useSessionStore';
import { signOut } from '@/lib/auth';

export default function DropdownMenu() {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const { user, setIsLoggedIn, setUser } = useSessionStore()

    const logoutFxn = () => {
        setUser(null)
        setIsLoggedIn(false)
        signOut()
    }

    return (
        <>
            <TouchableOpacity
                onPress={() => setDropdownVisible(true)}
                className="h-10 w-10 rounded-full overflow-hidden mr-4"
            >
                <Image
                    style={{
                        flex: 1,
                        width: '100%',
                        backgroundColor: '#0553',
                        borderRadius: '100%'
                    }}
                    source={user?.image}
                    contentFit="cover"
                    transition={1000}
                />
            </TouchableOpacity>

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
                    <View className="absolute top-14 right-4 bg-active-light dark:bg-active-dark rounded-lg w-40 p-1" style={{ elevation: 5 }}>

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
