import SelectMedia from "@/components/SelectMedia";
import SelectCategories from "@/components/SelectCategories";
import Button from "@/components/ui/Button";
import Toast, { ToastType } from "@/components/ui/Toast";
import { useRef, useState } from "react";
import { KeyboardAvoidingView, TextInput, Text, ScrollView, Pressable, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import { useSessionStore } from "@/lib/zustand/useSessionStore";
import api from "@/lib/api";
import { router, useLocalSearchParams } from "expo-router";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

export default function PostScreen() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [location, setLocation] = useState('')
    const [date, setDate] = useState<Date>(new Date())
    // const [startTime, setStartTime] = useState<Date>(new Date())
    // const [endTime, setEndTime] = useState<Date>(new Date())
    const [media, setMedia] = useState<string[]>([])
    const [categories, setCategories] = useState<number[]>([])
    const [loading, setLoading] = useState(false)
    const { type } = useLocalSearchParams();

    const { user } = useSessionStore()

    const toastRef = useRef<{ show: (params: { type: ToastType; text: string; shouldClose?: boolean }) => void }>(null);
    const addToast = (type: ToastType, text: string, shouldClose?: boolean) => {
        if (toastRef.current) toastRef.current.show({ type, text, shouldClose })
    };

    const [showDatePicker, setShowDatePicker] = useState(false);
    const onChangeDate = (_event: DateTimePickerEvent, date?: Date | undefined) => {
        setShowDatePicker(Platform.OS === 'ios'); // keep open for iOS
        if (date) setDate(date);
    };
    // const [showStartPicker, setShowStartPicker] = useState(false);
    // const onChangeStart = (_event: DateTimePickerEvent, date?: Date | undefined) => {
    //     setShowStartPicker(Platform.OS === 'ios'); // keep open for iOS
    //     if (date) setDate(date);
    // };
    // const [showEndPicker, setShowEndPicker] = useState(false);
    // const onChangeEnd = (_event: DateTimePickerEvent, date?: Date | undefined) => {
    //     setShowEndPicker(Platform.OS === 'ios'); // keep open for iOS
    //     if (date) setDate(date);
    // };

    const postFxn = async () => {
        try {
            const missingFields = [];
            if (title.length === 0) missingFields.push("Event Title")
            if (content.length === 0) missingFields.push("Event Content")
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
            addToast('loading', "Posting event...")

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
            if (categories?.length && categories.length > 0) {
                e.append('categoryLength', `${categories.length}`)
                await Promise.all(
                    categories.map(async (item, i) => {
                        e.append(`category-${i + 1}`, `${item}`);
                    })
                );
            }

            e.append("userId", `${user!.id}`)
            e.append("title", title)
            e.append("content", content)
            e.append("location", location)
            e.append("date", `${date}`)
            await api.post(`/event`, e, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            addToast('success', "Event posted successfully", true)
            router.push('/(stack)/(protected)/(tabs)/events/?refresh=true')
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
                    <Text className="text-foreground-light dark:text-foreground-dark text-2xl font-bold text-center">{type === 'class' ? `Post Class Event` : 'Post Event'}</Text>
                    <KeyboardAvoidingView className="bg-background-light dark:bg-background-dark">
                        <TextInput
                            className="border border-[#aaa] p-3 rounded-md my-3 text-black dark:text-white bg-background-light dark:bg-background-dark"
                            placeholder="Event Title"
                            placeholderTextColor="#999"
                            value={title}
                            onChangeText={setTitle}
                            autoFocus
                        />
                        <TextInput
                            className="border border-[#aaa] p-3 rounded-md my-3 text-black dark:text-white bg-background-light dark:bg-background-dark"
                            placeholder="Event Description"
                            placeholderTextColor="#999"
                            value={content}
                            onChangeText={setContent}
                            multiline
                            numberOfLines={20}
                            textAlignVertical="top"
                        />
                        <TextInput
                            className="border border-[#aaa] p-3 rounded-md my-3 text-black dark:text-white bg-background-light dark:bg-background-dark"
                            placeholder="Location"
                            placeholderTextColor="#999"
                            value={location}
                            onChangeText={setLocation}
                            autoFocus
                        />

                        <Pressable
                            onPress={() => setShowDatePicker(true)}
                            className="border border-[#aaa] p-3 rounded-md my-3 bg-background-light dark:bg-background-dark"
                        >
                            <Text className="text-black dark:text-white">
                                {date.toDateString()}
                            </Text>
                        </Pressable>
                        {/* <Pressable
                            onPress={() => setShowStartPicker(true)}
                            className="border border-[#aaa] p-3 rounded-md my-3 bg-background-light dark:bg-background-dark"
                        >
                            <Text className="text-black dark:text-white">
                                {startTime.toDateString()}
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setShowEndPicker(true)}
                            className="border border-[#aaa] p-3 rounded-md my-3 bg-background-light dark:bg-background-dark"
                        >
                            <Text className="text-black dark:text-white">
                                {endTime.toDateString()}
                            </Text>
                        </Pressable> */}


                        <SelectMedia media={media} setMedia={setMedia} />
                        <SelectCategories categories={categories} setCategories={setCategories} />
                        <Button
                            onPress={postFxn}
                            className="bg-primary-light dark:bg-primary-dark w-full my-6"
                            textClassName="text-foreground-dark text-2xl"
                            disabled={loading}
                        >
                            Post Event
                        </Button>
                    </KeyboardAvoidingView>
                </ScrollView>
            </SafeAreaView>
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                />
            )}
            {/* {showStartPicker && (
                <DateTimePicker
                    value={startTime}
                    mode="time"
                    display="default"
                    onChange={onChangeStart}
                />
            )}
            {showEndPicker && (
                <DateTimePicker
                    value={endTime}
                    mode="time"
                    display="default"
                    onChange={onChangeEnd}
                />
            )} */}
            <Toast ref={toastRef} />
        </>
    )
}
