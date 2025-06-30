import type { NativeStackHeaderRightProps } from '@react-navigation/native-stack';
import { Text, TouchableOpacity, View, Modal, Pressable } from 'react-native';
import { useSessionStore } from '@/lib/zustand/useSessionStore';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useThemeStore } from '@/lib/zustand/useThemeStore';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useColorScheme } from '@/hooks/useColorScheme';
import { colors } from '@/constants/Colors';
import { signOut } from '@/lib/auth';
import { useState } from 'react';

export default function DropdownMenu(props: NativeStackHeaderRightProps) {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const { setIsLoggedIn, setUser } = useSessionStore()
    const colorScheme = useColorScheme()
    const { theme, setTheme } = useThemeStore()

    const logoutFxn = async () => {
        await signOut().then(() => {
            setUser(null)
            setIsLoggedIn(false)
        })
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
                    <View className="absolute top-16 right-2 bg-active-light dark:bg-active-dark rounded-xl w-40 p-1" style={{ elevation: 5 }}>
                        <View className='px-3 py-2 flex-row items-center justify-between'>
                            <TouchableOpacity
                                onPress={() => setTheme('light')}
                                className={`p-1.5 w-8 h-8 items-center justify-center rounded-full ${theme === 'light' ? 'bg-primary-light dark:bg-primary-dark' : 'bg-foreground-light/10 dark:bg-foreground-dark/10'}`}
                            >
                                <MaterialIcons
                                    name='light-mode'
                                    size={16}
                                    color={theme === 'light' ? `${colors.foreground.dark}` : colors.foreground[colorScheme]}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setTheme('system')}
                                className={`p-1.5 w-8 h-8 items-center justify-center rounded-full ${theme === 'system' ? 'bg-primary-light dark:bg-primary-dark' : 'bg-foreground-light/10 dark:bg-foreground-dark/10'}`}
                            >
                                <MaterialIcons
                                    name='phone-android'
                                    size={16}
                                    color={colorScheme === 'light' && theme === 'system' ? `${colors.foreground.dark}` : colors.foreground[colorScheme]}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setTheme('dark')}
                                className={`p-1.5 w-8 h-8 items-center justify-center rounded-full ${theme === 'dark' ? 'bg-primary-light dark:bg-primary-dark' : 'bg-foreground-light/10 dark:bg-foreground-dark/10'}`}
                            >
                                <MaterialIcons
                                    name='dark-mode'
                                    size={16}
                                    color={theme === 'dark' ? `${colors.foreground.dark}` : colors.foreground[colorScheme]}
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            onPress={logoutFxn}
                            className="px-3 py-2 flex-row gap-2 justify-between items-center"
                        >
                            <View className='w-8 h-8 shrink-0 flex-row p-1.5 items-center justify-center rounded-full bg-danger-light/90 dark:bg-danger-dark/70'>
                                <MaterialIcons
                                    name='logout'
                                    size={16}
                                    color={colors.foreground.dark}
                                />
                            </View>
                            <Text className="w-full text-foreground-light dark:text-foreground-dark text-lg">Logout</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}
