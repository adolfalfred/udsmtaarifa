import Button from "@/components/Button";
import ParallaxScrollViewStack from "@/components/ParallaxScrollViewStack";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, KeyboardAvoidingView, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Register() {
    const [regNo, setRegNo] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
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
            <KeyboardAvoidingView className="flex-col gap-8">
                <View className="flex-row items-center w-full py-3 px-4 border border-foreground-light/60 dark:border-foreground-dark/60 rounded-xl">
                    <MaterialIcons name="person" size={20} color="#aaa" className="mr-5" />
                    <TextInput
                        placeholder="Registration Number"
                        value={regNo}
                        onChangeText={setRegNo}
                        autoCapitalize="none"
                        keyboardType="numbers-and-punctuation"
                        className="flex-1 h-10 border-0 p-0 text-lg text-foreground-light dark:text-foreground-dark"
                        placeholderTextColor="#aaa"
                    />
                </View>
                <View className="flex-row items-center w-full py-3 px-4 border border-foreground-light/60 dark:border-foreground-dark/60 rounded-xl">
                    <MaterialIcons name="person" size={20} color="#aaa" className="mr-5" />
                    <TextInput
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                        className="flex-1 h-10 border-0 p-0 text-lg text-foreground-light dark:text-foreground-dark"
                        placeholderTextColor="#aaa"
                    />
                </View>
                <View className="flex-row items-center w-full py-3 px-4 border border-foreground-light/60 dark:border-foreground-dark/60 rounded-xl">
                    <MaterialIcons name="person" size={20} color="#aaa" className="mr-5" />
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        className="flex-1 h-10 border-0 p-0 text-lg text-foreground-light dark:text-foreground-dark"
                        placeholderTextColor="#aaa"
                    />
                </View>
                <View className="flex-row items-center w-full py-3 px-4 border border-foreground-light/60 dark:border-foreground-dark/60 rounded-xl">
                    <MaterialIcons name="person" size={20} color="#aaa" className="mr-5" />
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize="none"
                        className="flex-1 h-10 border-0 p-0 text-lg text-foreground-light dark:text-foreground-dark"
                        placeholderTextColor="#aaa"
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
                <Button
                    onPress={() => { }}
                    className="bg-primary-light dark:bg-primary-dark "
                    textClassName="text-foreground-dark text-2xl"
                >
                    Signup
                </Button>
                <View className="flex-row gap-1.5 items-center justify-center">
                    <Text className="text-foreground-light dark:text-foreground-dark text-lg">Already have an account?</Text>
                    <Pressable onPress={() => router.back()}>
                        <Text className="text-success-light/90 dark:text-success-dark/60 text-lg">Login!</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </ParallaxScrollViewStack>
    )
}