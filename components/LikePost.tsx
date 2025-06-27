import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetHandle, BottomSheetModal } from '@gorhom/bottom-sheet'
import { View, Text, Pressable, StatusBar } from 'react-native'
import { useSessionStore } from '@/lib/zustand/useSessionStore'
import { useCallback, useMemo, useRef, useState } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useLikesQuery } from '@/queries/useLikesQuery'
import { useQueryClient } from '@tanstack/react-query'
import type { LikeProps } from '@/types/like'
import { colors } from '@/constants/Colors'
import { Image } from 'expo-image'
import api from '@/lib/api'

const keyExtractor = (item: LikeProps) => `${item.postId}_${item.user.id}`

export default function LikePost({ id, postLikes, postLikers }: { id: string; postLikes: number, postLikers: LikeProps[] }) {
    const { user } = useSessionStore()
    const colorScheme = useColorScheme()
    const queryClient = useQueryClient();

    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)

    const { data, isLoading, nextPage } = useLikesQuery('', page, id)
    const likes = useMemo(() => data, [data]);

    const handleLoadMore = () => {
        if (nextPage) setPage(prev => prev + 1)
    }

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const presentModal = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const closeModal = useCallback(() => {
        bottomSheetModalRef.current?.close();
    }, []);
    const snapPoints = useMemo(() => ['65%'], []);

    const likeFxn = async () => {
        if (loading || !user?.id) return
        try {
            setLoading(true)
            if (postLikers.some(liker => liker.user.id === user.id))
                await api.delete(`/post/like?user=${user.id}&post=${id}`).then(async () => {
                    await queryClient.invalidateQueries({
                        refetchType: "active",
                        queryKey: ["post"],
                    });
                    await queryClient.invalidateQueries({
                        refetchType: "active",
                        queryKey: ["like"],
                    })
                })
            else
                await api.post(`/post/like`, {
                    postId: id,
                    userId: user.id
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }).then(async () => {
                    await queryClient.invalidateQueries({
                        refetchType: "active",
                        queryKey: ["post"],
                    });
                    await queryClient.invalidateQueries({
                        refetchType: "active",
                        queryKey: ["like"],
                    })
                })
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <View className='flex-row items-center gap-2 min-w-20 shrink-0'>
                <Pressable onPress={likeFxn} disabled={loading} className='mt-1.5'>
                    <FontAwesome
                        className='mb-1.5'
                        size={22}
                        name={user?.id && postLikers.some(liker => liker.user.id === user.id)
                            ? loading
                                ? 'heart-o'
                                : 'heart'
                            : loading
                                ? 'heart'
                                : 'heart-o'
                        }
                        color={
                            user?.id && postLikers.some(liker => liker.user.id === user.id)
                                ? loading
                                    ? `${colors.foreground[colorScheme]}e0`
                                    : `${colors.danger[colorScheme]}e0`
                                : loading
                                    ? `${colors.danger[colorScheme]}e0`
                                    : `${colors.foreground[colorScheme]}e0`
                        }
                    />
                </Pressable>
                <Pressable onPress={presentModal} className='min-w-6'>
                    <Text className='text-foreground-light/60 dark:text-foreground-dark text-sm'>
                        {postLikes.toLocaleString('en-US')}
                    </Text>
                </Pressable>
            </View>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                name='PostLikes'
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
                        <Text className='mt-4 w-full text-center text-foreground-light/60 dark:text-foreground-dark/60'>Likes</Text>
                    </BottomSheetHandle>
                )}
            >
                <BottomSheetFlatList
                    data={likes}
                    keyExtractor={keyExtractor}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    contentContainerStyle={{ paddingBottom: 20, paddingTop: 2 }}
                    onEndReachedThreshold={0.2}
                    renderItem={({ item }) => <LikeComp item={item} />}
                    ListEmptyComponent={() => {
                        if (isLoading) return <ItemSkeleton count={10} />
                        return <Text className="text-foreground-light dark:text-foreground-dark text-center mt-44">No likes yet!</Text>
                    }}
                    ListFooterComponent={() => {
                        if (isLoading) return <ItemSkeleton count={1} />
                        if (likes.length > 0 && !isLoading) return <Text className="text-foreground-light/60 dark:text-foreground-dark/60 text-sm text-center mt-5 mb-6">No more likes</Text>
                        return <></>
                    }}
                />
            </BottomSheetModal>
        </>
    )
}


const LikeComp = ({ item }: { item: LikeProps }) => {
    const colorScheme = useColorScheme()
    return (
        <View className='gap-2 flex-row items-center mb-4 px-4'>
            <View className='w-14 h-14 rounded-full overflow-hidden'>
                <Image
                    style={{
                        flex: 1,
                        width: '100%',
                        backgroundColor: `${colors.foreground[colorScheme]}10`,
                        borderRadius: '100%'
                    }}
                    source={item?.user.image}
                    contentFit="cover"
                />
            </View>
            <View>
                <Text className='text-foreground-light dark:text-foreground-dark'>{item.user.name}</Text>
                <Text className='text-[#aaa]'>{item.user.email}</Text>
            </View>
        </View>
    )
}

const ItemSkeleton = ({ count }: { count: number; }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <View key={i} className='gap-2 flex-row items-center mb-4 px-4'>
                    <View className='w-14 h-14 rounded-full overflow-hidden bg-foreground-light/5 dark:bg-foreground-dark/5' />
                    <View className='flex-col gap-1'>
                        <View className='h-4 w-28 bg-foreground-light/5 dark:bg-foreground-dark/5' />
                        <View className='h-4 w-44 bg-foreground-light/5 dark:bg-foreground-dark/5' />
                    </View>
                </View>
            ))}
        </>
    )
}