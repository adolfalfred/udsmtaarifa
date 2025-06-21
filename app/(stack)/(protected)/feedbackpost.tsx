import Button from "@/components/ui/Button";
import Toast, { ToastType } from "@/components/ui/Toast";
import { useRef, useState } from "react";
import { KeyboardAvoidingView, TextInput, Text, ScrollView, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSessionStore } from "@/lib/zustand/useSessionStore";
import api from "@/lib/api";
import { router } from "expo-router";
import SelectFeedbackType from "@/components/SelectFeedbackType";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function PostScreen() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [typeId, setTypeId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const { user } = useSessionStore()
    const colorScheme = useColorScheme()

    const toastRef = useRef<{ show: (params: { type: ToastType; text: string; shouldClose?: boolean }) => void }>(null);
    const addToast = (type: ToastType, text: string, shouldClose?: boolean) => {
        if (toastRef.current) toastRef.current.show({ type, text, shouldClose })
    };

    const postFxn = async () => {
        try {
            const missingFields = [];
            if (title.length === 0) missingFields.push("Feedback Title")
            if (description.length === 0) missingFields.push("Feedback Description")
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
            addToast('loading', "Posting feedback...")
            await api.post(`/feedback`, { userId: user!.id, title, description, typeId });
            addToast('success', "Feedback posted successfully", true)
            router.push('/(stack)/(protected)/(tabs)/feedback/feedbacks?refresh=true')
        } catch (error: any) {
            if (error.isAxiosError && error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                addToast('danger', error.response?.data || "An error occured!", true)
            } else if (error.request) {
                console.log(error.request);
                addToast('danger', "No response received from the server. Check your network.", true)
            } else if (error?.message) {
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
                        <Text className="text-foreground-light dark:text-foreground-dark text-2xl font-bold text-center">Post Feedback</Text>
                    </View>
                    <KeyboardAvoidingView className="bg-background-light dark:bg-background-dark">
                        <TextInput
                            className="border border-[#aaa] px-3 py-5 rounded-full my-3 text-black dark:text-white bg-background-light dark:bg-background-dark"
                            placeholder="Feedback Title"
                            placeholderTextColor="#999"
                            value={title}
                            onChangeText={setTitle}
                            autoFocus
                        />
                        <TextInput
                            className="border border-[#aaa] px-3 py-5 rounded-[25px] my-3 text-black dark:text-white bg-background-light dark:bg-background-dark"
                            placeholder="Feedback Description"
                            placeholderTextColor="#999"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={20}
                            textAlignVertical="top"
                        />

                        <SelectFeedbackType type={typeId} setType={setTypeId} />
                        <Button
                            onPress={postFxn}
                            className="bg-primary-light dark:bg-primary-dark w-full my-4 rounded-full"
                            textClassName="text-foreground-dark text-2xl"
                            disabled={loading}
                        >
                            Post Feedback
                        </Button>
                    </KeyboardAvoidingView>
                </ScrollView>
            </SafeAreaView>
            <Toast ref={toastRef} />
        </>
    )
}
