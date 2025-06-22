import { useSessionStore } from '@/lib/zustand/useSessionStore'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useColorScheme } from '@/hooks/useColorScheme'
import { View, Text, Pressable, StatusBar } from 'react-native'
import { Image } from 'expo-image';
import { colors } from '@/constants/Colors'
import { useCallback, useMemo, useRef, useState } from 'react'
import { BottomSheetFlatList, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import api from '@/lib/api';
import { useLikesQuery } from '@/queries/useLikesQuery';
import type { LikeProps } from '@/types/like';
import { useQueryClient } from '@tanstack/react-query';

export default function LikePost({ id, postLikes, postLikers }: { id: string; postLikes: number, postLikers: LikeProps[] }) {
    const { user } = useSessionStore()
    const colorScheme = useColorScheme()

    const [loading, setLoading] = useState(false)
    const [likes, setLikes] = useState(postLikes)
    const [likers, setLikers] = useState(postLikers)
    const [page, setPage] = useState(1)

    const { data, isLoading, nextPage } = useLikesQuery('', page, id)
    const queryClient = useQueryClient();

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
            if (likers.some(liker => liker.user.id === user.id)) {
                setLikes(prevLikes => prevLikes - 1);
                setLikers(prev => prev.filter(liker => liker.user.id !== user!.id));
                await api.delete(`/post/like?user=${user.id}&post=${id}`);
            } else {
                setLikes(prevLikes => prevLikes + 1);
                setLikers(prev => [...prev, { createdAt: new Date(), postId: id, updatedAt: new Date(), userId: user.id, user }!]);
                const res = await api.post(`/post/like`, {
                    postId: id,
                    userId: user.id
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (res) {
                    await queryClient.invalidateQueries({
                        refetchType: "active",
                        queryKey: ["news"],
                    });
                }
            }
        } catch (err) {
            setLikes(postLikes);
            setLikers(postLikers)
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <View className='flex-row items-center gap-2 min-w-20 shrink-0'>
                <Pressable onPress={likeFxn} className='mt-2'>
                    <FontAwesome
                        className='mb-1.5'
                        size={22}
                        name={user?.id && likers.some(liker => liker.user.id === user.id) ? 'heart' : 'heart-o'}
                        color={user?.id && likers.some(liker => liker.user.id === user.id) ? `${colors.danger[colorScheme]}e0` : `${colors.foreground[colorScheme]}e0`}
                    />
                </Pressable>
                <Pressable onPress={presentModal} className='min-w-6'>
                    <Text className='text-foreground-light/60 dark:text-foreground-dark text-sm'>
                        {likes.toLocaleString('en-US')}
                    </Text>
                </Pressable>
            </View>
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
                    <BottomSheetFlatList
                        data={[...new Map([...data, ...likers].map(item => [item.user.id, item])).values()]}
                        keyExtractor={(item) => `${item.user.id}`}
                        showsVerticalScrollIndicator={false}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.2}
                        renderItem={({ item }) => (
                            <View className='gap-2 flex-row items-center mb-2'>
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
                                        transition={1000}
                                    />
                                </View>
                                <View>
                                    <Text className='text-foreground-light dark:text-foreground-dark'>{item.user.name}</Text>
                                    <Text className='text-[#aaa]'>{item.user.email}</Text>
                                </View>
                            </View>
                        )}
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
                </BottomSheetView>
            </BottomSheetModal>
        </>
    )
}