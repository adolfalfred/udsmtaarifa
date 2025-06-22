import SelectMedia from "@/components/SelectMedia";
import SelectUnits from "@/components/SelectUnits";
import Button from "@/components/ui/Button";
import Toast, { ToastType } from "@/components/ui/Toast";
import { useRef, useState } from "react";
import { KeyboardAvoidingView, TextInput, Text, ScrollView, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import { useSessionStore } from "@/lib/zustand/useSessionStore";
import api from "@/lib/api";
import { router, useLocalSearchParams } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function PostScreen() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [media, setMedia] = useState<string[]>([])
    const [units, setUnits] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const { type } = useLocalSearchParams();

    const { user } = useSessionStore()
    const colorScheme = useColorScheme()

    const toastRef = useRef<{ show: (params: { type: ToastType; text: string; shouldClose?: boolean }) => void }>(null);
    const addToast = (type: ToastType, text: string, shouldClose?: boolean) => {
        if (toastRef.current) toastRef.current.show({ type, text, shouldClose })
    };

    const postFxn = async () => {
        try {
            const missingFields = [];
            if (title.length === 0) missingFields.push("News Title")
            if (content.length === 0) missingFields.push("News Content")
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
            setLoading(true)
            addToast('loading', "Posting news...")

            const e = new FormData();

            if (media?.length && media.length > 0) {
                e.append('mediaLength', `${media.length}`)
                await Promise.all(
                    media.map(async (image, i) => {
                        const fileInfo = await FileSystem.getInfoAsync(image);
                        if (!fileInfo.exists) {
                            console.error(`File not found: ${image}`);
                            throw new Error("File not uploaded!");
                        }

                        const uriParts = image.split(".");
                        const fileExtension = uriParts[uriParts.length - 1];
                        const fileName = `image.${fileExtension}`;
                        const mimeType = `image/${fileExtension}`;

                        e.append(`media-${i + 1}`, {
                            uri: image,
                            name: fileName,
                            type: mimeType,
                        } as any);
                    })
                );
            }
            if (units?.length && units.length > 0) {
                e.append('unitLength', `${units.length}`)
                await Promise.all(
                    units.map(async (item, i) => {
                        e.append(`unitId-${i + 1}`, item);
                    })
                );
            }

            e.append("userId", `${user!.id}`)
            e.append("title", title)
            e.append("content", content)
            e.append("type", type as string)
            e.append("availability", 'true')
            await api.post(`/post`, e, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            addToast('success', "News posted successfully", true)
            if (type === 'class') router.replace('/(stack)/(protected)/(tabs)/schooling/school?refresh=true')
            else router.replace('/(stack)/(protected)/(tabs)/news?refresh=true')
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
            <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark pt-5 px-6">
                <ScrollView className="flex-1">
                    <View className="relative h-10">
                        {router.canGoBack() && (
                            <TouchableOpacity onPress={() => router.back()} className='absolute left-0 p-1.5 rounded-full bg-foreground-light/50 dark:bg-foreground-dark/60'>
                                <MaterialIcons color={colors.background[colorScheme]} size={18} name='arrow-back' />
                            </TouchableOpacity>
                        )}
                        <Text className="text-foreground-light dark:text-foreground-dark text-2xl font-bold text-center">{type === 'class' ? `Post Class News` : 'Post News'}</Text>
                    </View>
                    <KeyboardAvoidingView className="bg-background-light dark:bg-background-dark">
                        <TextInput
                            className="border border-[#aaa] px-3 py-5 rounded-full my-4 text-black dark:text-white bg-background-light dark:bg-background-dark"
                            placeholder="News Title"
                            placeholderTextColor="#999"
                            value={title}
                            onChangeText={setTitle}
                            autoFocus
                        />
                        <TextInput
                            className="border border-[#aaa] px-3 py-5 rounded-[25px] my-4 text-black dark:text-white bg-background-light dark:bg-background-dark"
                            placeholder="News Description"
                            placeholderTextColor="#999"
                            value={content}
                            onChangeText={setContent}
                            multiline
                            numberOfLines={20}
                            textAlignVertical="top"
                        />
                        <SelectMedia media={media} setMedia={setMedia} />
                        <SelectUnits units={units} setUnits={setUnits} />
                        <Button
                            onPress={postFxn}
                            className="bg-primary-light dark:bg-primary-dark w-full my-6 rounded-full"
                            textClassName="text-foreground-dark text-2xl"
                            disabled={loading}
                        >
                            Post News
                        </Button>
                    </KeyboardAvoidingView>
                </ScrollView>
            </SafeAreaView>
            <Toast ref={toastRef} />
        </>
    )
}
