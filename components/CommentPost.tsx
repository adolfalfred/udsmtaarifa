import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useColorScheme } from '@/hooks/useColorScheme'
import { View, Text, Pressable, StatusBar, TextInput } from 'react-native'
import { Image } from 'expo-image';
import { colors } from '@/constants/Colors'
import { useCallback, useMemo, useRef, useState } from 'react'
import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { useCommentsQuery } from '@/queries/useCommentsQuery';
import { useQueryClient } from '@tanstack/react-query';
import Button from './ui/Button';
import api from '@/lib/api';
import { useSessionStore } from '@/lib/zustand/useSessionStore';
import type { CommentProps } from '@/types/comment';

export default function CommentPost({ id, postComments }: { id: string; postComments: number }) {
    const colorScheme = useColorScheme()

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
                    {postComments.toLocaleString('en-US')}
                </Text>
            </Pressable>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                name='PostComments'
                stackBehavior='replace'
                enableContentPanningGesture={false}
                backgroundStyle={{ backgroundColor: colors.background[colorScheme] }}
                handleIndicatorStyle={{ backgroundColor: colors.foreground[colorScheme] }}
                topInset={StatusBar.currentHeight || 0}
                snapPoints={snapPoints}
                onDismiss={closeModal}
                index={1}
                backdropComponent={(props) => <BottomSheetBackdrop
                    {...props}
                    appearsOnIndex={0}
                    disappearsOnIndex={-1}
                    pressBehavior="close"
                />}
                footerComponent={() => <ChatInput postId={id} handleRefresh={handleRefresh} />}
            >
                <BottomSheetView className='flex-1 py-2 bg-background-light dark:bg-background-dark'>
                    <BottomSheetFlatList
                        data={data}
                        keyExtractor={(item) => `${item.id}`}
                        showsVerticalScrollIndicator={false}
                        refreshing={refreshing}
                        onEndReached={handleLoadMore}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        onEndReachedThreshold={0.2}
                        renderItem={({ item }) => <CommentComp item={item} />}
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
                </BottomSheetView>
            </BottomSheetModal>
        </>
    )
}

const ChatInput = ({ postId, handleRefresh }: { postId: string; handleRefresh: () => void }) => {
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const { user } = useSessionStore()
    const queryClient = useQueryClient()

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
                await queryClient.invalidateQueries({
                    refetchType: "active",
                    queryKey: ["post"],
                });
            }
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    if (!user?.id) return;
    return (
        <View className="-mt-20 px-4 pb-6 sticky bg-background-light dark:bg-background-dark flex-row gap-1 items-end justify-between">
            <TextInput
                className={`w-11/12 shrink border border-[#aaa] px-3 py-4 rounded-[24px] text-black dark:text-white bg-background-light dark:bg-background-dark ${loading ? 'opacity-50' : 'opacity-100'}`}
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
                className={`w-2/12 shrink-0 rounded-full bg-primary-light dark:bg-primary-dark ${loading ? 'opacity-50' : 'opacity-100'}`}
                onPress={postFxn}
                disabled={loading}
            >
                <FontAwesome size={19} name='send-o' color={colors.foreground.dark} />
            </Button>
        </View>
    )
}

const CommentComp = ({ item }: { item: CommentProps }) => {
    return (
        <View className='flex flex-col gap-0.5 mb-4 px-6'>
            <View className='gap-2 flex-row items-center'>
                <View className='w-10 h-10 rounded-full overflow-hidden'>
                    <Image
                        style={{
                            flex: 1,
                            width: '100%',
                            backgroundColor: '#0553',
                            borderRadius: '100%'
                        }}
                        source={item?.user?.image || null}
                        contentFit="cover"
                    />
                </View>
                <View>
                    <Text className='text-foreground-light dark:text-foreground-dark text-sm'>{item.user.name}</Text>
                    <Text className='text-[#aaa] text-sm'>{item.user.email}</Text>
                </View>
            </View>
            <Text className='text-foreground-light dark:text-foreground-dark ml-12'>{item.content}</Text>
        </View>
    )
}