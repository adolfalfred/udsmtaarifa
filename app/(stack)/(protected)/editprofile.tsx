import { KeyboardAvoidingView, TextInput, View, Text, TouchableOpacity, Image } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ParallaxScrollViewStack from "@/components/ParallaxScrollViewStack";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSessionStore } from "@/lib/zustand/useSessionStore";
import SelectCurrentYear from "@/components/SelectCurrentYear";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SelectStartYear from "@/components/SelectStartYear";
import SelectProgramme from "@/components/SelectProgramme";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Toast, { ToastType } from "@/components/ui/Toast";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useUserQuery } from "@/queries/useUserQuery";
import SelectImage from "@/components/SelectImage";
import * as FileSystem from "expo-file-system";
import { colors } from "@/constants/Colors";
import Button from "@/components/ui/Button";
import { useRef, useState } from "react";
import { router } from "expo-router";
import api from "@/lib/api";

export default function EditProfileScreen() {
    const { user } = useSessionStore()
    const queryClient = useQueryClient()
    const colorScheme = useColorScheme()

    const { data } = useUserQuery(user!.id)

    const [name, setName] = useState(data?.name || '');
    const [email, setEmail] = useState(data?.email || '');
    const [phone, setPhone] = useState(data?.phone || '');
    const [image, setImage] = useState<string | null>(null);
    const [programmeId, setProgrammeId] = useState<string | null>(data?.programme[0].programmeId || null);
    const [startYear, setStartYear] = useState<number | null>(data?.programme[0].startYear || null);
    const [totalYears, setTotalYears] = useState<number | null>(data?.programme[0].programme.years || null);
    const [currentStudyYear, setCurrentStudyYear] = useState<number>(data?.programme[0].currentStudyYear || 0);
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isPassword2Visible, setIsPassword2Visible] = useState(false);
    const [loading, setLoading] = useState(false)

    const toastRef = useRef<{ show: (params: { type: ToastType; text: string; shouldClose?: boolean }) => void }>(null);
    const addToast = (type: ToastType, text: string, shouldClose?: boolean) => {
        if (toastRef.current) toastRef.current.show({ type, text, shouldClose })
    };

    const patchFxn = async () => {
        try {
            if (!user) return
            const missingFields = [];
            if (name.length === 0) missingFields.push("Name")
            if (!programmeId) missingFields.push("Studying Programme")
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
            if (password.length > 0 && password.length < 8) {
                addToast('danger', "Password is too short!", true)
                return
            }
            if (password.length > 0 && password !== repeatPassword) {
                addToast('danger', "Passwords do not match!", true)
                return
            }
            setLoading(true)
            addToast('loading', "Updating account...")

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
            } else if (user.image) e.append("image", user.image)
            else e.delete('image')

            e.append("name", name)
            e.append("email", email)
            e.append("phone", phone)
            e.append("currentStudyYear", `${currentStudyYear}`)
            e.append("startYear", `${startYear}`)
            if (password && password.length > 0) e.append("password", password)
            if (programmeId) e.append("programmeId", programmeId)

            const res = await api.patch(`/user/${user.id}`, e, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            addToast('success', "Account updated successfully", true)
            console.log(res?.data)
            queryClient.clear();
            if (router.canGoBack()) router.back()
            else router.replace('/(stack)/(protected)/(tabs)/news')
            // const auth = await signIn(regNo, password)
            // if (auth) {
            //     setIsLoggedIn(true)
            //     setUser(auth)
            //     addToast('success', "Welcome!", true)
            //     return;
            // }
        } catch (error: any) {
            if (error.isAxiosError && error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                if (typeof error.response.data === 'string') addToast('danger', error.response.data, true);
                else if (error.response.data?.error && error.response.data.error?.message && typeof error.response.data.error.message === 'string')
                    addToast('danger', error.response.data.error.message, true)
                else addToast('danger', 'An unexpected error occurred', true);
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

    const { data: programmes } = useQuery({
        queryKey: ["programme", { search: "", limit: 10000, page: 1 }],
        queryFn: () => api.get(`/programme?s=&limit=10000&page=1`).then((res) => res.data),
    });

    return (
        <>
            <ParallaxScrollViewStack
                headerImage={
                    <View className="flex-col items-center justify-center gap-4">
                        {image ? (<Image
                            source={{ uri: image }}
                            className="w-36 h-36 rounded-lg"
                        />) : <>
                            {user?.image ? (<Image
                                source={{ uri: user.image }}
                                className="w-36 h-36 rounded-lg"
                            />) : <View className="w-36 h-36 rounded-lg bg-foreground-light/5 dark:bg-foreground-dark/5">
                                <Text className="text-foreground-light/60 dark:text-foreground-dark/60 text-xs italic">No Image</Text>
                            </View>}
                        </>}
                    </View>
                }>
                <KeyboardAvoidingView className="px-6 pb-6 flex-col gap-8 bg-background-light dark:bg-background-dark">
                    <View className="flex-row items-center w-full py-3 px-4 border border-foreground-light/60 dark:border-foreground-dark/60 rounded-full">
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
                    <View className="flex-row items-center w-full py-3 px-4 border border-foreground-light/60 dark:border-foreground-dark/60 rounded-full">
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
                    <View className="flex-row items-center w-full py-3 px-4 border border-foreground-light/60 dark:border-foreground-dark/60 rounded-full">
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
                        data={programmes?.data || []}
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
                    <View className="flex-row items-center w-full py-3 px-4 border border-foreground-light/60 dark:border-foreground-dark/60 rounded-full">
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
                    <SelectImage photo={user?.image || null} setImageId={setImage} />
                    <Button
                        onPress={patchFxn}
                        className="bg-primary-light dark:bg-primary-dark w-full mb-6 rounded-full"
                        textClassName="text-foreground-dark text-2xl"
                        disabled={loading}
                    >
                        Update Profile
                    </Button>
                </KeyboardAvoidingView>
            </ParallaxScrollViewStack>
            <Toast ref={toastRef} />
        </>
    )
}
