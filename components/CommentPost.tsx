import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useColorScheme } from '@/hooks/useColorScheme'
import { View, Text, Pressable, StatusBar, TextInput } from 'react-native'
import { Image } from 'expo-image';
import { colors } from '@/constants/Colors'
import { useCallback, useMemo, useRef, useState } from 'react'
import { BottomSheetFlatList, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { useCommentsQuery } from '@/queries/useCommentsQuery';
import { useQueryClient } from '@tanstack/react-query';
import Button from './ui/Button';
import api from '@/lib/api';
import { useSessionStore } from '@/lib/zustand/useSessionStore';

export default function CommentPost({ id, postComments }: { id: string; postComments: number }) {
    const colorScheme = useColorScheme()

    const [comments, setComments] = useState(postComments)
    const [refreshing, setRefreshing] = useState(false)
    const [page, setPage] = useState(1)

    const { data, isLoading, nextPage } = useCommentsQuery('', page, id, '')
    const queryClient = useQueryClient();

    const handleLoadMore = () => {
        if (nextPage) setPage(prev => prev + 1)
    }

    const handleRefresh = async () => {
        setRefreshing(true);
        await queryClient.invalidateQueries({
            refetchType: "active",
            queryKey: ["comment"],
        });
        setPage(1);
        setRefreshing(false);
    }

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const presentModal = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const closeModal = useCallback(() => {
        bottomSheetModalRef.current?.close();
    }, []);
    const snapPoints = useMemo(() => ['65%', '100%'], []);

    return (
        <>
            <Pressable onPress={presentModal} className='flex-row items-center gap-2 min-w-20 shrink-0'>
                <FontAwesome
                    className='mb-1.5'
                    size={24}
                    name='comment-o'
                    color={`${colors.foreground[colorScheme]}e0`}
                />
                <Text className='text-foreground-light/60 dark:text-foreground-dark text-sm'>
                    {comments.toLocaleString('en-US')}
                </Text>
            </Pressable>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                name='SelectCategories'
                stackBehavior='replace'
                backgroundStyle={{ backgroundColor: colors.background[colorScheme] }}
                handleIndicatorStyle={{ backgroundColor: colors.foreground[colorScheme] }}
                backdropComponent={() => <View className='bg-black/40 flex-1 absolute inset-0'></View>}
                topInset={StatusBar.currentHeight || 0}
                snapPoints={snapPoints}
                onDismiss={closeModal}
            >
                <BottomSheetView className='flex-1 p-6 bg-background-light dark:bg-background-dark'>
                    <View className="flex-1 pb-24">
                        <BottomSheetFlatList
                            data={data}
                            keyExtractor={(item) => `${item.id}`}
                            showsVerticalScrollIndicator={false}
                            refreshing={refreshing}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.2}
                            renderItem={({ item }) => (
                                <View className='flex flex-col gap-0.5 mb-4'>
                                    <View className='gap-2 flex-row items-center'>
                                        <View className='w-8 h-8 rounded-full overflow-hidden'>
                                            <Image
                                                style={{
                                                    flex: 1,
                                                    width: '100%',
                                                    backgroundColor: '#0553',
                                                    borderRadius: '100%'
                                                }}
                                                source={item?.user.image}
                                                contentFit="cover"
                                                transition={1000}
                                            />
                                        </View>
                                        <View>
                                            <Text className='text-foreground-light dark:text-foreground-dark text-xs'>{item.user.name}</Text>
                                            <Text className='text-[#aaa] text-xs'>{item.user.email}</Text>
                                        </View>
                                    </View>
                                    <Text className='text-foreground-light dark:text-foreground-dark ml-10'>{item.content}</Text>
                                </View>
                            )}
                            ListEmptyComponent={() => {
                                if (isLoading) return (
                                    <>
                                        <View className='w-full bg-foreground-light/20 dark:bg-foreground-dark/20 h-5 rounded'></View>
                                        <View className='w-full bg-foreground-light/20 dark:bg-foreground-dark/20 h-5 rounded'></View>
                                    </>
                                )
                                return <Text className="text-black dark:text-white text-center mt-10">No comments yet!</Text>
                            }}
                        />
                    </View>
                    <ChatInput postId={id} handleRefresh={handleRefresh} setComments={setComments} />
                </BottomSheetView>
            </BottomSheetModal>
        </>
    )
}

const ChatInput = ({ postId, handleRefresh, setComments }: { setComments: React.Dispatch<React.SetStateAction<number>>; postId: string; handleRefresh: () => void }) => {
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const { user } = useSessionStore()

    const postFxn = async () => {
        if (content.length === 0 || !user?.id) return
        try {
            setLoading(true)
            const res = await api.post(`/post/comment`, {
                userId: user.id,
                postId,
                content
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (res) {
                setContent("")
                handleRefresh()
                setComments(prev => prev + 1)
            }
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    if (!user?.id) return;
    return (
        <View className="absolute bottom-0 left-0 right-0 px-4 pb-4 bg-background-light dark:bg-background-dark flex-row gap-1 items-end justify-between">
            <TextInput
                className="w-11/12 shrink border border-[#aaa] px-3 py-4 rounded-[24px] text-black dark:text-white bg-background-light dark:bg-background-dark"
                placeholder="Comment..."
                placeholderTextColor="#999"
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                editable={!loading}
            />
            <Button
                className={
                    `w-2/12 shrink-0 rounded-full ${loading ? 'opacity-50' : 'bg-primary-light dark:bg-primary-dark'}`}
                onPress={postFxn}
                disabled={loading}
            >
                <FontAwesome size={19} name='send-o' color={colors.foreground.dark} />
            </Button>
        </View>
    )
}