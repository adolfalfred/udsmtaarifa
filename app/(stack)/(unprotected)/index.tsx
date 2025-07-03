import { Image, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useExpoNotificationState } from "@/lib/zustand/useNotificationStore";
import ParallaxScrollViewStack from "@/components/ParallaxScrollViewStack";
import { useSessionStore } from "@/lib/zustand/useSessionStore";
import Toast, { type ToastType } from "@/components/ui/Toast";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useColorScheme } from "@/hooks/useColorScheme";
import { colors } from "@/constants/Colors";
import Button from "@/components/ui/Button";
import { useRef, useState } from "react";
import { signIn } from "@/lib/auth";
import { Link } from "expo-router";

export default function Login() {
    const colorScheme = useColorScheme()
    const { setIsLoggedIn, setUser } = useSessionStore()
    const { expoPushToken } = useExpoNotificationState()

    const [loading, setLoading] = useState(false);
    const [regNo, setRegNo] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const toastRef = useRef<{ show: (params: { type: ToastType; text: string; shouldClose?: boolean }) => void }>(null);
    const addToast = (type: ToastType, text: string, shouldClose?: boolean) => {
        if (toastRef.current) toastRef.current.show({ type, text, shouldClose })
    };

    const loginFxn = async () => {
        try {
            setLoading(true)
            addToast('loading', "Logging in...")
            const auth = await signIn(regNo, password, expoPushToken.length > 0 ? expoPushToken : undefined)
            if (auth && typeof auth !== 'string') {
                setIsLoggedIn(true)
                setUser(auth)
                console.log(auth)
                addToast('success', "Welcome!", true)
                return;
            } else addToast('danger', auth, true)
        } catch (error: any) {
            if (error.isAxiosError && error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                addToast('danger', error.response.data, true)
            } else if (error.request) {
                console.log(error.request);
                addToast('danger', "No response received from the server. Check your network.", true)
            } else {
                console.log('Error', error.message);
                addToast('danger', "An error occurred while setting up the request.", true)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <ParallaxScrollViewStack
                headerImage={
                    <View className="flex-col items-center justify-center py-32 gap-4">
                        <Image
                            source={require('@/assets/images/icon.png')}
                            className="w-36 h-36"
                        />
                        <Text className="text-foreground-light dark:text-foreground-dark text-3xl">Welcome Back!</Text>
                    </View>
                }
            >
                <KeyboardAvoidingView className="px-6 flex-col gap-10 bg-background-light dark:bg-background-dark">
                    <View className="flex-row items-center w-full py-3 px-4 border border-foreground-light/60 dark:border-foreground-dark/60 rounded-full">
                        <FontAwesome6 name="user-circle" size={20} color="#aaa" className="mr-5" />
                        <TextInput
                            placeholder="Registration Number"
                            value={regNo}
                            onChangeText={setRegNo}
                            autoCapitalize="none"
                            keyboardType="numbers-and-punctuation"
                            className="flex-1 h-10 border-0 p-0 text-lg text-foreground-light dark:text-foreground-dark"
                            placeholderTextColor="#aaa"
                            cursorColor={colors.primary[colorScheme]}
                        />
                    </View>
                    <View>
                        <View className="flex-row items-center w-full py-3 px-4 border border-foreground-light/60 dark:border-foreground-dark/60 rounded-full">
                            <MaterialIcons name="lock" size={20} color="#aaa" className="mr-5" />
                            <TextInput
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                autoCapitalize="none"
                                className="flex-1 h-10 border-0 p-0 text-lg text-foreground-light dark:text-foreground-dark"
                                placeholderTextColor="#aaa"
                                cursorColor={colors.primary[colorScheme]}
                                secureTextEntry={!isPasswordVisible}
                            />
                            <TouchableOpacity
                                className="p-2.5 ml-2"
                                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                            >
                                <FontAwesome
                                    name={isPasswordVisible ? 'eye' : 'eye-slash'}
                                    size={20}
                                    color="#aaa"
                                />
                            </TouchableOpacity>
                        </View>
                        <Link href={'/register'} className="mt-3 mr-0 ml-auto">
                            <Text className="text-foreground-light/60 dark:text-foreground-dark/60">Forgot Password?</Text>
                        </Link>
                    </View>
                    <Button
                        onPress={loginFxn}
                        className="bg-primary-light dark:bg-primary-dark rounded-full"
                        textClassName="text-foreground-dark text-2xl"
                        disabled={loading}
                    >
                        Login
                    </Button>
                    <View className="flex-row gap-1.5 items-center justify-center">
                        <Text className="text-foreground-light dark:text-foreground-dark text-lg">Don&apos;t have an account?</Text>
                        <Link href={'/register'}>
                            <Text className="text-success-light/90 dark:text-success-dark/60 text-lg">Register Now!</Text>
                        </Link>
                    </View>
                </KeyboardAvoidingView>
            </ParallaxScrollViewStack>
            <Toast ref={toastRef} />
        </>
    )
}