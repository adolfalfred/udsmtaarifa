import Button from "@/components/ui/Button";
import ParallaxScrollViewStack from "@/components/ParallaxScrollViewStack";
import { colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Image, KeyboardAvoidingView, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import Combobox from "@/components/ui/Combobox";
import axios from "axios"
import Toast, { type ToastType } from "@/components/ui/Toast";

export default function Register() {
    const colorScheme = useColorScheme()

    const [regNo, setRegNo] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isPassword2Visible, setIsPassword2Visible] = useState(false);
    const [verified, setVerified] = useState(false)
    const [loading, setLoading] = useState(false)

    const toastRef = useRef<{ show: (params: { type: ToastType; text: string; shouldClose?: boolean }) => void }>(null);

    const addToast = (type: ToastType, text: string, shouldClose?: boolean) => {
        if (toastRef.current) {
            toastRef.current.show({ type, text, shouldClose });
        }
    };

    const verifyFxn = async () => {
        try {
            setLoading(true)
            addToast('loading', "Verifying data...")
            const res = await axios.post(`${process.env.EXPO_PUBLIC_DB_SERVER}/auth/verify`, { email, phone, regNo });
            console.log(res.status);
            console.log(res.data);
            setPhoto(res.data?.image || null)
            setRegNo((prev) => res.data?.regNo ? res.data?.regNo : prev)
            setEmail((prev) => res.data?.email ? res.data?.email : prev)
            setPhone((prev) => res.data?.phone ? res.data?.phone : prev)
            setVerified(true)
            addToast('success', "Your data is verified, Finish setting up account.", true)
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
        } finally { setLoading(false) }
    }

    return (
        <>
            <ParallaxScrollViewStack
                headerImage={
                    <View className="flex-col items-center justify-center py-32 gap-4">
                        <Image
                            source={require('@/assets/images/icon.png')}
                            className="w-28 h-28"
                        />
                        <Text className="text-foreground-light dark:text-foreground-dark text-4xl">
                            {!verified ? 'Create Account!' : "Setup Account"}
                        </Text>
                    </View>
                }
            >
                <KeyboardAvoidingView className="flex-col gap-8">
                    {!verified ? (
                        <>
                            <View className="flex-row items-center w-full py-3 px-4 border border-foreground-light/60 dark:border-foreground-dark/60 rounded-xl">
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
                            <View className="flex-row items-center w-full py-3 px-4 border border-foreground-light/60 dark:border-foreground-dark/60 rounded-xl">
                                <MaterialCommunityIcons name="phone" size={20} color="#aaa" className="mr-5" />
                                <TextInput
                                    placeholder="Phone Number"
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                    className="flex-1 h-10 border-0 p-0 text-lg text-foreground-light dark:text-foreground-dark"
                                    placeholderTextColor="#aaa"
                                    cursorColor={colors.primary[colorScheme]}
                                />
                            </View>
                            <View className="flex-row items-center w-full py-3 px-4 border border-foreground-light/60 dark:border-foreground-dark/60 rounded-xl">
                                <MaterialCommunityIcons name="email" size={20} color="#aaa" className="mr-5" />
                                <TextInput
                                    placeholder="Email"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    className="flex-1 h-10 border-0 p-0 text-lg text-foreground-light dark:text-foreground-dark"
                                    placeholderTextColor="#aaa"
                                    cursorColor={colors.primary[colorScheme]}
                                />
                            </View>
                            <Button
                                onPress={async () => verifyFxn()}
                                className="bg-primary-light dark:bg-primary-dark "
                                textClassName="text-foreground-dark text-2xl"
                                disabled={loading}
                            >
                                Verify
                            </Button>
                            <View className="flex-row gap-1.5 items-center justify-center">
                                <Text className="text-foreground-light dark:text-foreground-dark text-lg">Already have an account?</Text>
                                <Pressable onPress={() => router.back()}>
                                    <Text className="text-success-light/90 dark:text-success-dark/60 text-lg">Login!</Text>
                                </Pressable>
                            </View>
                        </>
                    ) : (
                        <>
                            <View className="flex-row items-center w-full py-3 px-4 border border-foreground-light/60 dark:border-foreground-dark/60 rounded-xl">
                                <FontAwesome6 name="user-circle" size={20} color="#aaa" className="mr-5" />
                                <TextInput
                                    placeholder="Name"
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="none"
                                    keyboardType="numbers-and-punctuation"
                                    className="flex-1 h-10 border-0 p-0 text-lg text-foreground-light dark:text-foreground-dark"
                                    placeholderTextColor="#aaa"
                                    cursorColor={colors.primary[colorScheme]}
                                />
                            </View>
                            <Combobox />
                            <View className="flex-row items-center w-full py-3 px-4 border border-foreground-light/60 dark:border-foreground-dark/60 rounded-xl">
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
                            <View className="flex-row items-center w-full py-3 px-4 border border-foreground-light/60 dark:border-foreground-dark/60 rounded-xl">
                                <MaterialIcons name="lock" size={20} color="#aaa" className="mr-5" />
                                <TextInput
                                    placeholder="Repeat Password"
                                    value={repeatPassword}
                                    onChangeText={setRepeatPassword}
                                    autoCapitalize="none"
                                    className="flex-1 h-10 border-0 p-0 text-lg text-foreground-light dark:text-foreground-dark"
                                    placeholderTextColor="#aaa"
                                    cursorColor={colors.primary[colorScheme]}
                                    secureTextEntry={!isPassword2Visible}
                                />
                                <TouchableOpacity
                                    className="p-2.5 ml-2"
                                    onPress={() => setIsPassword2Visible(!isPassword2Visible)}
                                >
                                    <FontAwesome
                                        name={isPassword2Visible ? 'eye' : 'eye-slash'}
                                        size={20}
                                        color="#aaa"
                                    />
                                </TouchableOpacity>
                            </View>
                            <Button
                                onPress={() => { }}
                                className="bg-primary-light dark:bg-primary-dark "
                                textClassName="text-foreground-dark text-2xl"
                                disabled={loading}
                            >
                                Signup
                            </Button>
                        </>
                    )}
                </KeyboardAvoidingView>
            </ParallaxScrollViewStack>
            <Toast ref={toastRef} />
        </>
    )
}