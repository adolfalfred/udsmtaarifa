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
import axios from "axios"
import Toast, { type ToastType } from "@/components/ui/Toast";
import SelectProgramme from "@/components/SelectProgramme";
import { useQuery } from "@tanstack/react-query";
import SelectImage from "@/components/SelectImage";
import * as FileSystem from "expo-file-system";
import SelectStartYear from "@/components/SelectStartYear";
import SelectCurrentYear from "@/components/SelectCurrentYear";
import { signIn } from "@/lib/auth";
import { useSessionStore } from "@/lib/zustand/useSessionStore";

export default function Register() {
    const colorScheme = useColorScheme()
    const { setIsLoggedIn, setUser } = useSessionStore()

    const [regNo, setRegNo] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [programmeId, setProgrammeId] = useState<string | null>(null);
    const [startYear, setStartYear] = useState<number | null>(null);
    const [totalYears, setTotalYears] = useState<number | null>(null);
    const [currentStudyYear, setCurrentStudyYear] = useState<number>(0);
    const [photo, setPhoto] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isPassword2Visible, setIsPassword2Visible] = useState(false);
    const [verified, setVerified] = useState(false)
    const [loading, setLoading] = useState(false)

    const toastRef = useRef<{ show: (params: { type: ToastType; text: string; shouldClose?: boolean }) => void }>(null);
    const addToast = (type: ToastType, text: string, shouldClose?: boolean) => {
        if (toastRef.current) toastRef.current.show({ type, text, shouldClose })
    };

    const verifyFxn = async () => {
        try {
            const missingFields = [];
            if (regNo.length === 0) missingFields.push("Registration Number")
            if (phone.length === 0) missingFields.push("Phone Number")
            if (email.length === 0) missingFields.push("Email")
            if (missingFields.length > 0) {
                const formattedFields =
                    missingFields.length > 1
                        ? missingFields.slice(0, -1).join(", ") +
                        " and " +
                        missingFields.slice(-1)
                        : missingFields[0];
                addToast("danger", `${formattedFields} ${missingFields.length === 1 ? "is" : "are"} required!`, true)
                return
            }
            if (!phone.startsWith("+255")) {
                addToast('danger', "Phone Number must start with +255!", true)
                return
            }
            setLoading(true)
            addToast('loading', "Verifying data...")
            const res = await axios.post(`${process.env.EXPO_PUBLIC_DB_SERVER}/auth/verify`, { email, phone, regNo });
            setPhoto(res.data?.image || null)
            setRegNo((prev) => res.data?.regNo ? res.data?.regNo : prev)
            setEmail((prev) => res.data?.email ? res.data?.email : prev)
            setPhone((prev) => res.data?.phone ? res.data?.phone : prev)
            setVerified(true)
            addToast('success', "Your data is verified, Finish setting up your account.", true)
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

    const signupFxn = async () => {
        try {
            const missingFields = [];
            if (name.length === 0) missingFields.push("Name")
            if (!programmeId) missingFields.push("Studying Programme")
            if (password.length === 0) missingFields.push("Password")
            if (missingFields.length > 0) {
                const formattedFields =
                    missingFields.length > 1
                        ? missingFields.slice(0, -1).join(", ") +
                        " and " +
                        missingFields.slice(-1)
                        : missingFields[0];
                addToast("danger", `${formattedFields} ${missingFields.length === 1 ? "is" : "are"} required!`, true)
                return
            }
            if (password.length < 8) {
                addToast('danger', "Password is too short!", true)
                return
            }
            if (password !== repeatPassword) {
                addToast('danger', "Passwords do not match!", true)
                return
            }
            setLoading(true)
            addToast('loading', "Creating account...")

            const e = new FormData();

            if (image) {
                const fileInfo = await FileSystem.getInfoAsync(image);
                if (!fileInfo.exists) {
                    console.error(`File not found: ${image}`);
                    return { error: "File not uploaded!" };
                }
                const uriParts = image.split(".");
                const fileExtension = uriParts[uriParts.length - 1];
                const fileName = `image.${fileExtension}`;
                const mimeType = `image/${fileExtension}`;
                e.append("image", {
                    uri: image,
                    name: fileName,
                    type: mimeType,
                } as any);
                console.log("Image", e.get("image"))
            } else if (photo) e.append("image", photo)
            else e.delete('image')

            e.append("name", name)
            e.append("email", email)
            e.append("regNo", regNo)
            e.append("phone", phone)
            e.append("currentStudyYear", `${currentStudyYear}`)
            e.append("startYear", `${startYear}`)
            e.append("password", password)
            if (programmeId) e.append("programmeId", programmeId)

            const res = await axios.post(`${process.env.EXPO_PUBLIC_DB_SERVER}/auth/signup`, e, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            addToast('success', "Account created successfully", true)
            console.log(res?.data)
            const auth = await signIn(regNo, password)
            if (auth) {
                setIsLoggedIn(true)
                setUser(auth)
                addToast('success', "Welcome!", true)
                return;
            }
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

    const { data } = useQuery({
        queryKey: ["programme", { search: "", limit: 10000, page: 1 }],
        queryFn: () => axios.get(`${process.env.EXPO_PUBLIC_DB_SERVER}/programme?s=&limit=10000&page=1`, { withCredentials: true }),
    });

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
                }>
                <KeyboardAvoidingView className="flex-col gap-8 bg-background-light dark:bg-background-dark">
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
                                    placeholder="Phone Number (+255...)"
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
                                    autoCapitalize="none"
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
                            <SelectProgramme
                                data={data?.data.data || []}
                                setProgrammeId={setProgrammeId}
                                programmeId={programmeId}
                                setTotalYears={setTotalYears}
                            />
                            <SelectStartYear
                                setStartYear={setStartYear}
                                startYear={startYear}
                            />
                            <SelectCurrentYear
                                currentYear={currentStudyYear}
                                setCurrentYear={setCurrentStudyYear}
                                totalYears={totalYears}
                            />
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
                            <SelectImage photo={photo} setImageId={setImage} />
                            <Button
                                onPress={signupFxn}
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