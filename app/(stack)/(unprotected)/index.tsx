import Button from "@/components/ui/Button";
import ParallaxScrollViewStack from "@/components/ParallaxScrollViewStack";
import { colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";
import { useState } from "react";
import { Image, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
    const colorScheme = useColorScheme()
    const [regNo, setRegNo] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <ParallaxScrollViewStack
            headerImage={
                <View className="flex-col items-center justify-center py-32 gap-4">
                    <Image
                        source={require('@/assets/images/icon.png')}
                        className="w-28 h-28"
                    />
                    <Text className="text-foreground-light dark:text-foreground-dark text-4xl">Welcome Back!</Text>
                </View>
            }
        >
            <KeyboardAvoidingView className="flex-col gap-10 bg-background-light dark:bg-background-dark">
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
                <View>
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
                    <Link href={'/register'} className="mt-3 mr-0 ml-auto">
                        <Text className="text-foreground-light/60 dark:text-foreground-dark/60">Forgot Password?</Text>
                    </Link>
                </View>
                <Button
                    onPress={() => { }}
                    className="bg-primary-light dark:bg-primary-dark "
                    textClassName="text-foreground-dark text-2xl"
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
    )
}