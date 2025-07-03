import Button from '@/components/ui/Button';
import { colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import api from '@/lib/api';
import { useSessionStore } from '@/lib/zustand/useSessionStore';
import { useMessagesQuery } from '@/queries/useMessagesQuery';
import type { MessageProps } from '@/types/message';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LegendList } from '@legendapp/list';
import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import Toast, { type ToastType } from "@/components/ui/Toast";
import {
    View,
    Text,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    StyleSheet
} from 'react-native';
import * as FileSystem from "expo-file-system"
import { Image } from 'expo-image';
import { useChatQuery } from '@/queries/useChatsQuery';
import { socket } from '@/lib/socket';

export default function ChatScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useSessionStore()
    const [page, setPage] = useState(1)
    const navigator = useNavigation()

    const { data: chat, isLoading: isLoadingChat } = useChatQuery(id);
    const { data, isLoading, nextPage } = useMessagesQuery("", page, id);
    const chats = useMemo(() => data, [data]);

    const handleLoadMore = () => {
        if (nextPage) setPage(prev => prev + 1)
    }

    useLayoutEffect(() => {
        navigator.setOptions({
            title: undefined,
            headerTitleAlign: 'left',
            headerTitle: (props: { children: string; tintColor?: string }) => {
                const member = chat && chat.type === 'chat' ? chat.members.find((item) => item.user.id !== user?.id) : undefined
                if (!chat) return <Text {...props} className=''>{props.children}</Text>
                return (
                    <View {...props} className='flex-row gap-2 h-full w-full px-4'>
                        <View className={`h-10 w-10 shrink-0 overflow-hidden bg-foreground-light/20 dark:bg-foreground-dark/20 border-2 border-primary-light dark:border-primary-dark ${chat.type === 'group' ? 'rounded-lg' : 'rounded-full'}`}>
                            {chat.type === 'chat' && member ? (
                                <Image
                                    style={{
                                        flex: 1,
                                        width: '100%',
                                        borderRadius: '100%'
                                    }}
                                    source={member.user.image}
                                    contentFit="cover"
                                />
                            ) : null}
                            {chat.type === 'group' && chat?.image && chat.image?.url ? (
                                <>
                                    <Image
                                        source={chat.image.url}
                                        contentFit="cover"
                                        style={StyleSheet.absoluteFill}
                                        blurRadius={20}
                                    />
                                    <Image
                                        style={{ width: '100%', height: '100%' }}
                                        source={chat.image.url}
                                        contentFit="cover"
                                        transition={500}
                                    />
                                </>
                            ) : null}
                        </View>
                        <View className='flex-col justify-center gap-1 shrink'>
                            <Text
                                numberOfLines={3}
                                ellipsizeMode="tail"
                                className='text-foreground-light dark:text-foreground-dark text-lg font-semibold'
                            >
                                {chat.type === 'chat' ? member ? member.user.name : "New Chat" : chat.name}
                            </Text>
                        </View>
                    </View>
                )
            }
        })
    }, [navigator, chat, user?.id, isLoadingChat])

    return (
        <>
            <LegendList
                data={chats}
                renderItem={({ item }) => <ChatBubble item={item} />}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 12 }}
                onStartReached={handleLoadMore}
                onStartReachedThreshold={0.1}
                alignItemsAtEnd
                maintainScrollAtEnd
                maintainScrollAtEndThreshold={0.1}
                ListFooterComponent={nextPage ?
                    // <EventSkeleton count={1} />
                    <></>
                    : null}
                recycleItems
                estimatedItemSize={20}
                ListEmptyComponent={() => {
                    if (isLoading) return <></> //<EventSkeleton count={10} />
                    return (
                        <View className="items-center justify-center h-96">
                            <Text className='text-foreground-light dark:text-foreground-dark'>
                                No messages yet
                            </Text>
                        </View>
                    )
                }}
            />
            <ChatInput
                chatId={id}
                setPage={setPage}
                name={chat ? chat.type === 'chat' ? chat.members.find((item) => item.user.id !== user?.id)?.user.name : chat.name : undefined} />
        </>
    );
}


const ChatInput = ({ chatId, setPage, name }: { chatId: string; setPage: (page: number) => void; name?: string | null }) => {
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [media, setMedia] = useState<string | null>(null);

    const queryClient = useQueryClient()
    const { user } = useSessionStore()
    const colorScheme = useColorScheme()

    const toastRef = useRef<{ show: (params: { type: ToastType; text: string; shouldClose?: boolean }) => void }>(null);
    const addToast = (type: ToastType, text: string, shouldClose?: boolean) => {
        if (toastRef.current) toastRef.current.show({ type, text, shouldClose })
    };

    const postFxn = async () => {
        if (!content.trim() || !user?.id) return
        try {
            setLoading(true)
            const e = new FormData();

            if (media) {
                const fileInfo = await FileSystem.getInfoAsync(media);
                if (!fileInfo.exists) {
                    console.error(`File not found: ${media}`);
                    return { error: "File not uploaded!" };
                }
                const uriParts = media.split(".");
                const fileExtension = uriParts[uriParts.length - 1];
                const fileName = `media.${fileExtension}`;
                const mimeType = `media/${fileExtension}`;
                e.append("media", {
                    uri: media,
                    name: fileName,
                    type: mimeType,
                } as any);
                console.log("Media", e.get("media"))
            }

            if (content.length > 0) e.append("content", content)
            e.append("userId", user.id)
            e.append("chatId", chatId)
            await api.post(`/message`, e, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }).then(async () => {
                setPage(1)
                await queryClient.invalidateQueries({
                    refetchType: "active",
                    queryKey: ["message"],
                })
                await queryClient.invalidateQueries({
                    refetchType: "active",
                    queryKey: ["chat"],
                })
                socket.emit("send-message", chatId, user.id, name, content)
                setPage(1)
                setContent("")
            })
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

    if (!user?.id) return;
    return (
        <>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={90}
            >
                <View className='flex-row px-2 pt-2 pb-7 items-end border-t border-foreground-light/10 dark:border-foreground-dark/10'>
                    <TextInput
                        className={`w-full shrink border border-foreground-light/20 dark:border-foreground-dark/20 px-3 py-4 rounded-l-[24px] rounded-r text-black dark:text-white bg-foreground-light/10 dark:bg-foreground-dark/10 ${loading ? 'opacity-50' : 'opacity-100'}`}
                        placeholder="Type message"
                        placeholderTextColor="#999"
                        value={content}
                        onChangeText={setContent}
                        multiline
                        numberOfLines={15}
                        textAlignVertical="top"
                        editable={!loading || name === null || name === undefined}
                        cursorColor={colors.primary[colorScheme]}

                    />
                    <Button
                        className={`w-20 h-fit shrink-0 rounded-l rounded-r-full bg-primary-light dark:bg-primary-dark/60 border border-primary-light dark:border-primary-dark/50 ${loading ? 'opacity-50' : 'opacity-100'}`}
                        onPress={postFxn}
                        disabled={loading}
                    >
                        <MaterialIcons size={19} name='send' color={colors.foreground.dark} />
                    </Button>
                </View>
            </KeyboardAvoidingView>
            <Toast ref={toastRef} position='up' />
        </>
    )
}

const ChatBubble = ({ item }: { item: MessageProps }) => {
    const { user } = useSessionStore()

    return (
        <View className='mt-2'>
            <View className={`${item.user.id === user?.id ? 'ml-auto mr-0 flex-row-reverse' : 'ml-0 mr-auto flex-row'} gap-1 items-center`}>
                <View className={`h-8 w-8 shrink-0 rounded-full overflow-hidden bg-foreground-light/20 dark:bg-foreground-dark/20`}>
                    {item.user?.image ? (
                        <Image
                            style={{
                                flex: 1,
                                width: '100%',
                                borderRadius: '100%'
                            }}
                            source={item.user.image}
                            cachePolicy='none'
                            contentFit="cover"
                        />
                    ) : null}
                </View>
                <Text className='text-foreground-light dark:text-foreground-dark text-sm'>{item.user.name}</Text>
            </View>
            <View className={`${item.user.id === user?.id ? "flex-row-reverse" : "flex-row"} gap-1`}>
                <View className={`max-w-[70%] p-2.5 rounded-[18px] my-0.5 ${item.user.id === user?.id ? 'bg-primary-light dark:bg-primary-dark/60 self-end' : 'bg-foreground-light/10 dark:bg-foreground-dark/10 self-start'}`}>
                    <Text className={`${item.user.id === user?.id ? 'text-foreground-dark' : 'text-foreground-light dark:text-foreground-dark'}`}>{item?.content}</Text>
                </View>
                <View className='h-auto w-fit flex-col justify-end pb-1'>
                    <Text className='text-foreground-light/60 dark:text-foreground-dark/60 text-xs'>{new Date(item.createdAt).toLocaleDateString('en', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, weekday: "short", day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}</Text>
                </View>
            </View>
        </View>
    )
}