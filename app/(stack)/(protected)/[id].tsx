import Button from '@/components/ui/Button';
import { colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSessionStore } from '@/lib/zustand/useSessionStore';
import { useMessagesQuery } from '@/queries/useMessagesQuery';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LegendList } from '@legendapp/list';
import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    // FlatList,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

type Message = {
    id: string;
    text: string;
    sender: string;
};

export default function ChatScreen() {
    const [messages, setMessages] = useState<Message[]>([]);

    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useSessionStore()
    const [page, setPage] = useState(1)
    const [refreshing, setRefreshing] = useState(false)

    const { data, isLoading, nextPage } = useMessagesQuery("", page, id);
    const queryClient = useQueryClient();

    const handleLoadMore = () => {
        if (nextPage) setPage(prev => prev + 1)
    }

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await queryClient.invalidateQueries({
            refetchType: "active",
            queryKey: ["message"],
        });
        setPage(1);
        setRefreshing(false);
    }, [queryClient])

    const sendMessage = (input: string) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            text: input,
            sender: user!.id,
        };
        setMessages((prev) => [...prev, newMessage]);
    };


    return (
        <View className='flex-1 bg-background-light dark:bg-background-dark'>
            <LegendList
                data={data}
                renderItem={({ item }) => (
                    <View className={`max-w-[70%] p-2.5 rounded-[18px] my-0.5 ${item.user.id === user?.id ? 'bg-primary-light dark:bg-primary-dark/60 self-end' : 'bg-foreground-light/10 dark:bg-foreground-dark/10 self-start'}`}>
                        <Text className={`${item.user.id === user?.id ? 'text-foreground-dark' : 'text-foreground-light dark:text-foreground-dark'}`}>{item?.content}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 12 }}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.2}
                ListFooterComponent={nextPage ?
                    // <EventSkeleton count={1} />
                    <></>
                    : null}
                recycleItems
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

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={90}
            >

                <ChatInput sendMessage={sendMessage} />
            </KeyboardAvoidingView>
        </View>
    );
}


const ChatInput = ({ sendMessage }: { sendMessage: (input: string) => void }) => {
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)

    const { user } = useSessionStore()
    const colorScheme = useColorScheme()

    const postFxn = async () => {
        if (!content.trim() || !user?.id) return
        try {
            setLoading(true)
            sendMessage(content)
            setContent("")
            // const res = await api.post(`/post/comment`, {
            //     userId: user.id,
            //     postId,
            //     content
            // }, {
            //     headers: {
            //         'Content-Type': 'application/json',
            //     }
            // });
            // if (res) {
            //     setContent("")
            // }
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    if (!user?.id) return;
    return (
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
                editable={!loading}
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
    )
}