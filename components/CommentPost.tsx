import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetFooter, BottomSheetHandle, BottomSheetModal, BottomSheetTextInput } from '@gorhom/bottom-sheet'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useColorScheme } from '@/hooks/useColorScheme'
import { View, Text, Pressable, StatusBar } from 'react-native'
import { Image } from 'expo-image';
import { colors } from '@/constants/Colors'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useCommentsQuery } from '@/queries/useCommentsQuery';
import { useQueryClient } from '@tanstack/react-query';
import Button from './ui/Button';
import api from '@/lib/api';
import { useSessionStore } from '@/lib/zustand/useSessionStore';
import type { CommentProps } from '@/types/comment';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const keyExtractor = (item: CommentProps) => item.id

export default function CommentPost({ id, postComments }: { id: string; postComments: number }) {
    const colorScheme = useColorScheme()
    const queryClient = useQueryClient();

    const [refreshing, setRefreshing] = useState(false)
    const [page, setPage] = useState(1)

    const { data, isLoading, nextPage } = useCommentsQuery('', page, id)
    const comments = useMemo(() => data, [data]);

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
    const snapPoints = useMemo(() => ['65%'], []);
    // const snapPoints = useMemo(() => ['65%', '100%'], []);

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
                backgroundStyle={{ backgroundColor: colors.background[colorScheme] }}
                handleIndicatorStyle={{ backgroundColor: colors.foreground[colorScheme] }}
                topInset={StatusBar.currentHeight || 0}
                snapPoints={snapPoints}
                onDismiss={closeModal}
                enableDynamicSizing={false}
                backdropComponent={(props) => <BottomSheetBackdrop
                    {...props}
                    appearsOnIndex={0}
                    disappearsOnIndex={-1}
                    pressBehavior="close"
                />}
                handleComponent={(props) => (
                    <BottomSheetHandle
                        {...props}
                    >
                        <Text className='mt-4 w-full text-center text-foreground-light/60 dark:text-foreground-dark/60'>Comments</Text>
                    </BottomSheetHandle>
                )}
                footerComponent={(props) => (
                    <BottomSheetFooter
                        {...props}
                        style={{
                            flexDirection: 'row',
                            paddingHorizontal: 16,
                            paddingBottom: 24,
                            backgroundColor: colors.background[colorScheme],
                            alignItems: 'flex-end',
                            borderTopLeftRadius: 45,
                            borderTopRightRadius: 45
                        }}
                    >
                        <ChatInput postId={id} handleRefresh={handleRefresh} />
                    </BottomSheetFooter>
                )}
            >
                <BottomSheetFlatList
                    data={comments}
                    keyExtractor={keyExtractor}
                    showsVerticalScrollIndicator={false}
                    refreshing={refreshing}
                    onEndReached={handleLoadMore}
                    contentContainerStyle={{ paddingBottom: 75, paddingTop: 2 }}
                    onEndReachedThreshold={0.2}
                    renderItem={({ item }) => <CommentComp item={item} />}
                    ListEmptyComponent={() => {
                        if (isLoading) return <ItemSkeleton count={10} />
                        return <Text className="text-foreground-light dark:text-foreground-dark text-center mt-44">No comments yet!</Text>
                    }}
                    ListFooterComponent={() => {
                        if (isLoading) return <ItemSkeleton count={1} />
                        if (comments.length > 0 && !isLoading) return <Text className="text-foreground-light/60 dark:text-foreground-dark/60 text-sm text-center mt-5 mb-6">No more comments</Text>
                        return <></>
                    }}
                />
            </BottomSheetModal>
        </>
    )
}

const ChatInput = ({ postId, handleRefresh }: { postId: string; handleRefresh: () => void }) => {
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)

    const { user } = useSessionStore()
    const queryClient = useQueryClient()
    const colorScheme = useColorScheme()

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
        <>
            <BottomSheetTextInput
                className={`w-full shrink border border-foreground-light/20 dark:border-foreground-dark/20 px-3 py-4 rounded-l-[24px] rounded-r text-black dark:text-white bg-foreground-light/10 dark:bg-foreground-dark/10 ${loading ? 'opacity-50' : 'opacity-100'}`}
                placeholder="Comment..."
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
        </>
    )
}

const CommentComp = ({ item }: { item: CommentProps }) => {
    const colorScheme = useColorScheme()
    return (
        <View className='flex flex-col gap-0.5 mb-4 px-6'>
            <View className='gap-2 flex-row items-center'>
                <View className='w-10 h-10 rounded-full overflow-hidden'>
                    <Image
                        style={{
                            flex: 1,
                            width: '100%',
                            backgroundColor: `${colors.foreground[colorScheme]}10`,
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

const ItemSkeleton = ({ count }: { count: number; }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <View key={i} className='flex flex-col gap-0.5 mb-4 px-6'>
                    <View className='gap-2 flex-row items-center'>
                        <View className='w-10 h-10 rounded-full overflow-hidden bg-foreground-light/5 dark:bg-foreground-dark/5' />
                        <View className='flex-col gap-1'>
                            <View className='h-3 w-24 rounded bg-foreground-light/5 dark:bg-foreground-dark/5' />
                            <View className='h-3 w-40 rounded bg-foreground-light/5 dark:bg-foreground-dark/5' />
                        </View>
                    </View>
                    <View className='flex-col gap-1'>
                        <View className='h-3 bg-foreground-light/5 dark:bg-foreground-dark/5 ml-12' />
                        <View className='h-3 bg-foreground-light/5 dark:bg-foreground-dark/5 ml-12' />
                        <View className='h-3 bg-foreground-light/5 dark:bg-foreground-dark/5 ml-12' />
                        <View className='h-3 w-20 bg-foreground-light/5 dark:bg-foreground-dark/5 ml-12' />
                    </View>
                </View>
            ))}
        </>
    )
}