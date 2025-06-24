import { useSessionStore } from '@/lib/zustand/useSessionStore'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useColorScheme } from '@/hooks/useColorScheme'
import { View, Text, Pressable, StatusBar } from 'react-native'
import { Image } from 'expo-image';
import { colors } from '@/constants/Colors'
import { useCallback, useMemo, useRef, useState } from 'react'
import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet'
import api from '@/lib/api';
import { useLikesQuery } from '@/queries/useLikesQuery';
import type { LikeProps } from '@/types/like';
import { useQueryClient } from '@tanstack/react-query';

const keyExtractor = (item: LikeProps) => `${item.user.id}`

export default function LikePost({ id, postLikes, postLikers }: { id: string; postLikes: number, postLikers: LikeProps[] }) {
    const { user } = useSessionStore()
    const colorScheme = useColorScheme()
    const queryClient = useQueryClient();

    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)

    const { data, isLoading, nextPage } = useLikesQuery('', page, id)
    const likes = useMemo(() => [...new Map([...data, ...postLikers].map(item => [item.user.id, item])).values()], [data, postLikers]);

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
    const snapPoints = useMemo(() => ['65%', '100%'], []);

    const likeFxn = async () => {
        if (loading || !user?.id) return
        try {
            setLoading(true)
            if (postLikers.some(liker => liker.user.id === user.id)) {
                const res = await api.delete(`/post/like?user=${user.id}&post=${id}`);
                if (res)
                    await queryClient.invalidateQueries({
                        refetchType: "active",
                        queryKey: ["post"],
                    });
            } else {
                const res = await api.post(`/post/like`, {
                    postId: id,
                    userId: user.id
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (res)
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

    return (
        <>
            <View className='flex-row items-center gap-2 min-w-20 shrink-0'>
                <Pressable onPress={likeFxn} className='mt-1.5'>
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
                backdropComponent={(props) => <BottomSheetBackdrop
                    {...props}
                    appearsOnIndex={0}
                    disappearsOnIndex={-1}
                    pressBehavior="close"
                />}
            >
                <BottomSheetFlatList
                    data={likes}
                    keyExtractor={keyExtractor}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    contentContainerStyle={{ paddingBottom: 20, paddingTop: 12 }}
                    onEndReachedThreshold={0.2}
                    renderItem={({ item }) => <LikeComp item={item} />}
                    ListEmptyComponent={() => {
                        if (isLoading) return (
                            <>
                                <View className='w-full bg-foreground-light/20 dark:bg-foreground-dark/20 h-5 rounded'></View>
                                <View className='w-full bg-foreground-light/20 dark:bg-foreground-dark/20 h-5 rounded'></View>
                            </>
                        )
                        return <Text className="text-black dark:text-white text-center mt-10">No likes yet!</Text>
                    }}
                />
            </BottomSheetModal>
        </>
    )
}


const LikeComp = ({ item }: { item: LikeProps }) => {
    return (
        <View className='gap-2 flex-row items-center mb-4 px-4'>
            <View className='w-14 h-14 rounded-full overflow-hidden'>
                <Image
                    style={{
                        flex: 1,
                        width: '100%',
                        backgroundColor: '#0553',
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