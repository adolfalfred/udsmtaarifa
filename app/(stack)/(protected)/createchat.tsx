import Button from "@/components/ui/Button";
import Toast, { ToastType } from "@/components/ui/Toast";
import { useRef, useState } from "react";
import { KeyboardAvoidingView, TextInput, ScrollView, View } from "react-native";
import * as FileSystem from "expo-file-system";
import { useSessionStore } from "@/lib/zustand/useSessionStore";
import api from "@/lib/api";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useColorScheme } from "@/hooks/useColorScheme";
import SelectUsers from "@/components/SelectUser";
import type { ChatProps } from "@/types/chat";
import { colors } from "@/constants/Colors";
import SelectImage from "@/components/SelectImage";

export default function CreateChat() {
    const [loading, setLoading] = useState(false)
    const [userIds, setUserIds] = useState<string[]>([])
    const [type, setType] = useState<ChatProps['type'] | null>(null)
    const [name, setName] = useState<string>('')
    const [image, setImage] = useState<string | null>(null);
    const [description, setDescription] = useState<string>('')

    const { user } = useSessionStore()
    const queryClient = useQueryClient()
    const colorScheme = useColorScheme()

    const toastRef = useRef<{ show: (params: { type: ToastType; text: string; shouldClose?: boolean }) => void }>(null);
    const addToast = (type: ToastType, text: string, shouldClose?: boolean) => {
        if (toastRef.current) toastRef.current.show({ type, text, shouldClose })
    };

    const postFxn = async () => {
        try {
            if (!user || !type) return
            const missingFields = [];
            if (name.length === 0 && type === 'group') missingFields.push("Name")
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
            addToast('loading', "Creating chat...")

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
            }

            if (name.length === 0) e.append("name", 'Chat')
            else e.append("name", name)
            if (description) e.append("description", description)
            e.append("type", type)
            e.append('userId', user.id)

            if (userIds?.length && userIds.length > 0) {
                e.append('userLength', `${userIds.length}`)
                await Promise.all(
                    userIds.map(async (item, i) => {
                        e.append(`userId-${i + 1}`, item);
                    })
                );
            }

            await api.post(`/chat`, e, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }).then(async () => await queryClient.invalidateQueries({
                refetchType: "active",
                queryKey: ["chat"],
            }));
            addToast('success', "Chat created successfully", true)
            if (router.canGoBack()) router.back()
            else router.replace('/(stack)/(protected)/(tabs)/message/messages')

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

    return (
        <>
            {!type ? (
                <View className="mx-6 gap-8 py-6">
                    <Button
                        onPress={() => setType('chat')}
                        className="rounded-full border border-primary-light dark:border-primary-dark bg-primary-light/30 dark:bg-primary-dark/10"
                        textClassName="text-primary-light dark:text-primary-dark"
                    >
                        Single Chat
                    </Button>
                    <Button
                        onPress={() => setType('group')}
                        className="rounded-full border border-primary-light dark:border-primary-dark bg-primary-light/30 dark:bg-primary-dark/10"
                        textClassName="text-primary-light dark:text-primary-dark"
                    >
                        Create Group Chat
                    </Button>
                </View>
            ) : (
                <>
                    {type === 'group' ? (
                        <ScrollView className="px-6" showsVerticalScrollIndicator={false} snapToEnd>
                            <KeyboardAvoidingView className="gap-5 my-4 bg-background-light dark:bg-background-dark">
                                <TextInput
                                    className="border border-foreground-light/60 dark:border-foreground-dark/60 px-3 py-5 rounded-full text-black dark:text-white bg-background-light dark:bg-background-dark"
                                    placeholder="Enter Group Name"
                                    placeholderTextColor="#999"
                                    value={name}
                                    onChangeText={setName}
                                    autoFocus
                                    cursorColor={colors.primary[colorScheme]}
                                />
                                <TextInput
                                    className="border border-foreground-light/60 dark:border-foreground-dark/60 px-3 py-5 rounded-[26px] text-black dark:text-white bg-background-light dark:bg-background-dark"
                                    placeholder="Enter Group Description"
                                    placeholderTextColor="#999"
                                    value={description}
                                    onChangeText={setDescription}
                                    multiline
                                    numberOfLines={15}
                                    cursorColor={colors.primary[colorScheme]}
                                />
                                <SelectUsers type={type} setUserIds={setUserIds} userIds={userIds} />
                                <SelectImage photo={null} setImageId={setImage} />
                                <Button
                                    onPress={postFxn}
                                    className="bg-primary-light dark:bg-primary-dark w-full mb-6 rounded-full"
                                    textClassName="text-foreground-dark text-2xl"
                                    disabled={loading}
                                >
                                    Create Chat
                                </Button>
                            </KeyboardAvoidingView>
                        </ScrollView>
                    ) : (
                        <ScrollView className="px-6" showsVerticalScrollIndicator={false} snapToEnd>
                            <KeyboardAvoidingView className="gap-5 my-4 bg-background-light dark:bg-background-dark">
                                <SelectUsers type={type} setUserIds={setUserIds} userIds={userIds} />
                                <Button
                                    onPress={postFxn}
                                    className="bg-primary-light dark:bg-primary-dark w-full mb-6 rounded-full"
                                    textClassName="text-foreground-dark text-2xl"
                                    disabled={loading}
                                >
                                    Create Chat
                                </Button>
                            </KeyboardAvoidingView>
                        </ScrollView>
                    )}
                </>
            )}
            <Toast ref={toastRef} position="up" />
        </>
    )
}
